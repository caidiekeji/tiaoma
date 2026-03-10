'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const BORDER_WIDTH_MAP = {
  sm: 'border-2',
  md: 'border-3',
  lg: 'border-4',
};

export default function LoadingSpinner({
  size = 'md',
  color = 'blue-500',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClass = SIZE_MAP[size];
  const borderWidth = BORDER_WIDTH_MAP[size];

  return (
    <div
      className={`animate-spin rounded-full ${sizeClass} ${borderWidth} border-gray-200 dark:border-gray-600 border-t-${color} ${className}`}
      style={{ borderTopColor: color.startsWith('#') ? color : undefined }}
      role="status"
      aria-label="加载中"
    >
      <span className="sr-only">加载中...</span>
    </div>
  );
}
