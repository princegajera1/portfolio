import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiImage, FiFolder } from 'react-icons/fi';
import useProjects from '../../hooks/useProjects';
import { Input, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { logActivity } from '../../firebase/activity';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, createProject, editProject, loading: hookLoading, refetch } = useProjects();
  const isEdit = !!id;

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'details' | 'media'
  const [formData, setFormData] = useState({
    title: '',
    seoTitle: '',
    description: '',
    problem: '',
    solution: '',
    tech: '',
    challenges: '',
    results: '',
    businessImpact: '',
    githubUrl: '',
    liveUrl: '',
    category: 'frontend',
    featured: false,
    image: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && projects.length > 0) {
      const match = projects.find(p => p.id === id);
      if (match) {
        setFormData({
          title: match.title || '',
          seoTitle: match.seoTitle || '',
          description: match.description || '',
          problem: match.problem || '',
          solution: match.solution || '',
          tech: Array.isArray(match.tech) ? match.tech.join(', ') : (match.tech || ''),
          challenges: match.challenges || '',
          results: match.results || '',
          businessImpact: match.businessImpact || '',
          githubUrl: match.githubUrl || '',
          liveUrl: match.liveUrl || '',
          category: match.category || 'frontend',
          featured: !!match.featured,
          image: match.image || '',
        });
      }
    }
  }, [id, isEdit, projects]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in required fields (Title, Description)');
      return;
    }

    try {
      setSubmitting(true);
      
      // Convert tech comma-string to clean array
      const techArray = formData.tech
        ? formData.tech.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        tech: techArray,
        updatedAt: new Date().toISOString()
      };

      if (isEdit) {
        await editProject(id, payload);
        await logActivity('project_edit', `Edited project: ${formData.title}`);
        toast.success('Project updated successfully');
      } else {
        await createProject({
          ...payload,
          createdAt: new Date().toISOString()
        });
        await logActivity('project_add', `Added new project: ${formData.title}`);
        toast.success('Project created successfully');
      }
      
      refetch();
      navigate('/admin/projects');
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? 'Failed to update project' : 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1A1A24] border border-border-dark p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="p-2 hover:bg-white/5 border border-border-dark text-text-secondary-dark hover:text-text-primary-dark rounded-xl transition-all"
            title="Go Back"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-extrabold text-text-primary-dark">
              {isEdit ? 'Edit Project Config' : 'Create New Project'}
            </h1>
            <p className="text-xs font-mono text-text-secondary-dark mt-1">
              Assemble dynamic Case Study statistics and layouts.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border-dark gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 font-mono text-xs uppercase font-bold tracking-wider transition-all border-b-2 ${
            activeTab === 'general' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-text-secondary-dark hover:text-text-primary-dark'
          }`}
        >
          General Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`px-6 py-3 font-mono text-xs uppercase font-bold tracking-wider transition-all border-b-2 ${
            activeTab === 'details' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-text-secondary-dark hover:text-text-primary-dark'
          }`}
        >
          Case Study Contexts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`px-6 py-3 font-mono text-xs uppercase font-bold tracking-wider transition-all border-b-2 ${
            activeTab === 'media' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-text-secondary-dark hover:text-text-primary-dark'
          }`}
        >
          Links & Assets
        </button>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="bg-[#1A1A24] border border-border-dark p-8 rounded-2xl space-y-6">
        
        {/* Tab 1: General Info */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Ruiz Diamonds"
              />
              <Input
                label="SEO Title Tag"
                id="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="e.g. Ruiz Diamonds - High-End E-commerce Platform"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-[10px] font-mono text-text-secondary-dark uppercase font-bold mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-surface-dark/60 border border-border-dark rounded-lg text-text-primary-dark font-sans text-sm outline-none focus:border-primary transition-all duration-300"
                >
                  <option value="frontend">Frontend Development</option>
                  <option value="fullstack">Fullstack Development</option>
                  <option value="mobile">Mobile Application</option>
                  <option value="automation">Workspace Scripting</option>
                </select>
              </div>

              <div className="flex items-center pt-8 pl-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4.5 h-4.5 bg-surface-dark border-border-dark rounded text-primary focus:ring-primary focus:ring-offset-bg-dark"
                  />
                  <span className="text-xs font-mono text-text-primary-dark font-bold uppercase tracking-wider">
                    Feature on Front Page
                  </span>
                </label>
              </div>
            </div>

            <Textarea
              label="Brief Description / Summary"
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a concise 2-3 sentence overview..."
            />

            <Input
              label="Tech Stack (Comma Separated)"
              id="tech"
              value={formData.tech}
              onChange={handleChange}
              placeholder="e.g. React, Tailwind CSS, Vite, Firebase"
            />
          </div>
        )}

        {/* Tab 2: Case Study Details */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Problem Statement"
                id="problem"
                rows={4}
                value={formData.problem}
                onChange={handleChange}
                placeholder="What user pain points or technical flaws did this solve?"
              />
              <Textarea
                label="Proposed Solution"
                id="solution"
                rows={4}
                value={formData.solution}
                onChange={handleChange}
                placeholder="How did you program/design the resolution?"
              />
            </div>

            <Textarea
              label="Technical Challenges"
              id="challenges"
              rows={3}
              value={formData.challenges}
              onChange={handleChange}
              placeholder="Any memory bottlenecks, API limits, or layout shifting constraints?"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Results & Optimization Metrics"
                id="results"
                rows={3}
                value={formData.results}
                onChange={handleChange}
                placeholder="e.g. Reduced bundle load by 45%"
              />
              <Textarea
                label="Business or User Impact"
                id="businessImpact"
                rows={3}
                value={formData.businessImpact}
                onChange={handleChange}
                placeholder="e.g. Session retention lifted by 20%"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Links & Media */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="GitHub Repository URL"
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
              <Input
                label="Live Deployment URL"
                id="liveUrl"
                type="url"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Input
                label="Project Banner Image URL"
                id="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
              
              {/* Mock Drag-Drop Uplod Zone */}
              <div className="border-2 border-dashed border-border-dark hover:border-primary/50 transition-all rounded-xl p-8 text-center bg-[#0D0D14]/60">
                <FiImage className="w-8 h-8 text-text-secondary-dark mx-auto mb-2" />
                <span className="text-[10px] font-mono text-text-primary-dark font-bold uppercase block">
                  Drag and Drop Image File
                </span>
                <span className="text-[8px] font-mono text-text-secondary-dark block mt-1">
                  (Simulated Upload Zone. Auto-saves to Firestore Asset Links)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border-dark">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/projects')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={submitting}
          >
            <FiSave className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
