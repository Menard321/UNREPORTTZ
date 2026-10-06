'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { useTheme } from '@/lib/context/theme-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown, 
  User as UserIcon, 
  Settings, 
  LogOut
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/data/mock-data';

export function DashboardTopbar({ onToggleMobileMenu }: { onToggleMobileMenu: () => void }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifsCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports, templates, or references..."
            className="bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right Actions: Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 z-50 animate-in fade-in duration-150 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <Badge variant="primary">{unreadNotifsCount} New</Badge>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.linkUrl || '/dashboard/notifications'}
                    onClick={() => setNotifDropdownOpen(false)}
                    className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs space-y-1"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200">{notif.title}</p>
                    <p className="text-slate-500 line-clamp-2">{notif.message}</p>
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link href="/dashboard/notifications" onClick={() => setNotifDropdownOpen(false)} className="text-xs font-semibold text-blue-600 hover:underline">
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name.charAt(0) || 'U'
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'student'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in duration-150 space-y-1 text-xs">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
                <p className="text-[10px] text-blue-600 font-semibold mt-1">{user?.universityName}</p>
              </div>

              <Link
                href="/dashboard/profile"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                <UserIcon className="w-4 h-4" /> Profile Details
              </Link>

              <Link
                href="/dashboard/settings"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                <Settings className="w-4 h-4" /> Account Settings
              </Link>

              <button
                onClick={() => { setUserDropdownOpen(false); logout(); }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
