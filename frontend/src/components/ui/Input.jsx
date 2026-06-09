import { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({
  label,
  id,
  type = 'text',
  className,
  error,
  value,
  onChange,
  required = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const active = focused || (value && value.toString().length > 0);

  return (
    <div className="relative w-full mb-6 font-sans">
      <input
        ref={ref}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'w-full h-11 px-4 bg-surface-dark/60 border rounded-lg text-text-primary-dark font-sans text-sm outline-none transition-all duration-300',
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-border-dark focus:border-primary focus:ring-1 focus:ring-primary',
          className
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'absolute left-4 top-3 px-1 text-xs select-none transition-all duration-300 pointer-events-none rounded bg-transparent',
            active 
              ? '-translate-y-5 text-[10px] text-primary bg-[#0A0A0F]/90 font-semibold' 
              : 'text-text-secondary-dark text-sm'
          )}
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {error && (
        <span className="text-[10px] text-red-400 font-mono mt-1 block pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({
  label,
  id,
  className,
  error,
  value,
  onChange,
  rows = 4,
  required = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const active = focused || (value && value.toString().length > 0);

  return (
    <div className="relative w-full mb-6 font-sans">
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'w-full py-3 px-4 bg-surface-dark/60 border rounded-lg text-text-primary-dark font-sans text-sm outline-none transition-all duration-300 resize-none',
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-border-dark focus:border-primary focus:ring-1 focus:ring-primary',
          className
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'absolute left-4 top-3 px-1 text-xs select-none transition-all duration-300 pointer-events-none rounded bg-transparent',
            active 
              ? '-translate-y-5 text-[10px] text-primary bg-[#0A0A0F]/90 font-semibold' 
              : 'text-text-secondary-dark text-sm'
          )}
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {error && (
        <span className="text-[10px] text-red-400 font-mono mt-1 block pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
