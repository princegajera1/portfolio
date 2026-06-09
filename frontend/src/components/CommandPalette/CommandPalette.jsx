import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { COMMANDS } from '../../hooks/useCommandPalette';
import useCommandPalette from '../../hooks/useCommandPalette';
import { cn } from '../../utils/cn';

export default function CommandPalette() {
  const {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    filteredCommands,
    recent,
    executeCommand
  } = useCommandPalette();

  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation inside list
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          executeCommand(filteredCommands[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, activeIndex, executeCommand, setIsOpen]);

  // Auto scroll to active item
  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const recentCommands = COMMANDS.filter(c => recent.includes(c.id));

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Palette Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-[600px] bg-[#0A0A0F]/90 border border-border-dark rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden font-sans flex flex-col max-h-[480px] z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 border-b border-border-dark h-14">
            <FiSearch className="w-4 h-4 text-text-secondary-dark" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search navigation, social links, or theme actions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveIndex(0);
              }}
              className="flex-1 bg-transparent border-none outline-none text-text-primary-dark placeholder-text-secondary-dark text-sm w-full font-mono"
            />
            <span className="text-[10px] font-mono border border-border-dark px-1.5 py-0.5 rounded text-text-secondary-dark select-none">
              ESC
            </span>
          </div>

          {/* List panel */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Recent commands */}
            {recentCommands.length > 0 && !search.trim() && (
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-primary px-3 block">
                  Recent Commands
                </span>
                {recentCommands.map((cmd) => (
                  <div
                    key={`rec-${cmd.id}`}
                    onClick={() => executeCommand(cmd)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-text-primary-dark hover:bg-white/5 cursor-pointer font-sans"
                  >
                    <span className="text-sm">{cmd.icon}</span>
                    <span className="flex-1 font-semibold">{cmd.label}</span>
                    <span className="text-[9px] font-mono text-text-secondary-dark">{cmd.category}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Categorized Filtered commands */}
            {filteredCommands.length > 0 ? (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-text-secondary-dark px-3 block">
                    {category}
                  </span>
                  {items.map((cmd) => {
                    const flatIdx = filteredCommands.findIndex(c => c.id === cmd.id);
                    const isActive = flatIdx === activeIndex;
                    return (
                      <div
                        key={cmd.id}
                        data-active={isActive}
                        onClick={() => executeCommand(cmd)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer font-sans',
                          isActive 
                            ? 'bg-primary text-black font-bold' 
                            : 'text-text-primary-dark hover:bg-white/5'
                        )}
                      >
                        <span className="text-sm">{cmd.icon}</span>
                        <span className="flex-1">{cmd.label}</span>
                        <span className={cn(
                          'text-[9px] font-mono',
                          isActive ? 'text-black/85' : 'text-text-secondary-dark'
                        )}>
                          {cmd.value || 'Action'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs font-mono text-text-secondary-dark">
                No matching commands found.
              </div>
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="h-10 border-t border-border-dark px-4 flex items-center justify-between text-[9px] font-mono text-text-secondary-dark select-none">
            <div className="flex gap-4">
              <span>↑↓ to navigate</span>
              <span>ENTER to select</span>
            </div>
            <span>Press ESC to close</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export { COMMANDS };
