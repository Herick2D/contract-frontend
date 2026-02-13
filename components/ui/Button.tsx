import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

    const variants = {
      primary:
        'bg-warm-500 text-neutral-900 font-bold hover:bg-warm-600 focus:ring-warm-500 shadow-sm hover:shadow-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-all uppercase tracking-wide text-xs',
      secondary:
        'bg-neutral-600 text-white font-bold hover:bg-neutral-700 focus:ring-neutral-500 shadow-sm hover:shadow-md dark:bg-gray-600 dark:hover:bg-gray-500 uppercase tracking-wide text-xs',
      outline:
        'border-2 border-neutral-600 text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-400 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-gray-800 font-bold uppercase tracking-wide text-xs',
      ghost:
        'text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-300 dark:text-gray-300 dark:hover:bg-gray-800 font-semibold',
      danger:
        'bg-error-500 text-white hover:bg-error-600 focus:ring-error-400 shadow-sm dark:bg-red-600 font-bold uppercase tracking-wide text-xs',
    };

    const sizes = {
      sm: 'h-9 px-4 text-xs gap-2',
      md: 'h-10 px-5 text-xs gap-2',
      lg: 'h-11 px-6 text-sm gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
