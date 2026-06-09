import { cn } from '../../utils/cn';

export default function Spinner({
  className,
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={cn(
          'animate-spin rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent',
          sizes[size],
          className
        )}
        style={{ borderColor: 'rgba(108, 99, 255, 0.15)', borderTopColor: '#6C63FF' }}
      />
    </div>
  );
}
