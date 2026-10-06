'use client';

import React from 'react';
import Link from 'next/link';
import { AuthBrandPanel } from '@/components/auth/auth-brand-panel';
import { GraduationCap, HelpCircle, MessageSquare } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span>UniReport<span className="text-blue-600 dark:text-blue-400">TZ</span></span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/help" className="hidden sm:flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              Need Help?
            </Link>
            <Link href="/contact" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Contact Support
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area: Desktop Split / Mobile Single Column */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual Brand Panel */}
          <AuthBrandPanel />

          {/* Right Authentication Form Area */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 UniReportTZ. Built for Tanzanian Universities • <Link href="/about" className="hover:underline">Terms</Link> • <Link href="/contact" className="hover:underline">Privacy</Link></p>
      </footer>
    </div>
  );
}
