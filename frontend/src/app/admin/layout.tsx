'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { useTheme } from '@/lib/context/theme-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldAlert, 
  BarChart3, 
  Building2, 
  BookOpen, 
  CreditCard, 
  Users, 
  Sun, 
  Moon, 
  LogOut, 
  GraduationCap,
  Layers,
  FileCheck
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const adminNav = [
    { href: '/admin', label: 'Analytics & KPIs', icon: BarChart3 },
    { href: '/admin/universities', label: 'Universities', icon: Building2 },
    { href: '/admin/report-types', label: 'Report Types', icon: BookOpen },
    { href: '/admin/templates', label: 'Template Rules', icon: Layers },
    { href: '/admin/references', label: 'Citation Index', icon: FileCheck },
    { href: '/admin/payments', label: 'Payment Logs', icon: CreditCard },
    { href: '/admin/users', label: 'Student Accounts', icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="p-4 space-y-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-black text-xl text-white px-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span>UniReport<span className="text-teal-400">Admin</span></span>
          </Link>

          <nav className="space-y-1">
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300">
              Student View
            </Button>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Badge variant="teal">Super Admin Portal</Badge>
            <span>• System Operational</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="text-right text-xs">
              <p className="font-bold text-white">{user?.name || 'System Administrator'}</p>
              <p className="text-[10px] text-teal-400">admin@unireporttz.co.tz</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
