import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-neutral-100 dark:bg-gray-800 rounded-lg border border-neutral-300 dark:border-gray-700',
      elevated: 'bg-neutral-100 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-300 dark:border-gray-700',
      bordered: 'bg-neutral-100 dark:bg-transparent dark:border-gray-700 rounded-lg border-2 border-neutral-400 dark:border-slate-700',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pb-4 border-b border-neutral-300 dark:border-gray-700', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-bold text-neutral-900 dark:text-gray-100', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-neutral-600 dark:text-gray-300 mt-1', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0 flex items-center gap-3', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
