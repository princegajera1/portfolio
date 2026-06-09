import { cn } from '../../utils/cn';

export default function Badge({
  children,
  className,
  variant = 'primary', // 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'
  size = 'md' // 'sm' | 'md'
}) {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-semibold rounded-full select-none';

  const variants = {
    primary: 'bg-primary/10 border border-primary/20 text-primary',
    secondary: 'bg-secondary/10 border border-secondary/20 text-secondary',
    neutral: 'bg-white/5 border border-white/10 text-text-secondary-dark',
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-400'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[11px]'
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
