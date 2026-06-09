import { useState, useEffect, useMemo } from 'react';
import { FiSave, FiSettings, FiSliders, FiGlobe, FiShare2, FiFileText } from 'react-icons/fi';
import useSettings from '../../hooks/useSettings';
import { Input, Textarea } from '../../components/ui/Input';
import { logActivity } from '../../firebase/activity';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const isFormDataDirty = (current, original) => {
  if (!original) return false;
  if (current.name !== (original.name || '')) return true;
  if (current.title !== (original.title || '')) return true;
  if (current.bio !== (original.bio || '')) return true;
  if (current.email !== (original.email || '')) return true;
  if (current.phone !== (original.phone || '')) return true;
  if (current.location !== (original.location || '')) return true;
  if (current.avatarUrl !== (original.avatarUrl || '')) return true;
  if (current.resumeUrl !== (original.resumeUrl || '')) return true;
  if (current.openToWork !== !!original.openToWork) return true;
  if (current.defaultTheme !== (original.defaultTheme || 'dark')) return true;
  if (current.accentColor !== (original.accentColor || '#6C63FF')) return true;
  if (current.seoTitle !== (original.seoTitle || '')) return true;
  if (current.seoDescription !== (original.seoDescription || '')) return true;

  const sCurr = current.socialLinks || {};
  const sOrig = original.socialLinks || {};
  if (sCurr.github !== (sOrig.github || '')) return true;
  if (sCurr.linkedin !== (sOrig.linkedin || '')) return true;
  if (sCurr.twitter !== (sOrig.twitter || '')) return true;
  if (sCurr.instagram !== (sOrig.instagram || '')) return true;

  return false;
};

export default function Settings() {
  const { settings, loading, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'socials' | 'seo' | 'resume'
  const [saveStatus, setSaveStatus] = useState('default'); // 'default' | 'saving' | 'success' | 'error'

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    avatarUrl: '',
    resumeUrl: '',
    openToWork: false,
    defaultTheme: 'dark',
    accentColor: '#6C63FF',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: ''
    },
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        title: settings.title || '',
        bio: settings.bio || '',
        email: settings.email || '',
        phone: settings.phone || '',
        location: settings.location || '',
        avatarUrl: settings.avatarUrl || '',
        resumeUrl: settings.resumeUrl || '',
        openToWork: !!settings.openToWork,
        defaultTheme: settings.defaultTheme || 'dark',
        accentColor: settings.accentColor || '#6C63FF',
        socialLinks: {
          github: settings.socialLinks?.github || '',
          linkedin: settings.socialLinks?.linkedin || '',
          twitter: settings.socialLinks?.twitter || '',
          instagram: settings.socialLinks?.instagram || ''
        },
        seoTitle: settings.seoTitle || '',
        seoDescription: settings.seoDescription || ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [id]: value
      }
    }));
  };

  const isDirty = useMemo(() => {
    return isFormDataDirty(formData, settings);
  }, [formData, settings]);

  // Dispatch unsaved changes state to window listeners (for sidebar badge)
  useEffect(() => {
    window.hasUnsavedSettings = isDirty;
    window.dispatchEvent(new CustomEvent('unsavedSettingsChanged', { detail: isDirty }));
    return () => {
      window.hasUnsavedSettings = false;
      window.dispatchEvent(new CustomEvent('unsavedSettingsChanged', { detail: false }));
    };
  }, [isDirty]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form Field Validations
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error('Developer Name must be at least 2 characters.');
      return;
    }
    if (!formData.title || formData.title.trim().length === 0) {
      toast.error('Professional Title is required.');
      return;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (formData.phone && !/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      toast.error('Contact Phone must match +91XXXXXXXXXX or a valid international format.');
      return;
    }
    if (!formData.bio || formData.bio.trim().length < 20 || formData.bio.trim().length > 300) {
      toast.error('Biography Statement must be between 20 and 300 characters.');
      return;
    }

    try {
      setSaveStatus('saving');
      await updateSettings(formData);
      await logActivity('settings_update', 'Updated settings and profiles configurations');
      toast.success('Configuration parameters updated');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('default'), 2000);
    } catch (err) {
      toast.error('Failed to update configuration settings');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('default'), 3000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [formData, settings]);

  const discardChanges = () => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        title: settings.title || '',
        bio: settings.bio || '',
        email: settings.email || '',
        phone: settings.phone || '',
        location: settings.location || '',
        avatarUrl: settings.avatarUrl || '',
        resumeUrl: settings.resumeUrl || '',
        openToWork: !!settings.openToWork,
        defaultTheme: settings.defaultTheme || 'dark',
        accentColor: settings.accentColor || '#6C63FF',
        socialLinks: {
          github: settings.socialLinks?.github || '',
          linkedin: settings.socialLinks?.linkedin || '',
          twitter: settings.socialLinks?.twitter || '',
          instagram: settings.socialLinks?.instagram || ''
        },
        seoTitle: settings.seoTitle || '',
        seoDescription: settings.seoDescription || ''
      });
      toast.success('Unsaved changes discarded');
    }
  };

  const getButtonProps = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          className: 'bg-primary/50 text-[#0d0d0f] cursor-not-allowed border-primary/20',
          content: (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline-block align-middle" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="align-middle">Saving...</span>
            </>
          ),
          disabled: true
        };
      case 'success':
        return {
          className: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500 hover:border-emerald-600 text-white font-bold',
          content: 'Saved ✓',
          disabled: false
        };
      case 'error':
        return {
          className: 'bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white font-bold',
          content: 'Save Failed — Try Again',
          disabled: false
        };
      default:
        return {
          className: 'bg-primary hover:bg-primary/90 text-black border-primary font-bold',
          content: (
            <>
              <FiSave className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ),
          disabled: false
        };
    }
  };

  const buttonProps = getButtonProps();

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-text-secondary-dark">
        Fetching settings profiles...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1A1A24] border border-border-dark p-6 rounded-2xl">
        <div>
          <h1 className="text-xl font-display font-extrabold text-text-primary-dark">
            Global Settings
          </h1>
          <p className="text-xs font-mono text-text-secondary-dark mt-1">
            Configure default profile tokens, contact details, social links, and SEO metadata.
          </p>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {isDirty && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
            <span>You have unsaved changes in your settings form.</span>
          </div>
          <button
            type="button"
            onClick={discardChanges}
            className="underline text-yellow-500 hover:text-yellow-400 font-bold"
          >
            Discard
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left vertical tabs */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-primary text-black font-extrabold'
                : 'text-text-secondary-dark hover:text-text-primary-dark hover:bg-white/5'
            }`}
          >
            <FiSettings className="w-4 h-4 flex-shrink-0" />
            Profile Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('socials')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'socials'
                ? 'bg-primary text-black font-extrabold'
                : 'text-text-secondary-dark hover:text-text-primary-dark hover:bg-white/5'
            }`}
          >
            <FiShare2 className="w-4 h-4 flex-shrink-0" />
            Social Links
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'seo'
                ? 'bg-primary text-black font-extrabold'
                : 'text-text-secondary-dark hover:text-text-primary-dark hover:bg-white/5'
            }`}
          >
            <FiGlobe className="w-4 h-4 flex-shrink-0" />
            SEO & Brand
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'resume'
                ? 'bg-primary text-black font-extrabold'
                : 'text-text-secondary-dark hover:text-text-primary-dark hover:bg-white/5'
            }`}
          >
            <FiFileText className="w-4 h-4 flex-shrink-0" />
            Resume PDF
          </button>
        </div>

        {/* Right Content Pane */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="bg-[#1A1A24] border border-border-dark p-8 rounded-2xl space-y-6">
            
            {/* Tab 1: Profile Info */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-text-primary-dark border-b border-border-dark pb-2 flex items-center gap-2">
                  <FiSettings className="text-primary" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Developer Name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Professional Title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Textarea
                    label="Biography Statement"
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] font-mono text-text-secondary-dark uppercase font-bold">Min 20, Max 300 chars</span>
                    <span className={`text-[10px] font-mono font-bold ${formData.bio.length < 20 || formData.bio.length > 300 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formData.bio.length} / 300
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Contact Email"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Input
                    label="Contact Phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91XXXXXXXXXX"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Location Tagline"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  <Input
                    label="Avatar Image URL"
                    id="avatarUrl"
                    type="url"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center pl-2 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="openToWork"
                      checked={formData.openToWork}
                      onChange={handleChange}
                      className="w-4.5 h-4.5 bg-surface-dark border-border-dark rounded text-primary focus:ring-primary focus:ring-offset-bg-dark"
                    />
                    <span className="text-xs font-mono text-text-primary-dark font-bold uppercase tracking-wider">
                      Open to job opportunities (Hire badge trigger)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Tab 2: Social Links */}
            {activeTab === 'socials' && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-text-primary-dark border-b border-border-dark pb-2 flex items-center gap-2">
                  <FiShare2 className="text-primary" />
                  Social Media Configurations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="GitHub Profile URL"
                    id="github"
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={handleSocialChange}
                    placeholder="https://github.com/..."
                  />
                  <Input
                    label="LinkedIn Profile URL"
                    id="linkedin"
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={handleSocialChange}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Twitter / X Profile URL"
                    id="twitter"
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={handleSocialChange}
                    placeholder="https://x.com/..."
                  />
                  <Input
                    label="Instagram Profile URL"
                    id="instagram"
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={handleSocialChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            )}

            {/* Tab 3: SEO & Brand */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-text-primary-dark border-b border-border-dark pb-2 flex items-center gap-2">
                  <FiGlobe className="text-primary" />
                  SEO Tags & App Branding
                </h3>

                <Input
                  label="SEO Title Tag"
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="Google search listing header..."
                />

                <Textarea
                  label="SEO Description Metadata"
                  id="seoDescription"
                  rows={4}
                  value={formData.seoDescription}
                  onChange={handleChange}
                  placeholder="Google search summary card text..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="defaultTheme" className="block text-[10px] font-mono text-text-secondary-dark uppercase font-bold mb-2">
                      Default Theme Preference
                    </label>
                    <select
                      id="defaultTheme"
                      value={formData.defaultTheme}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-surface-dark/60 border border-border-dark rounded-lg text-text-primary-dark font-sans text-sm outline-none focus:border-primary transition-all duration-300"
                    >
                      <option value="dark">Dark Theme (Recommended)</option>
                      <option value="light">Light Theme</option>
                    </select>
                  </div>

                  <Input
                    label="Primary Accent Hex Color Code"
                    id="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    placeholder="#6C63FF"
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Resume PDF */}
            {activeTab === 'resume' && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-text-primary-dark border-b border-border-dark pb-2 flex items-center gap-2">
                  <FiFileText className="text-primary" />
                  Active Resume File Configuration
                </h3>

                <Input
                  label="Resume PDF File URL"
                  id="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  placeholder="e.g. /resume.pdf"
                />

                {/* Mock Drag-Drop PDF */}
                <div className="border-2 border-dashed border-border-dark hover:border-primary/50 transition-all rounded-xl p-8 text-center bg-[#0D0D14]/60">
                  <FiFileText className="w-8 h-8 text-text-secondary-dark mx-auto mb-2" />
                  <span className="text-[10px] font-mono text-text-primary-dark font-bold uppercase block">
                    Drag and Drop New Resume PDF
                  </span>
                  <span className="text-[8px] font-mono text-text-secondary-dark block mt-1">
                    (Simulated File Dropper. Auto-syncs to active local storage buffers)
                  </span>
                </div>
              </div>
            )}

            {/* Action buttons footer */}
            <div className="flex justify-end pt-6 border-t border-border-dark">
              <Button
                type="submit"
                variant="primary"
                className={buttonProps.className}
                disabled={buttonProps.disabled}
              >
                {buttonProps.content}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
