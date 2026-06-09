import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiX, FiMinus, FiCpu } from 'react-icons/fi';
import { chatbotResponses, fallbackResponse } from '../../data/chatbotResponses';
import { cn } from '../../utils/cn';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'bot',
      text: 'Hi, I\'m Prince\'s AI assistant! ✨ Ask me anything about Prince\'s projects, tech stack, certifications, or hire status.',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const quickPrompts = [
    { label: 'What skills does Prince have?', val: 'skills' },
    { label: 'Show me React projects', val: 'react projects' },
    { label: 'How to contact Prince?', val: 'contact info' },
    { label: 'Download resume', val: 'download resume' },
    { label: 'What is Prince learning?', val: 'what are you learning' }
  ];

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Trigger bot typing delay
    setIsTyping(true);
    setTimeout(() => {
      // Response match engine
      const query = text.toLowerCase();
      let matched = null;

      for (const [key, cat] of Object.entries(chatbotResponses)) {
        if (cat.keywords.some(keyword => query.includes(keyword))) {
          matched = cat;
          break;
        }
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: matched ? matched.response : fallbackResponse,
        link: matched?.link,
        linkLabel: matched?.linkLabel,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleLinkClick = (link) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      setIsOpen(false);
      navigate(link);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9998] font-sans">
      
      {/* Floating Spark Sparkle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(true);
            setMinimized(false);
          }}
          className="relative group p-4 bg-gradient-to-tr from-primary to-secondary text-black rounded-full shadow-2xl flex items-center justify-center cursor-pointer active:scale-95"
          aria-label="Ask Prince AI"
        >
          {/* Pulsing Outer Ring */}
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping pointer-events-none scale-105" />
          <FiCpu className="w-6 h-6 stroke-[2.5px]" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-surface-dark border border-border-dark text-[10px] text-text-primary-dark font-mono rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            Ask about Prince
          </div>
        </motion.button>
      )}

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="w-[340px] sm:w-[380px] h-[500px] bg-[#0A0A0F]/90 border border-border-dark rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111118] border-b border-border-dark select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#6C63FF]" />
                <span className="font-display font-extrabold text-xs text-text-primary-dark">
                  Ask Prince AI ✨
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary-dark">
                <button
                  onClick={() => setMinimized(true)}
                  className="p-1 hover:text-text-primary-dark hover:bg-white/5 rounded transition-colors"
                  title="Minimize"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:text-text-primary-dark hover:bg-white/5 rounded transition-colors"
                  title="Close"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bubble Message Display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col max-w-[80%] space-y-1',
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  )}
                >
                  <div
                    className={cn(
                      'px-3.5 py-2.5 text-xs leading-relaxed rounded-2xl text-left select-text',
                      msg.sender === 'user'
                        ? 'bg-gradient-to-tr from-primary to-indigo-600 text-white rounded-tr-none'
                        : 'bg-white/5 border border-border-dark text-text-primary-dark rounded-tl-none backdrop-blur-md'
                    )}
                  >
                    <div className="whitespace-pre-line font-sans">{msg.text}</div>
                    
                    {/* Embedded Navigation / Redirect buttons */}
                    {msg.link && (
                      <button
                        onClick={() => handleLinkClick(msg.link)}
                        className="mt-3 block px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:text-primary rounded-lg text-[10px] font-mono font-bold uppercase transition-all select-none w-full text-center"
                      >
                        {msg.linkLabel || 'Open Detail Page'}
                      </button>
                    )}
                  </div>
                  <span className="text-[8px] font-mono text-text-secondary-dark px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {/* Bot Typing indicator */}
              {isTyping && (
                <div className="flex flex-col mr-auto max-w-[80%] space-y-1">
                  <div className="px-4 py-3 bg-white/5 border border-border-dark rounded-2xl rounded-tl-none flex items-center justify-center gap-1 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Quick chips suggested prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto select-none border-t border-border-dark bg-black/10">
                {quickPrompts.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleSendMessage(p.label)}
                    className="px-2 py-1 bg-white/5 border border-border-dark hover:border-primary/40 rounded-full text-[9px] text-text-secondary-dark hover:text-text-primary-dark transition-all active:scale-95 whitespace-nowrap"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 p-3 bg-[#111118] border-t border-border-dark select-none"
            >
              <input
                type="text"
                placeholder="Ask about Prince's tech skills, etc..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white/5 border border-border-dark focus:border-primary rounded-xl px-3 py-2 text-xs outline-none text-text-primary-dark transition-colors font-sans"
              />
              <button
                type="submit"
                className="p-2.5 bg-gradient-to-tr from-primary to-secondary text-black rounded-xl hover:shadow-lg transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                aria-label="Send"
              >
                <FiSend className="w-3.5 h-3.5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized header tab box */}
      {isOpen && minimized && (
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={() => setMinimized(false)}
          className="px-4 py-2.5 bg-gradient-to-tr from-primary to-secondary text-black font-display font-extrabold text-xs rounded-xl shadow-2xl flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 transition-all select-none active:scale-95"
        >
          <FiMessageSquare className="w-4 h-4 stroke-[2.5px]" />
          <span>Ask Prince AI</span>
        </motion.div>
      )}

    </div>
  );
}
