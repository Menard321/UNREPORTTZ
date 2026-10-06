'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  FileClock, 
  BookOpenCheck, 
  CreditCard, 
  Bell, 
  User, 
  Settings, 
  HelpCircle,
  GraduationCap,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

export function DashboardSidebar({ className, onCloseMobile }: { className?: string; onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/generate', label: 'Generate Report', icon: PlusCircle, highlight: true },
    { href: '/dashboard/reports', label: 'My Reports', icon: FileText },
    { href: '/dashboard/drafts', label: 'Drafts', icon: FileClock },
    { href: '/dashboard/templates', label: 'Templates', icon: BookOpenCheck },
    { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className={cn('w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between h-full', className)}>
      <div className="p-4 space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-slate-900 dark:text-white px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span>UniReport<span className="text-blue-600 dark:text-blue-400">TZ</span></span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold'
                    : item.highlight
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:opacity-95 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <Icon className={cn('w-4 h-4', item.highlight && !isActive ? 'text-white' : '')} />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <Sparkles className="w-3.5 h-3.5 ml-auto text-amber-300" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
