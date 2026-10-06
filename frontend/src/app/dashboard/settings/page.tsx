'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Bell, Moon, Lock } from 'lucide-react';
import { useTheme } from '@/lib/context/theme-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" /> Account & System Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage application theme, security credentials, active sessions, and privacy preferences.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Appearance & Theme</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Theme Mode</p>
            <p className="text-xs text-slate-500">Switch between light and dark high-contrast interface.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
          Security & Credentials
        </h3>
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Change Account Password</p>
              <p className="text-slate-500">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" size="sm">Update Password</Button>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
          Active Sessions
        </h3>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Current Web Browser (Windows 11 / Chrome)</p>
            <p className="text-slate-400">Dar es Salaam, Tanzania • Active now</p>
          </div>
          <Button variant="ghost" size="sm" className="text-rose-600">Revoke</Button>
        </div>
      </Card>
    </div>
  );
}
