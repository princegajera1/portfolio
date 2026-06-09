import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = forwardRef(({
  children,
  className,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-dark disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-black hover:shadow-glow hover:-translate-y-0.5',
    secondary: 'border border-border-dark bg-white/5 text-text-primary-dark hover:bg-white/10 hover:border-primary/50 backdrop-blur-md',
    ghost: 'text-text-secondary-dark hover:text-text-primary-dark bg-transparent hover:bg-white/5',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg shadow-red-500/20'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] gap-1.5',
    md: 'px-6 py-3 text-xs gap-2',
    lg: 'px-8 py-4 text-sm gap-2.5'
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={disabled || isLoading ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
