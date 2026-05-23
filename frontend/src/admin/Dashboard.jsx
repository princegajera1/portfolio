import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, isFirebaseConfigured, storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { getProjects } from '../firebase/projects';
import { getSkills } from '../firebase/skills';
import { getMessages } from '../firebase/messages';
import { getExperience } from '../firebase/experience';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

export default function Dashboard() {
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ projects: 0, messages: 0, skills: 0, experience: 0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Resume states
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [resumeData, setResumeData] = useState({ url: '/resume.pdf', filename: 'resume.pdf', uploadedAt: null });
  const [isDragOver, setIsDragOver] = useState(false);

  // Greeting & Live Ticking Clock states
  const [greeting, setGreeting] = useState('');
  const [liveTime, setLiveTime] = useState('');
  const [lastSession, setLastSession] = useState('');

  // Update last session date on load
  useEffect(() => {
    const session = localStorage.getItem('last_admin_session');
    if (session) {
      setLastSession(session);
    } else {
      setLastSession('First session in this browser');
    }
    // Store current session time
    const now = new Date();
    localStorage.setItem(
      'last_admin_session',
      now.toLocaleDateString() + ' @ ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }, []);

  // Time & Greeting Tick Effect
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const updateClock = () => {
      const now = new Date();
      const HH = String(now.getHours()).padStart(2, '0');
      const MM = String(now.getMinutes()).padStart(2, '0');
      const SS = String(now.getSeconds()).padStart(2, '0');
      setLiveTime(`${HH}:${MM}:${SS}`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time synchronization
  useEffect(() => {
    let unsubProjects = () => {};
    let unsubMessages = () => {};
    let unsubResume = () => {};

    if (isFirebaseConfigured && db) {
      // 1. Projects listener
      unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
        setStats((prev) => ({ ...prev, projects: snapshot.size }));
      }, (err) => {
        console.error("Projects snapshot error:", err);
      });

      // 2. Messages listener
      unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
        const msgs = snapshot.docs.map(doc => doc.data());
        const unread = msgs.filter(m => !m.read).length;
        setUnreadCount(unread);
        setStats((prev) => ({ ...prev, messages: snapshot.size }));
      }, (err) => {
        console.error("Messages snapshot error:", err);
      });

      // 3. Resume doc listener
      unsubResume = onSnapshot(doc(db, 'settings', 'resume'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setResumeData({
            url: data.url || '/resume.pdf',
            filename: data.filename || 'resume.pdf',
            uploadedAt: data.uploadedAt || null
          });
          if (data.url) {
            localStorage.setItem('resume_url', data.url);
          }
        } else {
          setResumeData({ url: '/resume.pdf', filename: 'resume.pdf', uploadedAt: null });
        }
      }, (err) => {
        console.error("Resume doc snapshot error:", err);
      });

      // Also get experience and skills count statically once (or listen if needed)
      const fetchStaticCounts = async () => {
        try {
          const [skills, exp] = await Promise.all([
            getSkills(),
            getExperience()
          ]);
          setStats(prev => ({
            ...prev,
            skills: skills.length,
            experience: exp.length
          }));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchStaticCounts();

    } else {
      // Local Mock DB mode listeners (simple interval/local check)
      const checkLocalDatabase = () => {
        const localProjs = JSON.parse(localStorage.getItem('prince_projects') || '[]');
        const localMsgs = JSON.parse(localStorage.getItem('prince_messages') || '[]');
        const localSkills = JSON.parse(localStorage.getItem('prince_skills') || '[]');
        const localExp = JSON.parse(localStorage.getItem('prince_experience') || '[]');
        const localResume = JSON.parse(localStorage.getItem('prince_resume_metadata') || '{}');

        const unread = localMsgs.filter(m => !m.read).length;
        setUnreadCount(unread);
        localStorage.setItem('prince_unread_count', unread);

        setStats({
          projects: localProjs.length > 0 ? localProjs.length : 19,
          messages: localMsgs.length > 0 ? localMsgs.length : 2,
          skills: localSkills.length > 0 ? localSkills.length : 18,
          experience: localExp.length > 0 ? localExp.length : 3,
        });

        if (localResume.url) {
          if (localResume.url.startsWith('blob:')) {
            localStorage.removeItem('resume_url');
            localStorage.removeItem('prince_resume_metadata');
            setResumeData({ url: '/resume.pdf', filename: 'resume.pdf', uploadedAt: null });
          } else {
            setResumeData({
              url: localResume.url,
              filename: localResume.filename || 'resume.pdf',
              uploadedAt: localResume.uploadedAt
            });
          }
        } else {
          setResumeData({ url: '/resume.pdf', filename: 'resume.pdf', uploadedAt: null });
        }
        setLoading(false);
      };

      checkLocalDatabase();
      const interval = setInterval(checkLocalDatabase, 1500);
      return () => clearInterval(interval);
    }

    return () => {
      unsubProjects();
      unsubMessages();
      unsubResume();
    };
  }, []);

  // File uploading & drag over handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleSelectedFile(file);
  };

  const handleSelectedFile = (file) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error("Please select a valid PDF file");
        setResumeFile(null);
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error("PDF size exceeds 4MB limit");
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleSelectedFile(file);
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    // Validate size and format again
    if (resumeFile.type !== 'application/pdf' || resumeFile.size > 4 * 1024 * 1024) {
      toast.error("Please select a valid PDF under 4MB");
      return;
    }

    setUploadProgress(10);

    // Mock Mode upload simulation
    if (!isFirebaseConfigured || !storage) {
      setTimeout(() => setUploadProgress(40), 300);
      setTimeout(() => setUploadProgress(75), 600);
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Url = reader.result;
            const metadata = {
              url: base64Url,
              filename: resumeFile.name,
              uploadedAt: new Date().toISOString()
            };
            localStorage.setItem('resume_url', base64Url);
            localStorage.setItem('prince_resume_metadata', JSON.stringify(metadata));
            setResumeData(metadata);
            toast.success("Resume uploaded successfully!");
            setResumeFile(null);
            setUploadProgress(null);
          };
          reader.readAsDataURL(resumeFile);
        }, 300);
      }, 900);
      return;
    }

    // Live Firebase Storage upload
    try {
      const storageRef = ref(storage, 'resume/prince_gajera_resume.pdf');
      const uploadTask = uploadBytesResumable(storageRef, resumeFile);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error(error);
          toast.error(`Upload failed: ${error.message}`);
          setUploadProgress(null);
        }, 
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const metadata = {
              url: downloadUrl,
              filename: resumeFile.name,
              uploadedAt: new Date().toISOString()
            };
            
            // Save to Firestoresettings/resume
            await setDoc(doc(db, 'settings', 'resume'), metadata);
            
            localStorage.setItem('resume_url', downloadUrl);
            setResumeData(metadata);
            toast.success("Resume uploaded successfully!");
            setResumeFile(null);
            setUploadProgress(null);
          } catch (dbErr) {
            console.error(dbErr);
            toast.error(`Failed to update settings doc: ${dbErr.message}`);
            setUploadProgress(null);
          }
        }
      );
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error occurred during upload.');
      setUploadProgress(null);
    }
  };

  const handleViewPdf = () => {
    if (resumeData.url) {
      if (resumeData.url.startsWith('blob:')) {
        localStorage.removeItem('resume_url');
        localStorage.removeItem('prince_resume_metadata');
        setResumeData({ url: '/resume.pdf', filename: 'resume.pdf', uploadedAt: null });
        toast.error("The previous session's resume file has expired. Please upload a new PDF.");
        return;
      }
      
      try {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Prince Gajera - Resume</title>
                <style>
                  body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #0b0f19; }
                  iframe { border: none; width: 100%; height: 100%; }
                </style>
              </head>
              <body>
                <iframe src="${resumeData.url}"></iframe>
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          toast.error("Popup blocked! Please allow popups to view the resume.");
        }
      } catch (err) {
        console.error("Error opening PDF:", err);
        toast.error("Could not display resume.");
      }
    } else {
      toast.info("No resume uploaded yet");
    }
  };

  const handleShowHistoryInfo = async () => {
    await confirm({
      title: "Experience Nodes Cataloged",
      subtitle: "Experience timeline is managed via experience.js or through custom Firestore entries. All nodes render beautifully on the client page.",
      confirmLabel: "Understood",
      confirmVariant: "primary"
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-500 font-mono text-xs uppercase tracking-widest gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        Calculating portfolio stats...
      </div>
    );
  }

  // Format File Size
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format Date ISO
  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* 🚀 Welcome Banner */}
      <div className="relative p-8 rounded-2xl border-l-[3px] border-primary bg-gradient-to-br from-[#0d0d1a] to-[#13132a] shadow-[0_0_25px_rgba(124,111,255,0.06)] overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-wide">
            {greeting}, Prince! 👋
          </h1>
          <p className="text-muted text-xs sm:text-sm font-sans font-light">
            Last session: <span className="text-secondary font-semibold font-mono">{lastSession}</span>
          </p>
        </div>
        
        {/* Monospace live clock tag in top-right */}
        <div className="font-mono text-secondary bg-[#06060F] border border-secondary/20 px-4 py-2 rounded-full text-sm sm:text-base font-bold shadow-[0_0_15px_rgba(0,229,255,0.08)] select-none">
          🕒 {liveTime || "00:00:00"}
        </div>
      </div>

      {/* 📊 Upgraded Stats Cards with left border accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 select-none font-mono">
        {/* Card 1 */}
        <div 
          onClick={() => navigate('/admin/projects')}
          className="bg-[#0d0d1a] p-6 rounded-2xl border border-white/5 border-l-[4px] border-l-primary hover:shadow-[0_0_20px_rgba(124,111,255,0.12)] hover:-translate-y-1 hover:border-white/10 cursor-pointer active:scale-95 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start text-muted text-xs tracking-wider uppercase">
            <span>Repos / Projects</span>
            <span className="text-base select-none">📁</span>
          </div>
          
          <p className="text-3xl sm:text-4xl font-extrabold font-display text-primary mt-4 tracking-tight">
            {stats.projects}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-success font-bold">
              +{stats.projects} total
            </span>
            <span className="text-[10px] text-muted hover:text-white flex items-center gap-1 transition-colors font-sans">
              Manage &rarr;
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => navigate('/admin/messages')}
          className="bg-[#0d0d1a] p-6 rounded-2xl border border-white/5 border-l-[4px] border-l-secondary hover:shadow-[0_0_20px_rgba(0,229,255,0.12)] hover:-translate-y-1 hover:border-white/10 cursor-pointer active:scale-95 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start text-muted text-xs tracking-wider uppercase">
            <span>Client Messages</span>
            <span className="text-base select-none">💬</span>
          </div>
          
          <p className="text-3xl sm:text-4xl font-extrabold font-display text-secondary mt-4 tracking-tight">
            {stats.messages}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <span className={`text-[10px] font-bold ${unreadCount > 0 ? 'text-danger' : 'text-success'}`}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All read ✓'}
            </span>
            <span className="text-[10px] text-muted hover:text-white flex items-center gap-1 transition-colors font-sans">
              Manage &rarr;
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => navigate('/admin/skills')}
          className="bg-[#0d0d1a] p-6 rounded-2xl border border-white/5 border-l-[4px] border-l-accent hover:shadow-[0_0_20px_rgba(255,95,158,0.12)] hover:-translate-y-1 hover:border-white/10 cursor-pointer active:scale-95 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start text-muted text-xs tracking-wider uppercase">
            <span>Skills Listed</span>
            <span className="text-base select-none">⚡</span>
          </div>
          
          <p className="text-3xl sm:text-4xl font-extrabold font-display text-accent mt-4 tracking-tight">
            {stats.skills}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-success font-bold">
              3 categories
            </span>
            <span className="text-[10px] text-muted hover:text-white flex items-center gap-1 transition-colors font-sans">
              Manage &rarr;
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={handleShowHistoryInfo}
          className="bg-[#0d0d1a] p-6 rounded-2xl border border-white/5 border-l-[4px] border-l-white hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-white/10 cursor-pointer active:scale-95 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start text-muted text-xs tracking-wider uppercase">
            <span>History Nodes</span>
            <span className="text-base select-none">🕐</span>
          </div>
          
          <p className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-4 tracking-tight">
            {stats.experience}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-success font-bold">
              Timeline
            </span>
            <span className="text-[10px] text-muted flex items-center gap-1 font-sans">
              Details &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* 💼 Upgrade main section: Database Managers & Resume administrator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Upgraded Database Managers */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-white font-display text-base font-bold border-l-2 border-primary pl-3">Database Managers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
            {/* Manager 1 */}
            <button 
              onClick={() => navigate('/admin/projects')}
              className="bg-[#0d0d1a] border border-white/5 border-l-[3px] border-l-primary hover:border-primary/50 p-5 rounded-2xl text-left transition-all duration-300 group hover:shadow-lg hover:shadow-white/[0.01] flex flex-col justify-between min-h-[130px]"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  📁
                </span>
                <span className="text-[8px] font-mono font-bold tracking-widest bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-primary">
                  CRUD
                </span>
              </div>
              
              <div>
                <h3 className="text-white font-bold font-display text-xs group-hover:text-primary transition-colors mt-2">Projects CRUD</h3>
                <p className="text-muted text-[11px] leading-relaxed mt-1 font-light">Add or modify your GitHub projects, tags, and deployment URLs.</p>
              </div>
            </button>

            {/* Manager 2 */}
            <button 
              onClick={() => navigate('/admin/skills')}
              className="bg-[#0d0d1a] border border-white/5 border-l-[3px] border-l-secondary hover:border-secondary/50 p-5 rounded-2xl text-left transition-all duration-300 group hover:shadow-lg hover:shadow-white/[0.01] flex flex-col justify-between min-h-[130px]"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  ⚡
                </span>
                <span className="text-[8px] font-mono font-bold tracking-widest bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded text-secondary">
                  LEVELS
                </span>
              </div>
              
              <div>
                <h3 className="text-white font-bold font-display text-xs group-hover:text-secondary transition-colors mt-2">Skills Panel</h3>
                <p className="text-muted text-[11px] leading-relaxed mt-1 font-light">Adjust your technology matrix and visual bar level indicators.</p>
              </div>
            </button>

            {/* Manager 3 */}
            <button 
              onClick={() => navigate('/admin/messages')}
              className="bg-[#0d0d1a] border border-white/5 border-l-[3px] border-l-accent hover:border-accent/50 p-5 rounded-2xl text-left transition-all duration-300 group hover:shadow-lg hover:shadow-white/[0.01] flex flex-col justify-between min-h-[130px]"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  💬
                </span>
                {unreadCount > 0 ? (
                  <span className="text-[8px] font-mono font-bold tracking-widest bg-danger/10 border border-danger/20 px-2 py-0.5 rounded text-danger animate-pulse">
                    {unreadCount} UNREAD
                  </span>
                ) : (
                  <span className="text-[8px] font-mono font-bold tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted">
                    0 UNREAD
                  </span>
                )}
              </div>
              
              <div>
                <h3 className="text-white font-bold font-display text-xs group-hover:text-accent transition-colors mt-2">Inbox Messages</h3>
                <p className="text-muted text-[11px] leading-relaxed mt-1 font-light">Check received recruiter pitches, inquiries, and messages.</p>
              </div>
            </button>

            {/* Manager 4 */}
            <button 
              onClick={() => window.open('/', '_blank')}
              className="bg-[#0d0d1a] border border-white/5 border-l-[3px] border-l-success hover:border-success/50 p-5 rounded-2xl text-left transition-all duration-300 group hover:shadow-lg hover:shadow-white/[0.01] flex flex-col justify-between min-h-[130px]"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  🌐
                </span>
                <span className="text-[8px] font-mono font-bold tracking-widest bg-success/10 border border-success/20 px-2 py-0.5 rounded text-success">
                  PUBLIC
                </span>
              </div>
              
              <div>
                <h3 className="text-white font-bold font-display text-xs group-hover:text-success transition-colors mt-2">View Live Site</h3>
                <p className="text-muted text-[11px] leading-relaxed mt-1 font-light">Exit admin panel and view public dark-neon portfolio layouts.</p>
              </div>
            </button>
          </div>
        </div>

        {/* 📄 Upgraded Drag & Drop Resume Uploader Card */}
        <div className="lg:col-span-6 bg-[#0d0d1a] border border-white/5 p-6 rounded-2xl space-y-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <h2 className="text-white font-display text-base font-bold border-l-2 border-secondary pl-3">Resume Administrator</h2>
            <p className="text-muted text-xs font-sans mt-2 leading-relaxed font-light">
              Upload your official resume PDF document. This file is downloadable by recruiters on your public Home Hero section.
            </p>
          </div>

          <form onSubmit={handleResumeUpload} className="space-y-6">
            {/* Dashed Drag & Drop Field Container */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed ${
                isDragOver ? 'border-secondary bg-secondary/15' : 'border-[#7C6FFF]/12 bg-[rgba(0,229,255,0.01)]'
              } hover:border-secondary/40 rounded-2xl p-6 text-center cursor-pointer relative transition-all duration-300`}
            >
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadProgress !== null}
              />
              
              {/* File details or drag instruction */}
              {resumeFile ? (
                <div className="flex flex-col items-center">
                  <span className="text-3xl block mb-2 animate-bounce">
                    📥
                  </span>
                  <p className="text-white text-xs font-semibold font-mono uppercase tracking-wide">
                    {resumeFile.name}
                  </p>
                  <p className="text-secondary text-[10px] font-mono mt-1">
                    {formatBytes(resumeFile.size)} &mdash; Ready to Upload
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-3xl block mb-2 select-none">
                    📄
                  </span>
                  <p className="text-white text-xs font-semibold font-mono uppercase tracking-wide">
                    Select or drag Resume PDF
                  </p>
                  <p className="text-muted text-[10px] font-mono mt-1 uppercase tracking-widest">PDF formats only (Max 4MB)</p>
                </div>
              )}
              
              {/* Show active file name display */}
              {resumeData.url && !resumeFile && (
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-mono text-secondary">
                  <span>📄 Active Document:</span>
                  <span className="underline select-text font-bold max-w-[200px] truncate">
                    {resumeData.filename || 'prince_gajera_resume.pdf'}
                  </span>
                  {resumeData.uploadedAt && (
                    <span className="text-muted text-[9px]">
                      (Updated: {formatDate(resumeData.uploadedAt)})
                    </span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_#00ff88]" />
                </div>
              )}
            </div>

            {/* Progress Bar indicator */}
            {uploadProgress !== null && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-muted">Uploading PDF...</span>
                  <span className="text-secondary font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary shadow-[0_0_8px_#00e5ff]" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary/90 text-dark font-mono uppercase tracking-wider text-xs font-black rounded-xl transition-all duration-300 shadow-lg shadow-secondary/10 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                disabled={!resumeFile || uploadProgress !== null}
              >
                UPLOAD RESUME PDF
              </button>
              
              <button 
                type="button"
                onClick={handleViewPdf}
                disabled={!resumeData.url}
                className="w-full sm:w-auto px-6 py-3 border border-secondary/35 text-secondary hover:text-white hover:bg-secondary/5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none"
              >
                VIEW ACTIVE PDF &rarr;
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
