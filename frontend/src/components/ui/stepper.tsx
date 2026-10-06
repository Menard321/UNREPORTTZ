'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  description?: string;
}

export function Stepper({ steps, currentStep }: { steps: StepItem[]; currentStep: number }) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2',
                    isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isCurrent
                      ? 'bg-white dark:bg-slate-900 border-blue-600 text-blue-600 ring-4 ring-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-semibold max-w-[80px] text-center hidden md:block',
                    isCurrent ? 'text-blue-600 dark:text-blue-400 font-bold' : isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all duration-300',
                    currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
