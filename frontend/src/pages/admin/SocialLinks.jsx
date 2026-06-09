import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SiGithub, SiLinkedin, SiTwitter, SiInstagram } from 'react-icons/si';
import { FiMail, FiSave, FiEye, FiEyeOff, FiTrendingUp } from 'react-icons/fi';
import useSettings from '../../hooks/useSettings';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function SocialLinks() {
  const { settings, loading, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [savingRow, setSavingRow] = useState({});

  const [socialLinksState, setSocialLinksState] = useState({
    github: '',
    github_visible: true,
    linkedin: '',
    linkedin_visible: true,
    twitter: '',
    twitter_visible: true,
    instagram: '',
    instagram_visible: true,
  });

  const [emailState, setEmailState] = useState({
    email: '',
    email_visible: true,
  });

  useEffect(() => {
    if (settings) {
      setSocialLinksState({
        github: settings.socialLinks?.github || '',
        github_visible: settings.socialLinks?.github_visible !== false,
        linkedin: settings.socialLinks?.linkedin || '',
        linkedin_visible: settings.socialLinks?.linkedin_visible !== false,
        twitter: settings.socialLinks?.twitter || '',
        twitter_visible: settings.socialLinks?.twitter_visible !== false,
        instagram: settings.socialLinks?.instagram || '',
        instagram_visible: settings.socialLinks?.instagram_visible !== false,
      });
      setEmailState({
        email: settings.email || '',
        email_visible: settings.socialLinks?.email_visible !== false,
      });

      // Auto-cleanup database fields on mount
      const social = settings.socialLinks || {};
      if (
        social.youtube !== undefined ||
        social.youtube_visible !== undefined ||
        social.devto !== undefined ||
        social.devto_visible !== undefined ||
        social.custom1 !== undefined ||
        social.custom1_visible !== undefined ||
        social.custom1_label !== undefined ||
        social.custom2 !== undefined ||
        social.custom2_visible !== undefined ||
        social.custom2_label !== undefined
      ) {
        const cleanedSocial = { ...social };
        delete cleanedSocial.youtube;
        delete cleanedSocial.youtube_visible;
        delete cleanedSocial.devto;
        delete cleanedSocial.devto_visible;
        delete cleanedSocial.custom1;
        delete cleanedSocial.custom1_visible;
        delete cleanedSocial.custom1_label;
        delete cleanedSocial.custom2;
        delete cleanedSocial.custom2_visible;
        delete cleanedSocial.custom2_label;

        updateSettings({
          ...settings,
          socialLinks: cleanedSocial
        }).catch(err => console.error("Error cleaning up settings on mount:", err));
      }
    }
  }, [settings]);

  const handleUrlChange = (key, val) => {
    setSocialLinksState(prev => ({ ...prev, [key]: val }));
  };

  const handleLabelChange = (key, val) => {
    setSocialLinksState(prev => ({ ...prev, [key]: val }));
  };

  const handleVisibilityToggle = (key) => {
    if (key === 'email') {
      setEmailState(prev => ({ ...prev, email_visible: !prev.email_visible }));
    } else {
      setSocialLinksState(prev => ({ ...prev, [`${key}_visible`]: !prev[`${key}_visible`] }));
    }
  };

  const saveSingleRow = async (key) => {
    try {
      setSavingRow(prev => ({ ...prev, [key]: true }));
      const updatedSocialLinks = {
        ...settings.socialLinks,
        ...socialLinksState,
        email_visible: emailState.email_visible,
      };

      const updatedSettings = {
        ...settings,
        email: emailState.email,
        socialLinks: updatedSocialLinks,
      };

      await updateSettings(updatedSettings);
      toast.success(`${key.toUpperCase()} configurations updated`);
    } catch (err) {
      toast.error(`Failed to update ${key.toUpperCase()} settings`);
    } finally {
      setSavingRow(prev => ({ ...prev, [key]: false }));
    }
  };

  const saveAllLinks = async () => {
    try {
      setSaving(true);
      const updatedSocialLinks = {
        ...settings.socialLinks,
        ...socialLinksState,
        email_visible: emailState.email_visible,
      };

      const updatedSettings = {
        ...settings,
        email: emailState.email,
        socialLinks: updatedSocialLinks,
      };

      await updateSettings(updatedSettings);
      toast.success('All digital networks configurations updated');
    } catch (err) {
      toast.error('Failed to update social networks configurations');
    } finally {
      setSaving(false);
    }
  };

  const PLATFORMS = [
    { key: 'github', label: 'GitHub', icon: SiGithub, color: '#FFFFFF', placeholder: 'https://github.com/princegajera1' },
    { key: 'linkedin', label: 'LinkedIn', icon: SiLinkedin, color: '#0A66C2', placeholder: 'https://www.linkedin.com/in/gajera-prince/' },
    { key: 'twitter', label: 'Twitter/X', icon: SiTwitter, color: '#1DA1F2', placeholder: 'https://x.com/PrinceGajera14' },
    { key: 'instagram', label: 'Instagram', icon: SiInstagram, color: '#E1306C', placeholder: 'https://instagram.com/prince_gajera_14' },
    { key: 'email', label: 'Email Address', icon: FiMail, color: '#EA4335', placeholder: 'princegajera944@gmail.com', isEmail: true },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-text-secondary-dark">
        Syncing social network profiles...
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
            Social Networks Manager
          </h1>
          <p className="text-xs font-mono text-text-secondary-dark mt-1">
            Manage links and display visibility for your developer profiles and digital channels.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-[10px] font-mono font-bold uppercase tracking-wider self-start md:self-auto">
          <FiTrendingUp className="w-3.5 h-3.5" />
          Live Connections
        </div>
      </div>

      {/* Main card list */}
      <div className="bg-[#1A1A24] border border-border-dark rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-4 divide-y divide-border-dark/40">
          {PLATFORMS.map((platform, idx) => {
            const Icon = platform.icon;
            const isCustom = platform.isCustom;
            const isEmail = platform.isEmail;
            
            const currentUrl = isEmail ? emailState.email : socialLinksState[platform.key];
            const isVisible = isEmail ? emailState.email_visible : socialLinksState[`${platform.key}_visible`];
            const customLabel = isCustom ? socialLinksState[`${platform.key}_label`] : '';

            return (
              <motion.div 
                key={platform.key} 
                variants={itemVariants}
                className={`flex flex-col md:flex-row md:items-center gap-4 ${idx > 0 ? 'pt-5' : ''}`}
              >
                {/* Platform Badge */}
                <div className="flex items-center gap-3 w-full md:w-48 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-border-dark flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" style={{ color: platform.color }} />
                  </div>
                  <div>
                    {isCustom ? (
                      <input
                        type="text"
                        value={customLabel}
                        onChange={(e) => handleLabelChange(`${platform.key}_label`, e.target.value)}
                        className="bg-transparent text-text-primary-dark text-xs font-mono font-bold uppercase border-b border-dashed border-border-dark focus:border-primary focus:outline-none py-0.5 w-28"
                        placeholder={platform.label}
                      />
                    ) : (
                      <span className="text-xs font-mono font-bold uppercase text-text-primary-dark block">
                        {platform.label}
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-text-secondary-dark block mt-0.5">
                      {isCustom ? 'Custom Entry' : 'Default Profile'}
                    </span>
                  </div>
                </div>

                {/* Input block */}
                <div className="flex-1 min-w-0 mb-0">
                  <div className="relative">
                    <input
                      type={isEmail ? 'email' : 'url'}
                      value={currentUrl}
                      onChange={(e) => {
                        if (isEmail) {
                          setEmailState(prev => ({ ...prev, email: e.target.value }));
                        } else {
                          handleUrlChange(platform.key, e.target.value);
                        }
                      }}
                      placeholder={platform.placeholder}
                      className="w-full h-10 px-4 pr-10 bg-surface-dark/60 border border-border-dark rounded-lg text-text-primary-dark font-sans text-xs outline-none focus:border-primary transition-all duration-300"
                    />
                    {currentUrl && (
                      <span className="absolute right-3 top-3 text-[8px] font-mono font-bold text-primary uppercase select-none">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  {/* Visibility Button */}
                  <button
                    onClick={() => handleVisibilityToggle(platform.key)}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isVisible 
                        ? 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10' 
                        : 'bg-white/5 border-border-dark text-text-secondary-dark hover:bg-white/10'
                    }`}
                    title={isVisible ? 'Visible in connect grid' : 'Hidden in connect grid'}
                  >
                    {isVisible ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                  </button>

                  {/* Individual Save Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-10 !py-0 px-3 bg-white/5 border-border-dark text-text-primary-dark hover:bg-white/10"
                    onClick={() => saveSingleRow(platform.key)}
                    isLoading={savingRow[platform.key]}
                  >
                    <FiSave className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Save Footer */}
        <div className="flex justify-end pt-6 border-t border-border-dark mt-6">
          <Button
            variant="primary"
            onClick={saveAllLinks}
            isLoading={saving}
          >
            <FiSave className="w-4 h-4 mr-2" />
            Save All Links
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
