import { useState, useEffect } from 'react';
import { getMessages, deleteMessage, markAsRead } from '../firebase/messages';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import SlidePanel from '../components/SlidePanel';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export default function ViewMessages() {
  const toast = useToast();
  const confirm = useConfirm();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Load and listen to messages
  useEffect(() => {
    let unsubSnapshot = () => {};

    if (isFirebaseConfigured && db) {
      setLoading(true);
      unsubSnapshot = onSnapshot(collection(db, 'messages'), (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sorted = msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(sorted);
        setLoading(false);
      }, (err) => {
        console.error("Messages panel snapshot error:", err);
        toast.error("Failed to connect to messages database");
        setLoading(false);
      });
    } else {
      // Local storage sync/polling
      const syncLocalMessages = () => {
        const local = JSON.parse(localStorage.getItem('prince_messages') || '[]');
        const sorted = local.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(sorted);
        setLoading(false);
      };
      
      syncLocalMessages();
      const interval = setInterval(syncLocalMessages, 1500);
      return () => clearInterval(interval);
    }

    return () => unsubSnapshot();
  }, []);

  const handleOpenDetail = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await markAsRead(msg.id, true);
        toast.success("Message marked as read");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkReadState = async (e, msg) => {
    e.stopPropagation();
    try {
      await markAsRead(msg.id, !msg.read);
      toast.success(msg.read ? "Message marked as unread" : "Message marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update message status");
    }
  };

  const handleDeleteClick = async (e, msg) => {
    e.stopPropagation();
    const approved = await confirm({
      title: "Delete this message?",
      subtitle: `Are you sure you want to delete the message from "${msg.name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      confirmVariant: "danger"
    });

    if (!approved) return;

    try {
      await deleteMessage(msg.id);
      toast.success("Message deleted successfully!");
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  const formatTimestamp = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString() + ' @ ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      return isoString;
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-2 border-primary pl-3 py-2 select-none">
        <div>
          <h2 className="text-white font-display text-lg font-bold">Client Messages Inbox</h2>
          <p className="text-muted text-xs font-light">Review recruiter inquiries, job openings, and pitches.</p>
        </div>
        
        <div className="flex items-center gap-3 font-mono text-xs select-none">
          {unreadCount > 0 && (
            <span className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-secondary px-3 py-1 rounded-full uppercase font-bold animate-pulse">
              {unreadCount} Unread
            </span>
          )}
          <span className="bg-white/5 border border-white/5 text-gray-400 px-3 py-1 rounded-full uppercase font-bold">
            Total: {messages.length}
          </span>
        </div>
      </div>

      {loading ? (
        <SkeletonCard count={3} type="table" />
      ) : messages.length === 0 ? (
        <EmptyState 
          icon="📫" 
          title="Your inbox is clean!" 
          description="Recruiter inquiries and client message requests will show up here in real time."
        />
      ) : (
        /* Messages Table List */
        <div className="space-y-3">
          {messages.map((msg) => {
            const isUnread = !msg.read;
            return (
              <div 
                key={msg.id}
                onClick={() => handleOpenDetail(msg)}
                className={`border rounded-xl transition-all duration-300 relative cursor-pointer p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isUnread 
                    ? 'border-[#00E5FF]/30 border-l-[4px] border-l-secondary bg-[#13132A] shadow-[0_0_15px_rgba(0,229,255,0.02)]' 
                    : 'border-white/5 bg-[#0d0d1a] opacity-80 hover:opacity-100'
                } hover:border-[#7C6FFF]/30`}
              >
                {/* Message Header & Left Dot Indicator */}
                <div className="flex gap-4 items-start flex-1 min-w-0 pr-4">
                  {/* Status Indicator Dot */}
                  <div className="pt-1.5 select-none">
                    <span 
                      className={`w-2.5 h-2.5 rounded-full block ${
                        isUnread 
                          ? 'bg-secondary shadow-[0_0_8px_#00e5ff] animate-pulse' 
                          : 'bg-muted/40'
                      }`} 
                    />
                  </div>

                  {/* Text Columns */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className={`text-white text-sm tracking-wide ${isUnread ? 'font-black' : 'font-semibold'}`}>
                        {msg.name}
                      </h3>
                      <span className="text-[10px] font-mono text-muted select-text">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>

                    <p className="text-muted text-xs leading-relaxed line-clamp-1 mt-1 font-light pr-6">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Right metadata columns & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-6 select-none border-t border-white/5 md:border-none pt-3 md:pt-0">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block md:text-right">
                    {formatTimestamp(msg.createdAt)}
                  </span>

                  <div className="flex gap-3 items-center font-mono text-[10px] font-bold">
                    <button 
                      onClick={() => handleOpenDetail(msg)}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                      👁 View
                    </button>
                    <button 
                      onClick={(e) => handleMarkReadState(e, msg)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-secondary text-gray-400 hover:text-secondary transition-all active:scale-95"
                    >
                      {isUnread ? '✓ Read' : '✓ Unread'}
                    </button>
                    <button 
                      onClick={(e) => handleDeleteClick(e, msg)}
                      className="px-3 py-1.5 rounded-lg bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white transition-all active:scale-95"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SlidePanel Message Detail view */}
      <SlidePanel 
        isOpen={!!selectedMessage} 
        onClose={() => setSelectedMessage(null)} 
        title="💬 Client Inquiry Detail"
      >
        {selectedMessage && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="p-4 rounded-xl bg-dark border border-white/5 select-text">
              <div className="grid grid-cols-3 gap-2 text-xs leading-relaxed">
                <span className="text-muted font-mono uppercase tracking-wider">Sender:</span>
                <span className="col-span-2 text-white font-bold font-display">{selectedMessage.name}</span>
                
                <span className="text-muted font-mono uppercase tracking-wider">Email:</span>
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="col-span-2 text-secondary font-mono hover:underline font-semibold"
                >
                  {selectedMessage.email}
                </a>

                <span className="text-muted font-mono uppercase tracking-wider">Date/Time:</span>
                <span className="col-span-2 text-gray-400 font-mono">{formatTimestamp(selectedMessage.createdAt)}</span>
              </div>
            </div>

            {/* Message Body Content */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted select-none">Message Body</label>
              <div className="p-5 rounded-2xl bg-dark border border-[#7C6FFF]/12 text-sm text-text font-sans font-light leading-relaxed whitespace-pre-line select-text max-h-[300px] overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            {/* Reply Actions */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 select-none">
              <a 
                href={`mailto:${selectedMessage.email}?subject=Regarding your message to Prince Gajera&body=Hi ${selectedMessage.name},\n\nThanks for reaching out! `}
                className="flex-1 text-center py-3 bg-secondary hover:bg-secondary/90 text-dark font-mono uppercase tracking-wider text-xs font-black rounded-xl transition-all duration-300 shadow-lg shadow-secondary/15 active:scale-95"
              >
                Reply via Email &rarr;
              </a>
              <button 
                onClick={(e) => handleDeleteClick(e, selectedMessage)}
                className="px-6 py-3 border border-danger/40 hover:bg-danger text-danger hover:text-white rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 active:scale-95"
              >
                Delete Message
              </button>
            </div>
            
            <button
              onClick={() => setSelectedMessage(null)}
              className="w-full text-center py-2.5 bg-transparent hover:bg-white/5 border border-white/10 text-muted hover:text-white rounded-xl font-mono text-[10px] uppercase tracking-widest font-semibold transition-colors"
            >
              &larr; Back to Inbox
            </button>
          </div>
        )}
      </SlidePanel>

    </div>
  );
}
