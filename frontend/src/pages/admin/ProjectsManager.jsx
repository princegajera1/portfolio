import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit, FiTrash2, FiStar, 
  FiArrowUp, FiArrowDown, FiExternalLink, FiSearch, FiCheckSquare, FiSquare, FiX
} from 'react-icons/fi';
import useProjects from '../../hooks/useProjects';
import { permanentlyDeleteProject } from '../../firebase/projects';
import { deleteFile } from '../../firebase/storage';
import { logActivity } from '../../firebase/activity';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function ProjectsManager() {
  const { projects, loading, removeProject, editProject, refetch } = useProjects();
  const navigate = useNavigate();
  
  const [deletingId, setDeletingId] = useState(null);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);

  // Clear selections when projects or filters change
  useEffect(() => {
    setSelectedIds([]);
  }, [searchQuery, activeCategory, projects]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    try {
      setDeletingId(id);
      const proj = projects.find(p => p.id === id);
      if (proj && proj.image && proj.image.startsWith('http') && !proj.image.startsWith('data:')) {
        await deleteFile(proj.image).catch(err => console.error("Error deleting project image:", err));
      }
      
      // Permanently delete from database
      await permanentlyDeleteProject(id);
      await logActivity('project_delete', `Deleted project: ${proj?.title || id}`);
      
      toast.success('Project deleted successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.length;
    if (!window.confirm(`Are you sure you want to delete ${count} projects? This cannot be undone.`)) {
      return;
    }
    try {
      setDeletingBulk(true);
      for (const id of selectedIds) {
        const proj = projects.find(p => p.id === id);
        if (proj) {
          if (proj.image && proj.image.startsWith('http') && !proj.image.startsWith('data:')) {
            await deleteFile(proj.image).catch(err => console.error("Error deleting bulk project image:", err));
          }
          await permanentlyDeleteProject(id);
        }
      }
      
      await logActivity('project_delete', `Bulk deleted ${count} projects`);
      toast.success(`${count} projects deleted`);
      setSelectedIds([]);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete selected projects');
    } finally {
      setDeletingBulk(false);
    }
  };

  const handleToggleFeatured = async (id, currentVal) => {
    try {
      await editProject(id, { featured: !currentVal });
      const proj = projects.find(p => p.id === id);
      await logActivity('project_edit', `Toggled featured status for project: ${proj?.title || id}`);
      toast.success(`Project updated successfully`);
      refetch();
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const currentProj = projects[index];
    const swapProj = projects[swapIndex];

    try {
      if (localStorage.getItem('mock_admin_logged') === 'true') {
        const local = JSON.parse(localStorage.getItem('prince_projects') || '[]');
        if (local.length > 0) {
          const idxA = local.findIndex(p => p.id === currentProj.id);
          const idxB = local.findIndex(p => p.id === swapProj.id);
          if (idxA !== -1 && idxB !== -1) {
            const temp = local[idxA];
            local[idxA] = local[idxB];
            local[idxB] = temp;
            localStorage.setItem('prince_projects', JSON.stringify(local));
            window.dispatchEvent(new CustomEvent('projectsUpdated'));
            
            await logActivity('project_edit', `Reordered projects: ${currentProj.title} and ${swapProj.title}`);
            toast.success('Order updated');
            refetch();
            return;
          }
        }
      }
      toast.error('Order re-ordering is supported in local databases or direct configurations.');
    } catch (err) {
      toast.error('Failed to reorder');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        navigate('/admin/projects/new');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  // Client-side search and category filtering
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(proj => {
      // Category filter
      if (activeCategory !== 'All') {
        const cat = (proj.category || '').toLowerCase();
        if (activeCategory === 'Frontend' && cat !== 'frontend') return false;
        if (activeCategory === 'Fullstack' && cat !== 'fullstack') return false;
        if (activeCategory === 'AI' && cat !== 'ai') return false;
        if (activeCategory === 'Other' && ['frontend', 'fullstack', 'ai'].includes(cat)) return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (proj.title || '').toLowerCase().includes(query);
        const matchesCategory = (proj.category || '').toLowerCase().includes(query);
        return matchesTitle || matchesCategory;
      }
      return true;
    });
  }, [projects, searchQuery, activeCategory]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProjects.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const CATEGORIES = ['All', 'Frontend', 'Fullstack', 'AI', 'Other'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 text-left">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1A24] border border-border-dark p-6 rounded-2xl">
        <div>
          <h1 className="text-xl font-display font-extrabold text-text-primary-dark">
            Manage Projects
          </h1>
          <p className="text-xs font-mono text-text-secondary-dark mt-1">
            Create, modify, reorder, or delete developer portfolio projects.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => navigate('/admin/projects/new')}
          className="h-10 px-4 self-start md:self-auto"
        >
          <FiPlus className="w-4 h-4 mr-1.5" />
          Add Project
        </Button>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1A24] border border-border-dark p-6 rounded-2xl">
        {/* Category Pill Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all border ${
                  isActive 
                    ? 'bg-primary text-[#0d0d0f] border-primary' 
                    : 'bg-[#0d0d0f]/50 text-text-secondary-dark border-border-dark hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search bar inputs */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-3.5 text-text-secondary-dark w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or category..."
            className="w-full h-11 pl-9 pr-4 bg-surface-dark border border-border-dark rounded-xl text-text-primary-dark font-sans text-xs outline-none focus:border-primary transition-all duration-300"
          />
        </div>
      </div>

      {/* Results found indicator */}
      {searchQuery.trim() !== '' && (
        <p className="text-xs font-mono text-text-secondary-dark px-1">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'result' : 'results'} found for "{searchQuery}"
        </p>
      )}

      {/* Projects Grid/Table */}
      <div className="bg-[#1A1A24] border border-border-dark rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-text-secondary-dark">
            Loading project data...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-text-secondary-dark space-y-4">
            <p>No projects found matching the specified parameters.</p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-dark bg-[#14141E] text-text-secondary-dark text-[10px] font-mono uppercase font-bold tracking-wider">
                  <th className="py-4 px-6 w-12 text-center">
                    <input 
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredProjects.length > 0 && selectedIds.length === filteredProjects.length}
                      className="w-4.5 h-4.5 rounded bg-surface-dark border-border-dark text-primary focus:ring-primary focus:ring-offset-bg-dark cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Preview</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-center">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark text-xs">
                {filteredProjects.map((proj, idx) => (
                  <tr 
                    key={proj.id} 
                    className={`hover:bg-white/2 transition-colors duration-300 ${
                      selectedIds.includes(proj.id) ? 'bg-primary/5 hover:bg-primary/10' : ''
                    }`}
                  >
                    {/* Checkbox Column */}
                    <td className="py-4 px-6 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(proj.id)}
                        onChange={() => handleSelectRow(proj.id)}
                        className="w-4.5 h-4.5 rounded bg-surface-dark border-border-dark text-primary focus:ring-primary focus:ring-offset-bg-dark cursor-pointer"
                      />
                    </td>

                    {/* Reorder Arrows */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:text-primary disabled:opacity-20 transition-colors"
                          title="Move Up"
                        >
                          <FiArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(idx, 'down')}
                          disabled={idx === filteredProjects.length - 1}
                          className="p-1 hover:text-primary disabled:opacity-20 transition-colors"
                          title="Move Down"
                        >
                          <FiArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Image preview */}
                    <td className="py-4 px-6">
                      <img 
                        src={proj.image || 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=80&h=80&q=80'} 
                        alt={proj.title}
                        className="w-12 h-8 rounded object-cover border border-border-dark bg-[#0A0A0F]"
                      />
                    </td>

                    {/* Title */}
                    <td className="py-4 px-6 font-semibold text-text-primary-dark">
                      <div className="flex flex-col">
                        <span>{proj.title}</span>
                        {proj.liveUrl && (
                          <a 
                            href={proj.liveUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[9px] font-mono text-secondary hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            Live Store <FiExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="font-mono bg-white/5 border border-border-dark px-2.5 py-0.5 rounded text-[10px] text-text-secondary-dark uppercase font-bold">
                        {proj.category || 'N/A'}
                      </span>
                    </td>

                    {/* Featured toggles */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(proj.id, proj.featured)}
                        className={`p-1.5 rounded transition-all duration-300 ${
                          proj.featured 
                            ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' 
                            : 'text-text-secondary-dark hover:text-yellow-400 border border-transparent'
                        }`}
                        title={proj.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <FiStar className={`w-4 h-4 ${proj.featured ? 'fill-yellow-400' : ''}`} />
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/projects/edit/${proj.id}`)}
                          className="p-2 bg-white/5 border border-border-dark hover:border-primary hover:text-primary rounded-lg transition-all"
                          title="Edit Project"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          disabled={deletingId === proj.id}
                          className="p-2 bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-all"
                          title="Delete Project"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Action Bar for Bulk Actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A2E]/95 backdrop-blur-md border border-[#00e5ff]/20 rounded-2xl px-6 py-4 flex items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,229,255,0.15)] z-[100] w-[90%] max-w-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase text-text-primary-dark">
                {selectedIds.length} {selectedIds.length === 1 ? 'project' : 'projects'} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-text-secondary-dark hover:text-white border-transparent hover:bg-white/5"
                onClick={() => setSelectedIds([])}
              >
                Deselect All
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-mono border-red-600 hover:border-red-700"
                onClick={handleBulkDelete}
                isLoading={deletingBulk}
              >
                <FiTrash2 className="w-4 h-4 mr-1.5" />
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
