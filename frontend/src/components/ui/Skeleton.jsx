import { cn } from '../../utils/cn';

export default function Skeleton({
  className,
  variant = 'text', // 'text' | 'rect' | 'circle'
}) {
  const baseStyles = 'animate-pulse bg-white/5 rounded';

  const variants = {
    text: 'h-4 w-full my-1',
    rect: 'h-32 w-full',
    circle: 'rounded-full h-12 w-12 flex-shrink-0'
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} />
  );
}
