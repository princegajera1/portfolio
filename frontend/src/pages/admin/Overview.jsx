import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiFolder, FiTrendingUp, FiEye, FiDatabase, FiCloud, FiActivity, FiEdit, FiDownload, FiMessageSquare 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Cell
} from 'recharts';
import useProjects from '../../hooks/useProjects';
import useSettings from '../../hooks/useSettings';
import { subscribeToResumeMeta } from '../../firebase/resume';
import { subscribeToActivities } from '../../firebase/activity';
import { subscribeToMessages } from '../../firebase/contact';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
};

const actionMeta = {
  project_add: { label: 'PROJECT ADDED', icon: '➕', color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-800/30' },
  project_edit: { label: 'PROJECT EDITED', icon: '✏️', color: 'text-amber-400', bg: 'bg-amber-950/20', border: 'border-amber-800/30' },
  project_delete: { label: 'PROJECT DELETED', icon: '🗑️', color: 'text-red-400', bg: 'bg-red-950/20', border: 'border-red-800/30' },
  resume_upload: { label: 'RESUME UPLOADED', icon: '📄', color: 'text-cyan-400', bg: 'bg-cyan-950/20', border: 'border-cyan-800/30' },
  resume_delete: { label: 'RESUME REMOVED', icon: '🗑️', color: 'text-red-400', bg: 'bg-red-950/20', border: 'border-red-800/30' },
  message_delete: { label: 'MESSAGE DELETED', icon: '🗑️', color: 'text-red-400', bg: 'bg-red-950/20', border: 'border-red-800/30' }
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#13131A] border border-border-dark p-3 rounded-lg shadow-xl text-xs font-mono">
        <p className="text-white font-bold">{payload[0].payload.fullName}</p>
        <p className="text-primary mt-1">Views: <span className="text-white font-bold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const { projects, loading: loadingProjects } = useProjects();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [resumeDownloads, setResumeDownloads] = useState(0);
  const [activities, setActivities] = useState([]);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [messages, setMessages] = useState([]);

  // Subscribe to real-time resume metadata for download counts
  useEffect(() => {
    const unsubscribe = subscribeToResumeMeta((meta) => {
      setResumeDownloads(meta?.downloadCount || 0);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Subscribe to real-time activity events
  useEffect(() => {
    const unsubscribe = subscribeToActivities((data) => {
      setActivities(data || []);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Subscribe to real-time contact messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages((data) => {
      setMessages(data || []);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const localStorageUsage = useMemo(() => {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += (localStorage[x].length + x.length) * 2; // approximation in bytes
      }
    }
    const kb = (total / 1024).toFixed(1);
    const max = 5120; // 5MB standard limit
    const pct = Math.min(100, parseFloat(((total / (max * 1024)) * 100).toFixed(1)));
    return { kb, pct };
  }, []);

  const handleExportData = () => {
    try {
      const keys = ['prince_projects', 'prince_settings', 'prince_experience', 'prince_messages'];
      const backup = {};
      keys.forEach(k => {
        const val = localStorage.getItem(k);
        if (val) backup[k] = JSON.parse(val);
      });
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `prince_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Portfolio backup JSON exported successfully');
    } catch (err) {
      toast.error('Failed to export backup: ' + err.message);
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!window.confirm('Importing this file will overwrite all your current local project and settings data. Continue?')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        Object.keys(data).forEach(key => {
          if (key.startsWith('prince_')) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });
        toast.success('Portfolio backup restored successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        toast.error('Failed to parse backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handlePurgeCache = () => {
    if (!window.confirm('Reset all admin modifications and restore original seed data? This deletes custom local edits.')) return;
    
    localStorage.removeItem('prince_projects');
    localStorage.removeItem('prince_settings');
    localStorage.removeItem('prince_experience');
    localStorage.removeItem('prince_messages');
    localStorage.removeItem('prince_unread_count');
    localStorage.removeItem('prince_recent_commands');
    
    toast.success('Local cache purged. Reloading database seeds...');
    setTimeout(() => window.location.reload(), 1500);
  };

  const stats = useMemo(() => {
    const totalProjects = projects?.length || 0;
    const totalViews = projects?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
    const featuredProjects = projects?.filter(p => p.featured === true).length || 0;

    return [
      { name: 'Total Projects', value: totalProjects, icon: FiFolder, color: 'text-primary' },
      { name: 'Featured Projects', value: featuredProjects, icon: FiFolder, color: 'text-[#7c3aed]' },
      { name: 'Estimated Views', value: totalViews, icon: FiEye, color: 'text-[#E8FF00]' },
      { name: 'Resume Downloads', value: resumeDownloads, icon: FiDownload, color: 'text-cyan-400' },
      { name: 'Cloud Database', value: 'Firestore', icon: FiDatabase, color: 'text-purple-400' },
      { name: 'Asset Storage', value: 'Firebase', icon: FiCloud, color: 'text-emerald-400' },
      { name: 'System Status', value: 'Online', icon: FiActivity, color: 'text-emerald-400' }
    ];
  }, [projects, resumeDownloads]);

  // Project views chart data (each bar = project title. Shortened to 12 chars if longer)
  const projectViewsData = useMemo(() => {
    if (!projects || projects.length === 0) {
      return [
        { name: 'Ruiz Diamonds', fullName: 'Ruiz Diamonds', views: 320 },
        { name: 'Chandrakant', fullName: 'Chandrakant', views: 240 },
        { name: 'Daily Bite', fullName: 'Daily Bite', views: 190 },
        { name: 'Quiz App', fullName: 'Quiz App', views: 150 },
        { name: 'Dev Orbit', fullName: 'Dev Orbit', views: 110 }
      ];
    }
    return projects.map(p => ({
      name: p.title.length > 12 ? `${p.title.slice(0, 9)}...` : p.title,
      fullName: p.title,
      views: p.views || 0
    }));
  }, [projects]);

  const recentProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [projects]);

  const loading = loadingProjects;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1A24] border border-border-dark p-6 rounded-2xl">
        <div>
          <h1 className="text-xl font-display font-extrabold text-text-primary-dark">
            Dashboard Overview
          </h1>
          <p className="text-xs font-mono text-text-secondary-dark mt-1">
            Welcome back, Administrator. Here's a brief snapshot of your portfolio metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
          <FiTrendingUp className="w-3.5 h-3.5" />
          Live Analytics Enabled
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              variants={itemVariants}
              className="bg-[#1A1A24] border border-border-dark p-5 rounded-xl flex flex-col justify-between h-28"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-text-secondary-dark uppercase block leading-tight">
                  {stat.name}
                </span>
                <span className="text-xl font-display font-black text-text-primary-dark mt-2 block">
                  {loading ? '...' : stat.value}
                </span>
              </div>
              <div className="flex justify-end mt-1">
                <div className={`p-1.5 bg-white/5 rounded-lg ${stat.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Views Breakdown Chart (Takes 2 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#1A1A24] border border-border-dark p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase text-text-primary-dark mb-6">
              Project Views Breakdown
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={projectViewsData} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onMouseMove={(state) => {
                    if (state && state.activeTooltipIndex !== undefined) {
                      setHoveredBarIndex(state.activeTooltipIndex);
                    } else {
                      setHoveredBarIndex(null);
                    }
                  }}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="name" stroke="#555" fontSize={9} fontFamily="monospace" />
                  <YAxis stroke="#555" fontSize={10} fontFamily="monospace" />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="views" fill="#00e5ff" radius={[4, 4, 0, 0]}>
                    {projectViewsData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill="#00e5ff"
                        opacity={hoveredBarIndex === index ? 0.8 : 1.0}
                        style={{ transition: 'opacity 0.15s ease' }}
                        className="cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Feed (Takes 1 col) */}
        <motion.div variants={itemVariants} className="bg-[#1A1A24] border border-border-dark p-6 rounded-2xl flex flex-col justify-between text-left">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase text-text-primary-dark mb-6">
              Recent Activity Feed
            </h3>
            
            {activities.length === 0 ? (
              <div className="text-center py-16 text-xs font-mono text-text-secondary-dark border border-dashed border-border-dark rounded-xl flex flex-col items-center justify-center gap-2">
                <FiActivity className="w-6 h-6 text-text-secondary-dark/60 animate-pulse" />
                <span>No recent events logged yet.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((item, idx) => {
                  const meta = actionMeta[item.action] || { label: 'WRITE EVENT', icon: '📝', color: 'text-text-primary-dark', bg: 'bg-white/5', border: 'border-border-dark/60' };
                  return (
                    <div 
                      key={item.id || idx} 
                      className="flex items-start gap-3 p-3 bg-surface-dark/40 border border-border-dark/60 rounded-xl hover:border-primary/20 transition-all duration-300"
                    >
                      <div className={`w-8 h-8 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center text-xs flex-shrink-0 mt-0.5`}>
                        {meta.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-mono font-black uppercase tracking-wider ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="text-text-secondary-dark text-[10px]">·</span>
                          <span className="text-[9px] font-mono text-text-secondary-dark">
                            {getRelativeTime(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-text-primary-dark font-sans leading-tight mt-1 truncate">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <span className="text-[8px] font-mono text-text-secondary-dark block mt-4">
            Manually tracked changes from dashboard operations.
          </span>
        </motion.div>

      </div>

      {/* Recent Projects & Messages Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Projects Card */}
        <motion.div variants={itemVariants} className="bg-[#1A1A24] border border-border-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-mono font-bold uppercase text-text-primary-dark">
              Recent Projects Activity
            </h3>
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
              Latest Additions
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-white/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-text-secondary-dark border border-dashed border-border-dark rounded-xl">
              No projects found.
            </div>
          ) : (
            <div className="divide-y divide-border-dark border border-border-dark rounded-xl overflow-hidden text-left">
              {recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-4 hover:bg-white/2 transition-colors duration-300"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary-dark truncate">
                        {project.title}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/30 border border-cyan-800/20 px-1.5 py-0.5 rounded">
                        {project.category || 'React'}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary-dark truncate mt-1">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-right flex-shrink-0">
                    <span className="text-[10px] font-mono text-text-secondary-dark">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Simulated'}
                    </span>
                    <button
                      onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                      className="p-1 text-text-secondary-dark hover:text-primary transition-colors hover:scale-110"
                      title="Edit Project"
                    >
                      <FiEdit className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Contact Messages Card */}
        <motion.div variants={itemVariants} className="bg-[#1A1A24] border border-border-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-mono font-bold uppercase text-text-primary-dark">
              Recent Contact Messages
            </h3>
            <button
              onClick={() => navigate('/admin/messages')}
              className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider hover:underline"
            >
              View Inbox
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-white/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-text-secondary-dark border border-dashed border-border-dark rounded-xl flex flex-col items-center justify-center gap-2 select-none">
              <FiMessageSquare className="w-6 h-6 text-text-secondary-dark/40" />
              <span>No messages received yet.</span>
            </div>
          ) : (
            <div className="divide-y divide-border-dark border border-border-dark rounded-xl overflow-hidden text-left">
              {messages.slice(0, 4).map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => navigate('/admin/messages')}
                  className="flex items-center justify-between p-4 hover:bg-white/2 cursor-pointer transition-colors duration-300 relative"
                >
                  {!msg.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l shadow-[0_0_8px_#00e5ff]" />
                  )}
                  <div className="min-w-0 flex-1 pr-4 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary-dark truncate">
                        {msg.name}
                      </span>
                      {!msg.read && (
                        <span className="text-[8px] font-mono text-red-400 uppercase tracking-widest bg-red-950/30 border border-red-800/20 px-1.5 py-0.5 rounded">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary-dark truncate mt-1">
                      {msg.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-right flex-shrink-0 font-mono text-[9px] text-text-secondary-dark">
                    <span>{getRelativeTime(msg.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>

      {/* Developer Utilities & Backup Manager */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Local Backup & Data Import/Export */}
        <div className="bg-[#1A1A24] border border-border-dark p-6 rounded-2xl space-y-4 text-left">
          <h3 className="text-sm font-mono font-bold uppercase text-text-primary-dark flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Developer Utilities &amp; Backups
          </h3>
          <p className="text-xs text-text-secondary-dark leading-relaxed font-sans">
            Manage your offline cache and data. Export all portfolio records (projects, settings, experience) to a JSON file, or restore them from a local backup.
          </p>
          
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={handleExportData}
              className="px-3 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
            >
              Export JSON Backup
            </button>
            <label className="px-3 py-2 bg-white/5 border border-border-dark text-text-primary-dark hover:bg-white/10 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all">
              Import JSON Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            <button
              onClick={handlePurgeCache}
              className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
            >
              Reset to Seeds
            </button>
          </div>
        </div>

        {/* Database Health & Local Storage Monitor */}
        <div className="bg-[#1A1A24] border border-border-dark p-6 rounded-2xl space-y-4 text-left">
          <h3 className="text-sm font-mono font-bold uppercase text-text-primary-dark flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Local Cache &amp; Health Monitor
          </h3>
          
          <div className="space-y-3 pt-1">
            {/* Storage usage bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-text-secondary-dark uppercase font-bold">
                <span>LocalStorage Cache Capacity</span>
                <span>{localStorageUsage.pct}% ({localStorageUsage.kb} KB Used)</span>
              </div>
              <div className="w-full h-2 bg-[#0D0D14] rounded-full overflow-hidden">
                <div 
                  style={{ width: `${localStorageUsage.pct}%` }}
                  className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                />
              </div>
            </div>

            {/* Health parameters grid */}
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-text-secondary-dark uppercase">
              <div className="bg-[#0D0D14]/60 p-2 border border-border-dark/65 rounded-lg flex justify-between items-center">
                <span>Database Sync</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <div className="bg-[#0D0D14]/60 p-2 border border-border-dark/65 rounded-lg flex justify-between items-center">
                <span>Resume Store</span>
                <span className="text-[#E8FF00] font-bold">{settings?.resumeUrl ? 'Base64 Local' : 'Empty'}</span>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
