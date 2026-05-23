import { useState, useEffect } from 'react';
import { 
  getProjects, addProject, updateProject, 
  deleteProject, restoreProject, permanentlyDeleteProject, initialProjectsSeed 
} from '../firebase/projects';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import SlidePanel from '../components/SlidePanel';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export default function ManageProjects() {
  const toast = useToast();
  const confirm = useConfirm();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingProj, setEditingProj] = useState(null);
  
  // View Details Drawer state
  const [viewingProj, setViewingProj] = useState(null);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);

  // Tabs state: 'active' or 'trash'
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [techTags, setTechTags] = useState([]);

  // Form inputs including Python details and extra links
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    githubUrl: '', 
    liveUrl: '', 
    documentationUrl: '',
    videoUrl: '',
    libraries: '',
    category: 'fullstack', 
    image: '', 
    featured: false, 
    emoji: '🚀'
  });
  const [formLoading, setFormLoading] = useState(false);

  // Instant local state update for localStorage mode
  const refreshProjects = () => {
    if (isFirebaseConfigured && db) {
      // Handled automatically in real-time by Firebase onSnapshot
    } else {
      const local = JSON.parse(localStorage.getItem('prince_projects') || '[]');
      const sorted = local.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProjects(sorted);
      setLoading(false);
    }
  };

  // Load & listen to projects list
  useEffect(() => {
    let unsubProjects = () => {};

    if (isFirebaseConfigured && db) {
      setLoading(true);
      unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProjects(sorted);
        setLoading(false);
      }, (err) => {
        console.error("Projects snapshot error:", err);
        toast.error("Failed to load projects from database");
        setLoading(false);
      });
    } else {
      refreshProjects();
      const interval = setInterval(refreshProjects, 1500);
      return () => clearInterval(interval);
    }

    return () => unsubProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Tag inputs triggers
  const handleAddTag = (tag) => {
    const cleaned = tag.trim().toLowerCase();
    if (!cleaned) return;
    if (techTags.includes(cleaned)) {
      toast.info("Tag already exists");
      return;
    }
    setTechTags([...techTags, cleaned]);
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTechTags(techTags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOpenAddPanel = () => {
    setEditingProj(null);
    setFormData({
      title: '', 
      description: '', 
      githubUrl: '', 
      liveUrl: '', 
      documentationUrl: '',
      videoUrl: '',
      libraries: '',
      category: 'fullstack', 
      image: '', 
      featured: false, 
      emoji: '🚀'
    });
    setTechTags([]);
    setTagInput('');
    setIsPanelOpen(true);
  };

  const handleEditClick = (proj) => {
    setEditingProj(proj);
    setFormData({
      title: proj.title || '',
      description: proj.description || '',
      githubUrl: proj.githubUrl || proj.github || '',
      liveUrl: proj.liveUrl || proj.live || '',
      documentationUrl: proj.documentationUrl || '',
      videoUrl: proj.videoUrl || '',
      libraries: proj.libraries || '',
      category: proj.category || 'fullstack',
      image: proj.image || '',
      featured: proj.featured || false,
      emoji: proj.emoji || '🚀'
    });
    setTechTags(proj.tech || []);
    setTagInput('');
    setIsPanelOpen(true);
  };

  const handleCancelEdit = () => {
    setIsPanelOpen(false);
    setEditingProj(null);
    setFormData({
      title: '', 
      description: '', 
      githubUrl: '', 
      liveUrl: '', 
      documentationUrl: '',
      videoUrl: '',
      libraries: '',
      category: 'fullstack', 
      image: '', 
      featured: false, 
      emoji: '🚀'
    });
    setTechTags([]);
    setTagInput('');
  };

  const handleViewClick = (proj) => {
    setViewingProj(proj);
    setIsViewPanelOpen(true);
  };

  const handleCloseViewPanel = () => {
    setIsViewPanelOpen(false);
    setViewingProj(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const { 
      title, description, githubUrl, liveUrl, documentationUrl, 
      videoUrl, libraries, category, image, featured, emoji 
    } = formData;

    if (!title.trim() || !description.trim() || techTags.length === 0) {
      toast.error('Title, Description, and at least one Tech Stack tag are required.');
      setFormLoading(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      tech: techTags,
      githubUrl: githubUrl.trim(),
      github: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      live: liveUrl.trim(),
      documentationUrl: documentationUrl.trim(),
      videoUrl: videoUrl.trim(),
      libraries: libraries.trim(),
      category,
      image: image.trim() || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      featured,
      emoji: emoji || '🚀',
      createdAt: editingProj?.createdAt || new Date().toISOString()
    };

    try {
      if (editingProj) {
        await updateProject(editingProj.id, payload);
        toast.success(`Project "${title}" updated successfully!`);
      } else {
        await addProject(payload);
        toast.success(`Project "${title}" registered successfully!`);
      }
      setIsPanelOpen(false);
      handleCancelEdit();
      refreshProjects(); // Instant local sync
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error occurred while saving project.');
    } finally {
      setFormLoading(false);
    }
  };

  // Move project to Recycle Bin
  const handleDeleteClick = async (proj) => {
    const approved = await confirm({
      title: "Move to Recycle Bin?",
      subtitle: `Are you sure you want to move "${proj.title}" to the Recycle Bin? It will be automatically deleted permanently after 30 days.`,
      confirmLabel: "Move to Trash",
      confirmVariant: "danger"
    });

    if (!approved) return;

    try {
      await deleteProject(proj.id);
      toast.success("Project moved to Recycle Bin!");
      refreshProjects(); // Instant local sync
    } catch (err) {
      console.error(err);
      toast.error('Failed to trash project.');
    }
  };

  // Restore project from Recycle Bin
  const handleRestoreClick = async (proj) => {
    try {
      await restoreProject(proj.id);
      toast.success(`"${proj.title}" restored successfully!`);
      refreshProjects(); // Instant local sync
    } catch (err) {
      console.error(err);
      toast.error('Failed to restore project.');
    }
  };

  // Physically delete project permanently
  const handlePermanentDeleteClick = async (proj) => {
    const approved = await confirm({
      title: "Delete Permanently?",
      subtitle: `Are you sure you want to permanently delete "${proj.title}"? This physical deletion is irreversible.`,
      confirmLabel: "Delete Permanently",
      confirmVariant: "danger"
    });

    if (!approved) return;

    try {
      await permanentlyDeleteProject(proj.id);
      toast.success("Project permanently deleted!");
      refreshProjects(); // Instant local sync
    } catch (err) {
      console.error(err);
      toast.error('Failed to permanently delete project.');
    }
  };

  const handleToggleFeatured = async (proj) => {
    try {
      await updateProject(proj.id, { featured: !proj.featured });
      toast.success(`${proj.title} ${!proj.featured ? 'promoted to featured' : 'removed from featured'}`);
      refreshProjects(); // Instant local sync
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle featured state");
    }
  };

  const handleSeedDatabase = async () => {
    const approved = await confirm({
      title: "Reset database collections?",
      subtitle: "This resets and seeds clean default projects (19 items). All existing projects will be overwritten.",
      confirmLabel: "Reset",
      confirmVariant: "danger"
    });

    if (!approved) return;
    
    setLoading(true);
    try {
      const seeded = initialProjectsSeed.map(p => ({
        ...p,
        github: p.githubUrl,
        live: p.liveUrl,
        deleted: false,
        deletedAt: null
      }));
      localStorage.setItem('prince_projects', JSON.stringify(seeded));
      toast.success("Database successfully seeded with 19 repositories!");
      refreshProjects(); // Instant local sync
    } catch (err) {
      console.error(err);
      toast.error("Failed to seed database: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate remaining days in Recycle Bin
  const getDaysRemaining = (deletedAt) => {
    if (!deletedAt) return 30;
    const deletedDate = new Date(deletedAt);
    const now = new Date();
    const diffTime = Math.abs(now - deletedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const remaining = 30 - diffDays;
    return remaining < 0 ? 0 : remaining;
  };

  // Filter projects based on search query and active tab
  const filteredProjects = projects.filter(p => {
    // Filter by tab
    const matchesTab = activeTab === 'active' ? !p.deleted : !!p.deleted;
    if (!matchesTab) return false;

    // Filter by search query
    return (
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tech && p.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (p.libraries && p.libraries.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const emojiList = ['🚀', '📁', '💻', '💎', '⚡', '☕', '🔐', '🌤️', '🌐', '🎮', '💡', '🤖', '📊', '🛠️', '📱', '🔥', '📚'];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Top action header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-2 border-primary pl-3 py-2 select-none">
        <div>
          <h2 className="text-white font-display text-lg font-bold">Projects Manager</h2>
          <p className="text-muted text-xs font-light">
            You have <strong className="text-primary font-mono">{projects.filter(p => !p.deleted).length}</strong> active & <strong className="text-danger font-mono">{projects.filter(p => p.deleted).length}</strong> trashed items.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeedDatabase}
            className="px-4 py-2 border border-secondary/40 text-secondary hover:bg-secondary/5 rounded-xl text-xs font-mono uppercase font-semibold transition-colors active:scale-95"
            disabled={loading}
          >
            Reset Defaults
          </button>
          <button
            onClick={handleOpenAddPanel}
            className="px-6 py-2.5 bg-primary hover:bg-primary/80 text-white rounded-xl text-xs uppercase font-mono tracking-wider font-bold transition-all active:scale-95 shadow-lg shadow-primary/10"
          >
            + Add New Project
          </button>
        </div>
      </div>

      {/* Recycle Bin Tabs */}
      <div className="flex border-b border-white/5 pb-1 gap-6 select-none font-mono text-xs uppercase tracking-wider">
        <button 
          onClick={() => setActiveTab('active')} 
          className={`pb-3 font-bold transition-all border-b-2 ${
            activeTab === 'active' 
              ? 'border-primary text-white' 
              : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Active Projects ({projects.filter(p => !p.deleted).length})
        </button>
        <button 
          onClick={() => setActiveTab('trash')} 
          className={`pb-3 font-bold transition-all border-b-2 ${
            activeTab === 'trash' 
              ? 'border-danger text-white shadow-[0_4px_10px_rgba(239,68,68,0.1)]' 
              : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Recycle Bin 🗑️ ({projects.filter(p => p.deleted).length})
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-[#0d0d1a] border border-[#7C6FFF]/12 p-4 rounded-2xl select-none">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted text-sm">
            🔍
          </span>
          <input 
            type="text" 
            placeholder="Search projects by title, category, or technology stack..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-secondary transition-all"
          />
        </div>
      </div>

      {/* Projects Listed as Elegant Table Rows */}
      {loading ? (
        <SkeletonCard count={3} type="table" />
      ) : filteredProjects.length === 0 ? (
        <EmptyState 
          icon={activeTab === 'active' ? "📂" : "🗑️"}
          title={activeTab === 'active' ? "No projects found" : "Recycle Bin is empty"} 
          description={
            activeTab === 'active' 
              ? "Register a new repository or click 'Reset Defaults' to populate the catalog."
              : "Deleted items will appear here and will be removed permanently after 30 days."
          }
        />
      ) : (
        <div className="bg-[#0d0d1a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] select-text">
              <thead>
                <tr className="border-b border-white/5 bg-[#13132a]/50 text-muted font-mono text-[10px] uppercase tracking-wider select-none">
                  <th className="py-4 px-6 text-center w-16">Emoji</th>
                  <th className="py-4 px-6">Project Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Tech Tags</th>
                  {activeTab === 'active' ? (
                    <>
                      <th className="py-4 px-6 text-center w-24">Featured</th>
                      <th className="py-4 px-6 text-center w-24">Links</th>
                    </>
                  ) : (
                    <th className="py-4 px-6 text-center w-36">Days Remaining</th>
                  )}
                  <th className="py-4 px-6 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredProjects.map((proj, index) => (
                  <tr 
                    key={proj.id} 
                    className={`${
                      index % 2 === 0 ? 'bg-transparent' : 'bg-[rgba(124,111,255,0.01)]'
                    } hover:bg-white/[0.015] transition-colors duration-200`}
                  >
                    {/* Icon Emoji */}
                    <td className="py-4 px-6 text-center text-lg select-none">
                      {proj.emoji || '🚀'}
                    </td>
                    
                    {/* Title */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white font-display text-xs sm:text-sm tracking-wide">
                        {proj.title}
                      </div>
                      <p className="text-[11px] text-muted line-clamp-1 mt-0.5 max-w-sm font-sans font-light">
                        {proj.description}
                      </p>
                    </td>
                    
                    {/* Category Badge */}
                    <td className="py-4 px-6 select-none">
                      <span className={`text-[9px] font-mono px-2.5 py-1 rounded-full uppercase font-bold ${
                        proj.category === 'fullstack' ? 'bg-primary/10 border border-primary/20 text-primary' :
                        proj.category === 'frontend' ? 'bg-secondary/10 border border-secondary/20 text-secondary' :
                        proj.category === 'ai' ? 'bg-accent/10 border border-accent/20 text-accent' :
                        'bg-success/10 border border-success/20 text-success'
                      }`}>
                        {proj.category || 'fullstack'}
                      </span>
                    </td>
                    
                    {/* Tech tags list (Max 3 + extra count) */}
                    <td className="py-4 px-6 select-none">
                      <div className="flex flex-wrap gap-1 font-mono text-[9px] items-center">
                        {proj.tech && proj.tech.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                        {proj.tech && proj.tech.length > 3 && (
                          <span className="text-muted px-1.5 py-0.5 font-bold bg-white/5 rounded">
                            +{proj.tech.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    {activeTab === 'active' ? (
                      <>
                        {/* Featured toggle switch */}
                        <td className="py-4 px-6 text-center select-none">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleToggleFeatured(proj)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${
                                proj.featured ? 'bg-primary' : 'bg-white/10'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${
                                proj.featured ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                        </td>
                        
                        {/* Links icons */}
                        <td className="py-4 px-6 text-center select-none">
                          <div className="flex justify-center gap-3 text-base">
                            {proj.githubUrl || proj.github ? (
                              <a 
                                href={proj.githubUrl || proj.github} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                title="GitHub Repository"
                                className="text-muted hover:text-white transition-colors"
                              >
                                🐙
                              </a>
                            ) : (
                              <span className="text-gray-700">&mdash;</span>
                            )}
                            {proj.liveUrl || proj.live ? (
                              <a 
                                href={proj.liveUrl || proj.live} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                title="Live Demo Website"
                                className="text-muted hover:text-secondary transition-colors"
                              >
                                🌐
                              </a>
                            ) : null}
                          </div>
                        </td>
                      </>
                    ) : (
                      /* Days Remaining in Recycle Bin */
                      <td className="py-4 px-6 text-center select-none font-mono text-xs">
                        <span className={`px-2.5 py-1 rounded-full font-bold ${
                          getDaysRemaining(proj.deletedAt) <= 5 
                            ? 'bg-danger/10 text-danger border border-danger/20 animate-pulse'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          ⏳ {getDaysRemaining(proj.deletedAt)} Days
                        </span>
                      </td>
                    )}
                    
                    {/* Actions */}
                    <td className="py-4 px-6 text-center select-none">
                      <div className="flex gap-3.5 justify-center items-center font-mono text-[10px]">
                        {activeTab === 'active' ? (
                          <>
                            <button 
                              onClick={() => handleViewClick(proj)}
                              className="text-secondary hover:text-white transition-colors uppercase font-bold"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleEditClick(proj)}
                              className="text-primary hover:text-white transition-colors uppercase font-bold"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(proj)}
                              className="text-danger hover:text-white transition-colors uppercase font-bold"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleRestoreClick(proj)}
                              className="text-success hover:text-white transition-colors uppercase font-bold"
                              title="Restore to Active List"
                            >
                              Restore 🔄
                            </button>
                            <button 
                              onClick={() => handlePermanentDeleteClick(proj)}
                              className="text-danger hover:text-white transition-colors uppercase font-bold"
                              title="Delete Permanently"
                            >
                              Delete 🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-in drawer for Form Panel (Add / Edit) */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleCancelEdit}
        title={editingProj ? '📝 Edit GitHub Project' : '📁 Add New Project'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Emoji row */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Project Emoji Icon</label>
            <div className="flex flex-wrap gap-2 p-3 bg-dark border border-white/5 rounded-xl justify-center select-none">
              {emojiList.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setFormData({ ...formData, emoji: em })}
                  className={`w-8 h-8 text-lg rounded-lg flex items-center justify-center transition-all ${
                    formData.emoji === em ? 'bg-primary text-white scale-115 shadow-lg shadow-primary/30' : 'bg-transparent hover:bg-white/5'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Category columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Ruiz Diamonds"
                className="admin-input text-xs sm:text-sm font-semibold"
                disabled={formLoading}
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="admin-input text-xs sm:text-sm font-sans"
                disabled={formLoading}
              >
                <option value="fullstack">Fullstack</option>
                <option value="frontend">Frontend</option>
                <option value="ai">AI / Python</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe user flow details, backend architecture, and state syncing..."
              className="admin-input text-xs sm:text-sm resize-none font-light leading-relaxed"
              disabled={formLoading}
              required
            />
          </div>

          {/* Tech Stack tag keys inputs */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">
              Tech Stack Tags (Press Enter or Comma to add)
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-dark border border-white/5 rounded-xl items-center min-h-[50px] mb-2 select-none">
              {techTags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold flex items-center gap-1.5"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(idx)}
                    className="text-muted hover:text-white transition-colors text-[9px]"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={techTags.length === 0 ? "e.g. React, Tailwind" : "Add tag..."}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                disabled={formLoading}
                className="bg-transparent border-none outline-none text-xs text-white flex-1 min-w-[100px]"
              />
            </div>
            {techTags.length === 0 && (
              <p className="text-[10px] text-danger font-mono select-none">At least one technology tag is required</p>
            )}
          </div>

          {/* Python Libraries / Package details */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">
              Python Libraries / Package Dependencies (Optional)
            </label>
            <input
              type="text"
              name="libraries"
              value={formData.libraries}
              onChange={handleInputChange}
              placeholder="e.g. numpy, pandas, flask, scikit-learn (comma separated)"
              className="admin-input text-xs sm:text-sm font-mono"
              disabled={formLoading}
            />
          </div>

          {/* Core Code & Launch Links inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/..."
                className="admin-input text-xs sm:text-sm"
                disabled={formLoading}
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Live Demo Website URL (Optional)</label>
              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
                placeholder="https://..."
                className="admin-input text-xs sm:text-sm"
                disabled={formLoading}
              />
            </div>
          </div>

          {/* Additional Links: Documentation & Demo Video */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Documentation URL (Optional)</label>
              <input
                type="url"
                name="documentationUrl"
                value={formData.documentationUrl}
                onChange={handleInputChange}
                placeholder="https://docs.example.com or research paper link..."
                className="admin-input text-xs sm:text-sm"
                disabled={formLoading}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Demo Video URL (Optional)</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=... or loom video link..."
                className="admin-input text-xs sm:text-sm"
                disabled={formLoading}
              />
            </div>
          </div>

          {/* Image URL Optional */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Cover Image URL (Optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://images.unsplash.com/..."
              className="admin-input text-xs sm:text-sm"
              disabled={formLoading}
            />
          </div>

          {/* Switch Switch Toggle */}
          <div className="flex items-center gap-3 py-2 select-none">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
              className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${
                formData.featured ? 'bg-primary' : 'bg-white/10'
              }`}
              disabled={formLoading}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${
                formData.featured ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Promote to Featured Project
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4 select-none">
            <button
              type="submit"
              className="flex-1 admin-btn uppercase font-mono tracking-wider text-xs py-3.5"
              disabled={formLoading}
            >
              {formLoading ? 'Saving...' : editingProj ? 'Save Changes' : 'Add Project'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-lg font-mono text-xs uppercase tracking-wider transition-colors"
              disabled={formLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </SlidePanel>

      {/* Slide-in drawer for viewing Project details */}
      <SlidePanel
        isOpen={isViewPanelOpen}
        onClose={handleCloseViewPanel}
        title="🔍 View Project Details"
      >
        {viewingProj && (
          <div className="space-y-6 font-sans">
            {/* Project Cover Image */}
            <div className="h-48 overflow-hidden rounded-xl bg-surface relative select-none">
              <img 
                src={viewingProj.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"} 
                alt={viewingProj.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary text-white font-mono text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-lg">
                {viewingProj.category}
              </div>
            </div>

            {/* Title with Emoji */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <span className="text-3xl">{viewingProj.emoji || '🚀'}</span>
              <div>
                <h3 className="text-white text-base font-bold font-display">{viewingProj.title}</h3>
                <p className="text-[10px] font-mono text-muted uppercase mt-0.5">
                  Created: {viewingProj.createdAt ? new Date(viewingProj.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2 select-none">Description</h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-[#0d0d1a] border border-white/5 p-4 rounded-xl whitespace-pre-wrap select-text font-light">
                {viewingProj.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2 select-none">Tech Stack Tags</h4>
              <div className="flex flex-wrap gap-2 select-none">
                {viewingProj.tech && viewingProj.tech.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-mono font-bold rounded uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Python Libraries / Package dependencies */}
            {viewingProj.libraries && (
              <div>
                <h4 className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2 select-none">Libraries & Dependencies</h4>
                <div className="p-3 bg-[#0d0d1a] border border-white/5 rounded-xl font-mono text-xs text-secondary font-bold select-text">
                  📦 {viewingProj.libraries}
                </div>
              </div>
            )}

            {/* Links Section */}
            <div>
              <h4 className="text-[10px] font-mono text-muted uppercase tracking-wider mb-3 select-none">Project Assets & URLs</h4>
              <div className="grid grid-cols-2 gap-3 select-none font-mono text-[10px] uppercase font-bold">
                {viewingProj.githubUrl || viewingProj.github ? (
                  <a 
                    href={viewingProj.githubUrl || viewingProj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-center"
                  >
                    🐙 Code
                  </a>
                ) : (
                  <div className="flex items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl text-muted text-center cursor-not-allowed">
                    No Code
                  </div>
                )}

                {viewingProj.liveUrl || viewingProj.live ? (
                  <a 
                    href={viewingProj.liveUrl || viewingProj.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 rounded-xl text-secondary transition-all text-center"
                  >
                    🌐 Launch
                  </a>
                ) : (
                  <div className="flex items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl text-muted text-center cursor-not-allowed">
                    No Launch
                  </div>
                )}

                {viewingProj.documentationUrl ? (
                  <a 
                    href={viewingProj.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-accent/15 hover:bg-accent/25 border border-accent/30 rounded-xl text-accent transition-all text-center"
                  >
                    📄 Paper/Doc
                  </a>
                ) : (
                  <div className="flex items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl text-muted text-center cursor-not-allowed">
                    No Doc
                  </div>
                )}

                {viewingProj.videoUrl ? (
                  <a 
                    href={viewingProj.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-500 transition-all text-center"
                  >
                    🎥 Video Demo
                  </a>
                ) : (
                  <div className="flex items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl text-muted text-center cursor-not-allowed">
                    No Video
                  </div>
                )}
              </div>
            </div>

            {/* Footer details */}
            <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3.5 rounded-xl text-[10px] font-mono text-muted select-none">
              <span>Status: {viewingProj.deleted ? '🗑️ Trashed' : '🟢 Active'}</span>
              <span>Featured: {viewingProj.featured ? '⭐ Yes' : '❌ No'}</span>
            </div>
            
            <div className="pt-4 select-none">
              <button
                onClick={handleCloseViewPanel}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </SlidePanel>

    </div>
  );
}

