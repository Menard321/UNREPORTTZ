'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Progress({ value, className }: { value: number; className?: string }) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden', className)}>
      <div
        className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
