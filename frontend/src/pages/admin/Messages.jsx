import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, FiTrash2, FiSearch, FiCheck, FiInbox, 
  FiUser, FiCalendar, FiClock, FiCornerUpLeft, FiCopy, FiCheckCircle, FiEyeOff
} from 'react-icons/fi';
import { subscribeToMessages, setMessageReadStatus, deleteMessage } from '../../firebase/contact';
import { logActivity } from '../../firebase/activity';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

// Relative time formatter
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

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'unread', 'read'
  const [deletingId, setDeletingId] = useState(null);

  // Subscribe to real-time messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages((data) => {
      setMessages(data || []);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter(m => !m.read).length;
    const read = total - unread;
    return { total, unread, read };
  }, [messages]);

  // Filter messages based on search & tab
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      // 1. Tab filter
      if (filterTab === 'unread' && msg.read) return false;
      if (filterTab === 'read' && !msg.read) return false;

      // 2. Search filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        msg.name?.toLowerCase().includes(query) ||
        msg.email?.toLowerCase().includes(query) ||
        msg.subject?.toLowerCase().includes(query) ||
        msg.message?.toLowerCase().includes(query)
      );
    });
  }, [messages, filterTab, searchQuery]);

  // Auto-select first message in list if none selected on desktop view
  const activeMessage = useMemo(() => {
    if (!activeMessageId && filteredMessages.length > 0) {
      return filteredMessages[0];
    }
    return messages.find(m => m.id === activeMessageId) || null;
  }, [activeMessageId, filteredMessages, messages]);

  // Auto-mark selected message as read if it is currently unread
  useEffect(() => {
    if (activeMessage && !activeMessage.read) {
      const timer = setTimeout(() => {
        setMessageReadStatus(activeMessage.id, true)
          .catch(err => console.error("Auto-mark read failed:", err));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeMessage]);

  const handleToggleReadStatus = async (msg) => {
    try {
      const nextState = !msg.read;
      await setMessageReadStatus(msg.id, nextState);
      toast.success(nextState ? 'Message marked as read' : 'Message marked as unread');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (!window.confirm(`Are you sure you want to delete the message from "${msg.name}"?`)) return;

    try {
      setDeletingId(msg.id);
      await deleteMessage(msg.id);
      await logActivity('message_delete', `Deleted message from ${msg.name} (${msg.subject})`);
      toast.success('Message deleted successfully');
      
      // Clear selection if deleted message was active
      if (activeMessageId === msg.id) {
        setActiveMessageId(null);
      }
    } catch (err) {
      toast.error('Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success('Email copied to clipboard');
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-6 text-left">
      
      {/* Top Header stats bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A24] border border-border-dark p-6 rounded-2xl flex-shrink-0">
        <div>
          <h1 className="text-xl font-display font-extrabold text-text-primary-dark">
            Messages Inbox
          </h1>
          <p className="text-xs font-mono text-text-secondary-dark mt-1">
            Read and manage contact submissions from your public website.
          </p>
        </div>
        <div className="flex gap-3 font-mono text-[10px] font-bold uppercase">
          <div className="px-3 py-1.5 bg-white/5 border border-border-dark rounded-lg flex items-center gap-1.5 text-text-secondary-dark">
            <span>Total:</span>
            <span className="text-text-primary-dark">{stats.total}</span>
          </div>
          <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-1.5 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Unread:</span>
            <span className="text-red-400">{stats.unread}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-1.5 text-emerald-400">
            <span>Read:</span>
            <span className="text-emerald-400">{stats.read}</span>
          </div>
        </div>
      </div>

      {/* Main Inbox Interface Grid */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        
        {/* Left Side: Messages list & controls */}
        <div className="w-full md:w-[360px] xl:w-[400px] flex flex-col gap-4 flex-shrink-0 bg-[#1A1A24]/40 border border-border-dark/60 rounded-2xl p-4 min-h-0">
          
          {/* Search and filter options */}
          <div className="space-y-3 flex-shrink-0">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-secondary-dark/60">
                <FiSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search inbox..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#0D0D14] border border-border-dark focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-text-primary-dark font-sans text-xs outline-none transition-all duration-300"
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-1.5 bg-[#0D0D14] p-1 rounded-xl border border-border-dark font-mono text-[9px] font-bold uppercase">
              {['all', 'unread', 'read'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`flex-1 py-1.5 rounded-lg transition-all duration-300 ${
                    filterTab === tab
                      ? 'bg-primary text-black'
                      : 'text-text-secondary-dark hover:text-text-primary-dark'
                  }`}
                >
                  {tab} ({tab === 'all' ? stats.total : tab === 'unread' ? stats.unread : stats.read})
                </button>
              ))}
            </div>
          </div>

          {/* List panel */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar min-h-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[84px] bg-[#1A1A24]/80 animate-pulse border border-border-dark/30 rounded-xl" />
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-xs font-mono text-text-secondary-dark border border-dashed border-border-dark rounded-xl select-none">
                <FiInbox className="w-8 h-8 mb-2.5 text-text-secondary-dark/40" />
                <span>No messages found matching search criteria.</span>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {filteredMessages.map((msg) => {
                  const isActive = activeMessage?.id === msg.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => setActiveMessageId(msg.id)}
                      className={`relative p-3.5 border rounded-xl cursor-pointer select-none transition-all duration-300 group ${
                        isActive
                          ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(0,229,255,0.05)]'
                          : 'bg-[#1A1A24] border-border-dark/50 hover:border-primary/30 hover:bg-[#1C1C29]'
                      }`}
                    >
                      {/* Left vertical status stripe */}
                      {!msg.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl shadow-[0_0_8px_#00e5ff]" />
                      )}

                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`text-xs font-sans font-bold truncate ${isActive ? 'text-primary' : 'text-text-primary-dark'}`}>
                          {msg.name}
                        </h4>
                        <span className="text-[9px] font-mono text-text-secondary-dark flex-shrink-0">
                          {getRelativeTime(msg.createdAt)}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono font-bold text-text-secondary-dark mt-1 truncate">
                        {msg.subject}
                      </div>

                      <p className="text-[10px] text-text-secondary-dark/80 line-clamp-2 mt-1.5 font-sans leading-tight">
                        {msg.message}
                      </p>

                      {/* Small notification indicator dot */}
                      {!msg.read && (
                        <div className="absolute right-3.5 bottom-3.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

        </div>

        {/* Right Side: Detailed message viewer */}
        <div className="hidden md:flex flex-1 flex-col bg-[#1A1A24]/60 border border-border-dark/60 rounded-2xl p-6 overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {!activeMessage ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 text-xs font-mono text-text-secondary-dark select-none"
              >
                <FiMail className="w-12 h-12 mb-3.5 text-text-secondary-dark/30 animate-bounce" />
                <span className="text-sm font-bold text-text-primary-dark">No Message Selected</span>
                <span className="mt-1 text-text-secondary-dark">Select a message from the inbox queue to view full details.</span>
              </motion.div>
            ) : (
              <motion.div
                key={activeMessage.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="h-full flex flex-col gap-6 min-h-0"
              >
                {/* Detail Header Actions */}
                <div className="flex justify-between items-center border-b border-border-dark/85 pb-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={activeMessage.read ? 'success' : 'warning'} className="font-mono text-[9px] uppercase tracking-wider">
                      {activeMessage.read ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Mark read/unread */}
                    <button
                      onClick={() => handleToggleReadStatus(activeMessage)}
                      className="p-2 border border-border-dark bg-[#0D0D14] hover:border-primary/40 text-text-secondary-dark hover:text-primary rounded-lg transition-all active:scale-95 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase"
                      title={activeMessage.read ? "Mark as Unread" : "Mark as Read"}
                    >
                      {activeMessage.read ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiCheckCircle className="w-3.5 h-3.5" />}
                      <span>{activeMessage.read ? 'Mark Unread' : 'Mark Read'}</span>
                    </button>

                    {/* Copy Email */}
                    <button
                      onClick={() => handleCopyEmail(activeMessage.email)}
                      className="p-2 border border-border-dark bg-[#0D0D14] hover:border-primary/40 text-text-secondary-dark hover:text-primary rounded-lg transition-all active:scale-95 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase"
                      title="Copy email address"
                    >
                      <FiCopy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteMessage(activeMessage)}
                      disabled={deletingId === activeMessage.id}
                      className="p-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 text-red-400 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase"
                      title="Delete message"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Detail Body Scroll area */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 space-y-6">
                  
                  {/* Sender Profile Header */}
                  <div className="flex items-start gap-4 p-4 bg-[#0D0D14]/80 border border-border-dark rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-6 h-6" />
                    </div>
                    
                    <div className="min-w-0 flex-1 leading-normal">
                      <h3 className="text-base font-sans font-bold text-text-primary-dark truncate">
                        {activeMessage.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <a 
                          href={`mailto:${activeMessage.email}`}
                          className="font-mono text-xs text-primary hover:underline truncate"
                        >
                          {activeMessage.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Message details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className="border-border-dark/60"
                      bodyClassName="p-4 flex items-center gap-3.5"
                    >
                      <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                        <FiCalendar className="w-4 h-4" />
                      </div>
                      <div className="leading-tight">
                        <div className="text-[9px] font-mono font-bold text-text-secondary-dark uppercase">Date Received</div>
                        <span className="text-xs font-semibold text-text-primary-dark">
                          {activeMessage.createdAt ? new Date(activeMessage.createdAt).toLocaleString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          }) : 'Simulated'}
                        </span>
                      </div>
                    </Card>

                    <Card 
                      className="border-border-dark/60"
                      bodyClassName="p-4 flex items-center gap-3.5"
                    >
                      <div className="p-2 rounded-lg bg-[#E8FF00]/10 text-[#E8FF00]">
                        <FiClock className="w-4 h-4" />
                      </div>
                      <div className="leading-tight">
                        <div className="text-[9px] font-mono font-bold text-text-secondary-dark uppercase">Response Status</div>
                        <span className="text-xs font-semibold text-text-primary-dark flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF00] animate-pulse" />
                          Pending Reply
                        </span>
                      </div>
                    </Card>
                  </div>

                  {/* Subject and content body */}
                  <div className="bg-[#0D0D14]/40 border border-border-dark/50 rounded-2xl p-6 space-y-4">
                    <div>
                      <h5 className="font-mono text-[9px] font-bold text-text-secondary-dark uppercase tracking-wider">
                        Subject Line
                      </h5>
                      <p className="text-sm font-bold text-text-primary-dark mt-1 font-sans">
                        {activeMessage.subject}
                      </p>
                    </div>
                    
                    <div className="border-t border-border-dark/40 pt-4">
                      <h5 className="font-mono text-[9px] font-bold text-text-secondary-dark uppercase tracking-wider mb-2">
                        Message Content
                      </h5>
                      <div className="text-xs text-text-primary-dark leading-relaxed font-sans whitespace-pre-wrap selection:bg-primary/20 selection:text-primary">
                        {activeMessage.message}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Reply action bar footer */}
                <div className="border-t border-border-dark/85 pt-4 flex-shrink-0 flex justify-end">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                    className="inline-flex items-center justify-center gap-2 px-5 h-11 bg-primary text-black rounded-lg text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    <FiCornerUpLeft className="w-4 h-4" />
                    <span>Reply via MailClient</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
