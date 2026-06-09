import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, FiUploadCloud, FiCopy, FiEye, FiDownload, 
  FiTrash2, FiInfo, FiTrendingUp, FiCheck, FiX 
} from 'react-icons/fi';
import useSettings from '../../hooks/useSettings';
import { uploadFile, deleteFile } from '../../firebase/storage';
import { 
  subscribeToResumeMeta, saveResumeMeta, 
  incrementDownloadCount, deleteResumeMeta 
} from '../../firebase/resume';
import { logActivity } from '../../firebase/activity';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

const formatBytes = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function ResumeManager() {
  const { settings, loading, updateSettings } = useSettings();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [resumeMeta, setResumeMeta] = useState({
    fileName: '',
    uploadDate: '',
    downloadURL: '',
    fileSize: 0,
    downloadCount: 0
  });

  // Real-time resumeMeta subscription
  useEffect(() => {
    const unsubscribe = subscribeToResumeMeta((meta) => {
      setResumeMeta(meta || {
        fileName: '',
        uploadDate: '',
        downloadURL: '',
        fileSize: 0,
        downloadCount: 0
      });
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentResumeUrl = resumeMeta.downloadURL || settings?.resumeUrl || '';
  const currentFilename = resumeMeta.fileName || settings?.resumeFilename || 'resume.pdf';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndUpload = async (file) => {
    if (!file) return;

    // Validate MIME Type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF documents are accepted');
      return;
    }

    // Validate Size (Max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('File size exceeds the 10MB limit');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Upload file to Firebase Storage (always overwrite same path)
      const downloadUrl = await uploadFile(file, 'resume', (pct) => {
        setProgress(pct);
      }, 'resume.pdf');

      const uploadDateStr = new Date().toISOString();

      // Save metadata to Firestore resumeMeta/current
      const newMeta = {
        fileName: file.name,
        uploadDate: uploadDateStr,
        downloadURL: downloadUrl,
        fileSize: file.size,
        downloadCount: resumeMeta.downloadCount || 0
      };
      await saveResumeMeta(newMeta);

      // Update settings document as well
      const updatedSettings = {
        ...settings,
        resumeUrl: downloadUrl,
        resumeFilename: file.name,
        resumeUploadDate: uploadDateStr
      };
      await updateSettings(updatedSettings);

      // Log activity manually
      await logActivity('resume_upload', `Uploaded resume: ${file.name}`);

      toast.success('Resume uploaded successfully ✓');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload resume document');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleCopyLink = () => {
    if (!currentResumeUrl) {
      toast.error('No resume URL available');
      return;
    }
    const fullUrl = currentResumeUrl.startsWith('http') || currentResumeUrl.startsWith('data:')
      ? currentResumeUrl 
      : `${window.location.origin}${currentResumeUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Resume download link copied to clipboard');
    
    // Increment download count on copy
    incrementDownloadCount().catch(err => console.error(err));
  };

  const handleDownloadClick = () => {
    incrementDownloadCount().catch(err => console.error(err));
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove the current resume? This cannot be undone.')) return;

    try {
      if (currentResumeUrl && (currentResumeUrl.startsWith('http') || currentResumeUrl.startsWith('gs://')) && !currentResumeUrl.startsWith('data:')) {
        await deleteFile(currentResumeUrl);
      }
      
      // Delete metadata in Firestore resumeMeta/current
      await deleteResumeMeta();

      // Clear fields in settings
      const updatedSettings = {
        ...settings,
        resumeUrl: '',
        resumeFilename: '',
        resumeUploadDate: ''
      };
      await updateSettings(updatedSettings);

      // Log activity manually
      await logActivity('resume_delete', 'Removed active resume document');

      toast.success('Resume file deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove resume file');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-text-secondary-dark">
        Syncing resume file metadata...
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1A24] border border-border-dark p-6 rounded-2xl">
        <div>
          <h1 className="text-xl font-display font-extrabold text-text-primary-dark">
            Resume &amp; CV Manager
          </h1>
          <p className="text-xs font-mono text-text-secondary-dark mt-1">
            Upload, update, and monitor downloads for your primary professional resume PDF.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-[10px] font-mono font-bold uppercase tracking-wider self-start md:self-auto">
          <FiTrendingUp className="w-3.5 h-3.5" />
          Active Document
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Upload zone and stats */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Upload card */}
          <motion.div variants={itemVariants} className="bg-[#1A1A24] border border-border-dark rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase text-text-primary-dark border-b border-border-dark pb-3">
              Upload Document
            </h2>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".pdf,application/pdf"
              className="hidden"
            />

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border-dark hover:border-primary/50 bg-[#0D0D14]/60'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-4 bg-[#1A1A24] rounded-2xl border transition-all ${
                  dragActive ? 'border-primary text-primary' : 'border-border-dark text-text-secondary-dark'
                }`}>
                  <FiUploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-text-primary-dark block">
                    Drag &amp; Drop Resume PDF Here
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary-dark block mt-1">
                    Or click to navigate file system (PDF only, max 10MB)
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary-dark uppercase font-bold">
                  <span>Uploading to cloud storage...</span>
                  <span className="text-primary">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-dark rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Current file description */}
          {currentResumeUrl && (
            <motion.div variants={itemVariants} className="bg-[#1A1A24] border border-border-dark rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-text-primary-dark flex items-center gap-2">
                <FiInfo className="text-primary" />
                Active Resume Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0D0D14]/50 border border-border-dark/60 rounded-xl p-4">
                <div>
                  <span className="text-[9px] font-mono text-text-secondary-dark uppercase block">
                    File Name
                  </span>
                  <span className="text-xs font-mono font-bold text-text-primary-dark truncate block mt-0.5" title={currentFilename}>
                    {currentFilename}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-text-secondary-dark uppercase block">
                    Upload Date
                  </span>
                  <span className="text-xs font-mono font-bold text-text-primary-dark block mt-0.5">
                    {resumeMeta.uploadDate ? new Date(resumeMeta.uploadDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Unknown Date'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-text-secondary-dark uppercase block">
                    File Size
                  </span>
                  <span className="text-xs font-mono font-bold text-text-primary-dark block mt-0.5">
                    {formatBytes(resumeMeta.fileSize)}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[9px] font-mono text-text-secondary-dark uppercase block">
                    Download URL
                  </span>
                  <span className="text-xs font-mono font-bold text-primary truncate block mt-0.5 select-all" title={currentResumeUrl}>
                    {currentResumeUrl}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setPreviewOpen(true)}
                >
                  <FiEye className="w-4 h-4 mr-1.5" />
                  Preview Document
                </Button>
                <a 
                  href={currentResumeUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  download={currentFilename}
                  onClick={handleDownloadClick}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/5 border-border-dark text-text-primary-dark hover:bg-white/10"
                  >
                    <FiDownload className="w-4 h-4 mr-1.5" />
                    Download File
                  </Button>
                </a>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  onClick={handleDeleteResume}
                >
                  <FiTrash2 className="w-4 h-4 mr-1.5" />
                  Remove
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Side: URL Link & Downloads counter */}
        <div className="space-y-6">
          
          {/* Download stat card */}
          <motion.div variants={itemVariants} className="bg-[#1A1A24] border border-border-dark rounded-2xl p-6 text-center flex flex-col justify-between h-40">
            <div>
              <span className="text-[10px] font-mono font-bold text-text-secondary-dark uppercase block">
                Total Resume Downloads
              </span>
              <span className="text-4xl font-display font-black text-primary mt-3 block">
                {resumeMeta.downloadCount || 0}
              </span>
            </div>
            <span className="text-[8px] font-mono text-text-secondary-dark block">
              Downloads from public Connect section card.
            </span>
          </motion.div>

          {/* Copyable link card */}
          <motion.div variants={itemVariants} className="bg-[#1A1A24] border border-border-dark rounded-2xl p-6 space-y-4">
            <span className="text-[10px] font-mono font-bold text-text-secondary-dark uppercase block">
              Shareable Download Link
            </span>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={currentResumeUrl ? (currentResumeUrl.startsWith('http') || currentResumeUrl.startsWith('data:') ? currentResumeUrl : `${window.location.origin}${currentResumeUrl}`) : 'No document uploaded'}
                className="w-full h-10 pl-3 pr-10 bg-surface-dark border border-border-dark rounded-lg text-text-secondary-dark font-sans text-xs outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                disabled={!currentResumeUrl}
                className="absolute right-1 top-1 p-2 bg-[#1A1A24] hover:bg-white/5 border border-border-dark/60 rounded-md text-text-secondary-dark hover:text-primary transition-all disabled:opacity-50"
                title="Copy URL"
              >
                <FiCopy className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[8px] font-mono text-text-secondary-dark block leading-relaxed">
              Use this permanent link in external portfolios, social links, or CV aggregators.
            </span>
          </motion.div>
        </div>
      </div>

      {/* PDF Fullscreen Preview Modal */}
      <AnimatePresence>
        {previewOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl h-[85vh] bg-[#1A1A24] border border-border-dark rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark bg-[#111118]">
                <div className="flex items-center gap-3">
                  <FiFileText className="text-primary w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase text-text-primary-dark">
                    Preview: {currentFilename}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-1 text-text-secondary-dark hover:text-white hover:bg-white/5 border border-border-dark rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* PDF Preview Content */}
              <div className="flex-1 bg-[#0D0D14]">
                <iframe
                  src={currentResumeUrl}
                  title="Resume PDF Preview"
                  className="w-full h-full border-none"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
