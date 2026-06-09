import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const RECENT_LIMIT = 3;
const RECENT_KEY = 'prince_recent_commands';

export const COMMANDS = [
  // Navigation
  { id: 'nav-home', label: 'Go to Home', category: 'Navigation', icon: '🏠', action: 'route', value: '/' },
  { id: 'nav-about', label: 'About Me', category: 'Navigation', icon: '👤', action: 'route', value: '/about' },
  { id: 'nav-projects', label: 'View Projects', category: 'Navigation', icon: '📁', action: 'route', value: '/projects' },
  { id: 'nav-contact', label: 'Contact Me', category: 'Navigation', icon: '💬', action: 'route', value: '/contact' },
  { id: 'nav-resume', label: 'View Resume', category: 'Navigation', icon: '📄', action: 'route', value: '/resume' },

  // Actions
  { id: 'act-resume-dl', label: 'Download Resume', category: 'Actions', icon: '📥', action: 'download', value: '/resume.pdf' },
  { id: 'act-email', label: 'Copy Email Address', category: 'Actions', icon: '📋', action: 'copy', value: 'princegajera944@gmail.com' },
  { id: 'act-github', label: 'Open GitHub Profile', category: 'Actions', icon: '🐙', action: 'url', value: 'https://github.com/princegajera1' },
  { id: 'act-linkedin', label: 'Open LinkedIn Profile', category: 'Actions', icon: '🔗', action: 'url', value: 'https://www.linkedin.com/in/gajera-prince/' },

  // Social
  { id: 'soc-twitter', label: 'Twitter/X Profile', category: 'Social', icon: '🐦', action: 'url', value: 'https://x.com/GajeraPrin20670' },
  { id: 'soc-instagram', label: 'Instagram Profile', category: 'Social', icon: '📸', action: 'url', value: 'https://www.instagram.com/gajera6902/' }
];

export default function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const toast = useToast();

  // Load recents on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) {
      try {
        setRecent(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent commands:', e);
      }
    }
  }, []);

  // Global key listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return COMMANDS;
    const q = search.toLowerCase();
    return COMMANDS.filter(cmd => 
      cmd.label.toLowerCase().includes(q) || 
      cmd.category.toLowerCase().includes(q)
    );
  }, [search]);

  const recordRecent = useCallback((cmdId) => {
    setRecent(prev => {
      const next = [cmdId, ...prev.filter(id => id !== cmdId)].slice(0, RECENT_LIMIT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const executeCommand = useCallback((cmd) => {
    recordRecent(cmd.id);
    setIsOpen(false);
    setSearch('');

    switch (cmd.action) {
      case 'route':
        navigate(cmd.value);
        break;
      case 'download':
        const link = document.createElement('a');
        link.href = cmd.value;
        link.download = 'Prince_Gajera_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Starting resume PDF download...');
        break;
      case 'theme':
        toggleTheme();
        toast.info('Toggled visual theme mode!');
        break;
      case 'copy':
        navigator.clipboard.writeText(cmd.value);
        toast.success(`Copied email to clipboard: ${cmd.value}`);
        break;
      case 'url':
        window.open(cmd.value, '_blank', 'noopener,noreferrer');
        break;
      default:
        console.warn(`Unknown command action: ${cmd.action}`);
    }
  }, [navigate, toggleTheme, toast, recordRecent]);

  return {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    filteredCommands,
    recent,
    executeCommand
  };
}
