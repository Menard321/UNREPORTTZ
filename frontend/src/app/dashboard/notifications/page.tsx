'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, ShieldCheck, FileText, CreditCard } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/data/mock-data';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" /> Notifications & Alerts
        </h1>
        <p className="text-xs text-slate-500">
          Stay updated on report status, payment confirmations, and university template updates.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <Card key={notif.id} className="p-4 flex items-start gap-4 hover:border-blue-500/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
              {notif.category === 'Report' ? <FileText className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                <span className="text-[10px] text-slate-400">{formatDate(notif.createdAt)}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{notif.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
