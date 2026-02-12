'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isUpcoming = currentStep < step.id;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors duration-300',
                  isCompleted ? 'bg-success-500 text-white' : isCurrent ? 'bg-warm-500 text-neutral-900 ring-2 ring-neutral-400 dark:ring-gray-700 dark:bg-gray-900 dark:text-white' : 'bg-neutral-200 text-neutral-700 border border-neutral-400 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  step.id + 1
                )}
              </motion.div>

              <div className="mt-3 text-center">
                <p
                  className={cn(
                    'text-xs font-bold transition-colors duration-200 uppercase tracking-wide',
                    isCurrent || isCompleted ? 'text-neutral-900 dark:text-gray-100' : 'text-neutral-600 dark:text-gray-400'
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-neutral-600 dark:text-gray-400 mt-1 max-w-[120px]">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 mt-[-40px] bg-neutral-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{
                    width: isCompleted ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="h-full bg-success-500 dark:bg-success-300"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
