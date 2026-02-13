import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default:
        'bg-warm-500 dark:bg-gray-800 text-neutral-900 dark:text-gray-200 border border-neutral-600 dark:border-gray-700 font-bold uppercase text-xs',
      success:
        'bg-success-500 dark:bg-gray-800 text-white dark:text-success-300 border border-success-600 dark:border-gray-700 font-bold uppercase text-xs',
      warning:
        'bg-amber-500 dark:bg-gray-800 text-white dark:text-amber-300 border border-amber-600 dark:border-gray-700 font-bold uppercase text-xs',
      error:
        'bg-error-500 dark:bg-gray-800 text-white dark:text-error-300 border border-error-600 dark:border-gray-700 font-bold uppercase text-xs',
      info: 'bg-blue-500 dark:bg-gray-800 text-white dark:text-blue-200 border border-blue-600 dark:border-gray-700 font-bold uppercase text-xs',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1',
      md: 'text-xs px-3 py-1.5',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded',
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
