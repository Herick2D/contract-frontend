import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200',
      success: 'bg-success-100 dark:bg-gray-800 text-success-700 dark:text-success-300',
      warning: 'bg-accent-100 dark:bg-gray-800 text-accent-700 dark:text-accent-300',
      error: 'bg-error-100 dark:bg-gray-800 text-error-700 dark:text-error-300',
      info: 'bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300',
    };
    
    const sizes = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
