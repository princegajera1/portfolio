import { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function TagInput({
  label,
  tags = [],
  onChange,
  placeholder = 'Type tag and press Enter...',
  suggestions = [],
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !tags.includes(val)) {
        onChange([...tags, val]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const addPreset = (preset) => {
    if (!tags.includes(preset)) {
      onChange([...tags, preset]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[10px] font-mono text-text-secondary-dark uppercase font-bold pl-1">
          {label}
        </label>
      )}

      {/* Pill Box Input */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 bg-[#111118] border border-border-dark rounded-xl focus-within:border-primary transition-all duration-300 min-h-11">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 bg-white/5 border border-border-dark pl-2.5 pr-1 py-0.5 rounded-lg text-xs font-mono text-text-secondary-dark uppercase font-bold hover:border-red-500/50 hover:text-red-400 group transition-all"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="p-0.5 rounded text-text-secondary-dark group-hover:text-red-400 hover:bg-white/5"
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none outline-none text-text-primary-dark text-xs font-mono min-w-[120px] px-1"
        />
      </div>

      {/* Quick Add Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-1">
          <span className="text-[8px] font-mono font-black text-text-secondary-dark uppercase mr-1 select-none">
            Suggested:
          </span>
          {suggestions
            .filter((preset) => !tags.includes(preset))
            .map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => addPreset(preset)}
                className="bg-[#1A1A24] border border-border-dark hover:border-primary/40 hover:text-primary px-2 py-0.5 rounded text-[8px] font-mono text-text-secondary-dark uppercase transition-colors"
              >
                + {preset}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
