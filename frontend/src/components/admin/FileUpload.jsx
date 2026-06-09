import { useState, useRef } from 'react';
import { FiUploadCloud, FiFileText, FiImage, FiX, FiCheckCircle } from 'react-icons/fi';
import { uploadFile } from '../../firebase/storage';
import toast from 'react-hot-toast';

export default function FileUpload({
  label,
  value, // existing URL
  onChange, // returns (downloadURL) => {}
  folderPath = 'uploads',
  accept = 'image/*', // 'image/*', 'application/pdf' or '*/*'
  maxSizeMB = 10,
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;

    // Check size limit
    const limitBytes = maxSizeMB * 1024 * 1024;
    if (file.size > limitBytes) {
      toast.error(`File size exceeds the maximum limit of ${maxSizeMB}MB.`);
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Perform upload
      const downloadURL = await uploadFile(file, folderPath, (percent) => {
        setProgress(percent);
      });

      onChange(downloadURL);
      toast.success('File uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[10px] font-mono text-text-secondary-dark uppercase font-bold pl-1">
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[140px] ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border-dark bg-[#0D0D14]/60 hover:border-primary/50'
        } ${uploading ? 'pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          // Uploading State
          <div className="w-full max-w-[240px] space-y-3 text-center">
            <FiUploadCloud className="w-8 h-8 text-primary animate-pulse mx-auto" />
            <div className="text-[10px] font-mono text-text-primary-dark font-bold uppercase">
              Uploading file ({progress}%)
            </div>
            <div className="w-full bg-[#1A1A24] h-1.5 rounded-full overflow-hidden border border-border-dark">
              <div
                className="bg-primary h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : value ? (
          // File Loaded State
          <div className="flex flex-col items-center gap-2 w-full text-center">
            {accept.includes('pdf') ? (
              <FiFileText className="w-10 h-10 text-secondary" />
            ) : (
              <img
                src={value}
                alt="Upload preview"
                className="w-16 h-16 rounded-lg object-cover border border-border-dark shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                }}
              />
            )}
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider mt-1">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Asset Linked</span>
            </div>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[9px] font-mono text-text-secondary-dark hover:text-primary underline max-w-[200px] truncate"
            >
              Open File URL
            </a>
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 p-1.5 bg-[#1A1A24] border border-border-dark hover:border-red-500/40 hover:text-red-400 rounded-lg transition-all"
              title="Remove File"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          // Empty Prompt State
          <div className="text-center space-y-2 select-none">
            {accept.includes('pdf') ? (
              <FiFileText className="w-8 h-8 text-text-secondary-dark mx-auto" />
            ) : (
              <FiImage className="w-8 h-8 text-text-secondary-dark mx-auto" />
            )}
            <div className="text-[10px] font-mono text-text-primary-dark font-bold uppercase">
              Drag & Drop file or click
            </div>
            <div className="text-[8px] font-mono text-text-secondary-dark">
              {accept.replace('/*', '')} formats up to {maxSizeMB}MB
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
