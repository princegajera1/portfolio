import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  getSkills, addSkill, updateSkill, 
  deleteSkill, restoreSkill, permanentlyDeleteSkill, initialSkillsSeed 
} from '../firebase/skills';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import SlidePanel from '../components/SlidePanel';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { db, isFirebaseConfigured, auth } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export default function ManageSkills() {
  const toast = useToast();
  const confirm = useConfirm();
  const { user } = useOutletContext();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  
  // Tabs state: 'active' or 'trash'
  const [activeTab, setActiveTab] = useState('active');

  // Category filter state
  const [activeFilter, setActiveFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '', level: 80, category: 'frontend', order: 1
  });
  const [formLoading, setFormLoading] = useState(false);

  // Instant local updates for LocalStorage mode
  const refreshSkills = () => {
    if (isFirebaseConfigured && db && user) {
      // Firebase real-time onSnapshot will update automatically
    } else {
      const local = JSON.parse(localStorage.getItem('prince_skills') || '[]');
      const sorted = local.sort((a, b) => a.order - b.order);
      setSkills(sorted);
      setLoading(false);
    }
  };

  // Load and listen to skills
  useEffect(() => {
    let unsubSkills = () => {};

    if (isFirebaseConfigured && db && user) {
      setLoading(true);
      unsubSkills = onSnapshot(collection(db, 'skills'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sorted = data.sort((a, b) => a.order - b.order);
        setSkills(sorted);
        setLoading(false);
      }, (err) => {
        console.error("Skills snapshot error:", err);
        toast.error("Failed to load skills from database");
        setLoading(false);
      });
    } else {
      refreshSkills();
      const interval = setInterval(refreshSkills, 1500);
      return () => clearInterval(interval);
    }

    return () => unsubSkills();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' || name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleOpenAddPanel = () => {
    setEditingSkill(null);
    setFormData({
      name: '', level: 80, category: 'frontend', order: skills.filter(s => !s.deleted).length + 1
    });
    setIsPanelOpen(true);
  };

  const handleEditClick = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      level: skill.level || 80,
      category: skill.category || 'frontend',
      order: skill.order || 1
    });
    setIsPanelOpen(true);
  };

  const handleCancelEdit = () => {
    setIsPanelOpen(false);
    setEditingSkill(null);
    setFormData({ name: '', level: 80, category: 'frontend', order: 1 });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const { name, level, category, order } = formData;

    if (!name.trim()) {
      toast.error('Skill name is required.');
      setFormLoading(false);
      return;
    }

    const payload = { 
      name: name.trim(), 
      level: Math.min(100, Math.max(0, level)), 
      category, 
      order 
    };

    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, payload);
        toast.success(`Skill "${name}" updated successfully!`);
      } else {
        await addSkill(payload);
        toast.success(`Skill "${name}" added successfully!`);
      }
      setIsPanelOpen(false);
      handleCancelEdit();
      refreshSkills(); // Instant state update
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error occurred while saving skill.');
    } finally {
      setFormLoading(false);
    }
  };

  // Move skill to Recycle Bin
  const handleDeleteClick = async (skill) => {
    const approved = await confirm({
      title: "Move to Recycle Bin?",
      subtitle: `Are you sure you want to move "${skill.name}" to the Recycle Bin? It will be automatically deleted permanently after 30 days.`,
      confirmLabel: "Move to Trash",
      confirmVariant: "danger"
    });

    if (!approved) return;

    try {
      await deleteSkill(skill.id);
      toast.success("Skill moved to Recycle Bin!");
      refreshSkills(); // Instant state update
    } catch (err) {
      console.error(err);
      toast.error('Failed to trash skill.');
    }
  };

  // Restore skill from Recycle Bin
  const handleRestoreClick = async (skill) => {
    try {
      await restoreSkill(skill.id);
      toast.success(`Skill "${skill.name}" restored successfully!`);
      refreshSkills(); // Instant state update
    } catch (err) {
      console.error(err);
      toast.error('Failed to restore skill.');
    }
  };

  // Physically delete skill permanently
  const handlePermanentDeleteClick = async (skill) => {
    const approved = await confirm({
      title: "Delete Permanently?",
      subtitle: `Are you sure you want to permanently delete "${skill.name}"? This physical deletion is irreversible.`,
      confirmLabel: "Delete Permanently",
      confirmVariant: "danger"
    });

    if (!approved) return;

    try {
      await permanentlyDeleteSkill(skill.id);
      toast.success("Skill permanently deleted!");
      refreshSkills(); // Instant state update
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete skill.');
    }
  };

  const handleSeedSkills = async () => {
    const approved = await confirm({
      title: "Reset skills catalog?",
      subtitle: "This resets and seeds your core developer matrix (18 skills). All current skills will be overwritten.",
      confirmLabel: "Reset",
      confirmVariant: "danger"
    });

    if (!approved) return;
    
    setLoading(true);
    try {
      const seeded = initialSkillsSeed.map(s => ({
        ...s,
        deleted: false,
        deletedAt: null
      }));
      localStorage.setItem('prince_skills', JSON.stringify(seeded));
      toast.success("Skills matrix successfully seeded!");
      refreshSkills(); // Instant state update
    } catch (err) {
      console.error(err);
      toast.error("Failed to seed skills: " + err.message);
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

  // Group and filter skills
  const filteredSkills = skills.filter(s => {
    // Filter by tab
    const matchesTab = activeTab === 'active' ? !s.deleted : !!s.deleted;
    if (!matchesTab) return false;

    // Filter by category
    if (activeFilter === 'all') return true;
    return s.category === activeFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Top action header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-2 border-primary pl-3 py-2 select-none">
        <div>
          <h2 className="text-white font-display text-lg font-bold">Skills Management</h2>
          <p className="text-muted text-xs font-light">
            You have <strong className="text-primary font-mono">{skills.filter(s => !s.deleted).length}</strong> active & <strong className="text-danger font-mono">{skills.filter(s => s.deleted).length}</strong> trashed technologies.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeedSkills}
            className="px-4 py-2 border border-secondary/40 text-secondary hover:bg-secondary/5 rounded-xl text-xs font-mono uppercase font-semibold transition-colors active:scale-95"
            disabled={loading}
          >
            Reset Defaults
          </button>
          <button
            onClick={handleOpenAddPanel}
            className="px-6 py-2.5 bg-primary hover:bg-primary/80 text-white rounded-xl text-xs uppercase font-mono tracking-wider font-bold transition-all active:scale-95 shadow-lg shadow-primary/10"
          >
            + Add Skill
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
          Active Skills ({skills.filter(s => !s.deleted).length})
        </button>
        <button 
          onClick={() => setActiveTab('trash')} 
          className={`pb-3 font-bold transition-all border-b-2 ${
            activeTab === 'trash' 
              ? 'border-danger text-white shadow-[0_4px_10px_rgba(239,68,68,0.1)]' 
              : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Recycle Bin 🗑️ ({skills.filter(s => s.deleted).length})
        </button>
      </div>

      {/* Category filter bar */}
      <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wider select-none border-b border-white/5 pb-4">
        {[
          { id: 'all', name: 'All Technologies' },
          { id: 'frontend', name: 'Frontend Frameworks' },
          { id: 'backend', name: 'Backend & DB' },
          { id: 'tools', name: 'Tools & DevOps' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 font-bold border ${
              activeFilter === tab.id
                ? 'bg-secondary/15 border-secondary/40 text-secondary shadow-[0_0_15px_rgba(0,229,255,0.08)]'
                : 'border-transparent text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonCard count={6} />
      ) : filteredSkills.length === 0 ? (
        <EmptyState 
          icon={activeTab === 'active' ? "⚡" : "🗑️"} 
          title={activeTab === 'active' ? "No skills found" : "Recycle Bin is empty"} 
          description={
            activeTab === 'active' 
              ? "Register a new skill or click 'Reset Defaults' to populate the catalog."
              : "Deleted items will appear here and will be removed permanently after 30 days."
          }
        />
      ) : (
        /* Skills Grid - 3 columns */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {filteredSkills.map((skill) => {
            // dynamic border color based on category
            const borderAccent = 
              activeTab === 'trash' ? 'hover:border-danger/45 hover:shadow-[0_0_15px_rgba(239,68,68,0.06)]' :
              skill.category === 'frontend' ? 'hover:border-primary/40 hover:shadow-[0_0_15px_rgba(124,111,255,0.06)]' :
              skill.category === 'backend' ? 'hover:border-secondary/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.06)]' :
              'hover:border-accent/40 hover:shadow-[0_0_15px_rgba(255,95,158,0.06)]';

            const barColor = 
              activeTab === 'trash' ? 'from-gray-500 to-gray-700' :
              skill.category === 'frontend' ? 'from-primary to-accent' :
              skill.category === 'backend' ? 'from-secondary to-primary' :
              'from-accent to-danger';

            return (
              <div 
                key={skill.id} 
                className={`relative bg-[#0d0d1a] border border-white/5 p-6 rounded-2xl transition-all duration-300 group overflow-hidden ${borderAccent}`}
              >
                {/* Action buttons visible on hover */}
                {activeTab === 'active' ? (
                  <>
                    <button
                      onClick={() => handleDeleteClick(skill)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-danger/10 border border-danger/20 text-danger hover:text-white hover:bg-danger text-[10px] font-bold font-mono transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 select-none z-10"
                      title="Move to Recycle Bin"
                    >
                      ✕
                    </button>
                    <div className="absolute inset-0 bg-[#0d0d1a]/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 select-none">
                      <button 
                        onClick={() => handleEditClick(skill)} 
                        className="px-4 py-2 bg-primary/20 border border-primary/40 text-primary hover:text-white rounded-xl text-xs font-mono uppercase font-black transition-all active:scale-95"
                      >
                        ✏️ Edit Skill
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(skill)} 
                        className="px-4 py-2 bg-danger/10 border border-danger/30 text-danger hover:text-white rounded-xl text-xs font-mono uppercase font-black transition-all active:scale-95"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[#0d0d1a]/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 select-none">
                    <button 
                      onClick={() => handleRestoreClick(skill)} 
                      className="px-4 py-2 bg-success/20 border border-success/40 text-success hover:text-white rounded-xl text-xs font-mono uppercase font-black transition-all active:scale-95"
                    >
                      🔄 Restore
                    </button>
                    <button 
                      onClick={() => handlePermanentDeleteClick(skill)} 
                      className="px-4 py-2 bg-danger/10 border border-danger/30 text-danger hover:text-white rounded-xl text-xs font-mono uppercase font-black transition-all active:scale-95"
                    >
                      🗑️ Permanent Delete
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4 select-none">
                  <span className="text-white font-bold font-display text-sm tracking-wide">
                    {skill.name}
                  </span>
                  
                  {activeTab === 'active' ? (
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                      skill.category === 'frontend' ? 'bg-primary/10 text-primary' :
                      skill.category === 'backend' ? 'bg-secondary/10 text-secondary' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {skill.category}
                    </span>
                  ) : (
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded tracking-wider uppercase bg-danger/10 text-danger border border-danger/20`}>
                      ⏳ {getDaysRemaining(skill.deletedAt)} Days Left
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`} 
                      style={{ width: `${skill.level}%` }} 
                    />
                  </div>
                  <span className="text-xs font-mono font-black text-white w-10 text-right">
                    {skill.level}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SlidePanel Skills details forms */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleCancelEdit}
        title={editingSkill ? '✏️ Edit Tech Skill' : '⚡ Add Tech Skill'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Skill Name */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Skill / Language Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Node.js"
              className="admin-input text-xs sm:text-sm font-semibold"
              disabled={formLoading}
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Stack Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="admin-input text-xs sm:text-sm font-sans"
              disabled={formLoading}
            >
              <option value="frontend">Frontend Frameworks & UI</option>
              <option value="backend">Backend & Databases</option>
              <option value="tools">AI, DevOps & Designing Tools</option>
            </select>
          </div>

          {/* Level slider (0-100) with live preview of bar */}
          <div>
            <div className="flex justify-between items-center mb-2 select-none">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted">Proficiency Rating</label>
              <span className="text-xs font-mono text-secondary font-black">{formData.level}%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="level"
                min="0"
                max="100"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary focus:outline-none"
                disabled={formLoading}
              />
            </div>
            
            {/* Live visual progress preview bar inside the form */}
            <div className="mt-3 p-3 bg-dark/50 rounded-xl border border-white/5 select-none">
              <div className="flex justify-between items-center mb-1.5 text-[9px] font-mono text-muted uppercase">
                <span>Visual Live Preview:</span>
                <span className="font-bold">{formData.level}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${
                    formData.category === 'frontend' ? 'from-primary to-accent' :
                    formData.category === 'backend' ? 'from-secondary to-primary' :
                    'from-accent to-danger'
                  } rounded-full transition-all duration-300`}
                  style={{ width: `${formData.level}%` }}
                />
              </div>
            </div>
          </div>

          {/* Display Order Sequence */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 select-none">Display Sequence Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              placeholder="1"
              min="1"
              className="admin-input text-xs sm:text-sm"
              disabled={formLoading}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 select-none">
            <button
              type="submit"
              className="flex-1 admin-btn uppercase font-mono tracking-wider text-xs py-3.5"
              disabled={formLoading}
            >
              {formLoading ? 'Saving...' : editingSkill ? 'Save Changes' : 'Register Skill'}
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

    </div>
  );
}
