'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
}

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const checks = [
    { label: 'At least 8 characters', met: hasMinLength },
    { label: 'One uppercase letter (A-Z)', met: hasUppercase },
    { label: 'One lowercase letter (a-z)', met: hasLowercase },
    { label: 'One number (0-9)', met: hasNumber },
    { label: 'One special character (!@#$%)', met: hasSpecial },
  ];

  const score = checks.filter((c) => c.met).length;

  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';

  if (score >= 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
  } else if (score >= 3) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500';
  }

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          <span>Password strength:</span>
          <span className={score >= 5 ? 'text-emerald-600 font-bold' : score >= 3 ? 'text-amber-600' : 'text-red-500'}>
            {strengthLabel}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
          <div className={`h-full flex-1 transition-all duration-300 ${score >= 1 ? strengthColor : 'bg-transparent'}`} />
          <div className={`h-full flex-1 transition-all duration-300 ${score >= 3 ? strengthColor : 'bg-transparent'}`} />
          <div className={`h-full flex-1 transition-all duration-300 ${score >= 5 ? strengthColor : 'bg-transparent'}`} />
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[11px]">
        {checks.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 transition-colors ${
              item.met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {item.met ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
