import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = forwardRef(({
  children,
  className,
  bodyClassName,
  hoverGlow = false,
  glowColor = 'primary', // 'primary' | 'secondary'
  onClick,
  ...props
}, ref) => {
  const glowClasses = {
    primary: 'hover:shadow-glow hover:border-primary/30',
    secondary: 'hover:shadow-glow-secondary hover:border-secondary/30'
  };

  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02, y: -4 },
    whileTap: { scale: 0.98 },
    onClick,
    style: { cursor: 'pointer' }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border-dark bg-surface-dark/40 backdrop-blur-xl transition-all duration-300',
        hoverGlow && glowClasses[glowColor],
        className
      )}
      {...motionProps}
      {...props}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-white/[0.04] pointer-events-none" />
      <div className={cn("relative z-10", bodyClassName || "p-6")}>
        {children}
      </div>
    </Component>
  );
});

Card.displayName = 'Card';
export default Card;
