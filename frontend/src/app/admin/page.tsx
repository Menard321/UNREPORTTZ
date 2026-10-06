'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  CreditCard, 
  Building2, 
  TrendingUp, 
  ShieldCheck,
  Download
} from 'lucide-react';
import { adminService } from '@/lib/api/admin';
import { AdminAnalytics } from '@/types';
import { formatCurrencyTzs } from '@/lib/utils';
import { MOCK_PAYMENTS } from '@/lib/data/mock-data';

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    async function loadStats() {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Executive Platform Analytics
        </h1>
        <p className="text-xs text-slate-400">
          Real-time metrics for UniReportTZ system usage, revenue reconciliation, and university template compliance.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 bg-slate-950 border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Students</span>
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{analytics?.totalStudents?.toLocaleString() || '1,480'}</p>
          <span className="text-[11px] text-emerald-400 font-semibold">+18.4% this month</span>
        </Card>

        <Card className="p-5 bg-slate-950 border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Reports Generated</span>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{analytics?.reportsGenerated?.toLocaleString() || '3,840'}</p>
          <span className="text-[11px] text-blue-400 font-semibold">+24.1% completion rate</span>
        </Card>

        <Card className="p-5 bg-slate-950 border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Revenue (TZS)</span>
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {formatCurrencyTzs(analytics?.totalRevenueTzs || 48250000)}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold">M-Pesa & Tigo Pesa verified</span>
        </Card>

        <Card className="p-5 bg-slate-950 border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Institutions</span>
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">12 / 15</p>
          <span className="text-[11px] text-indigo-400 font-semibold">UDSM, UDOM, SUA, Mzumbe</span>
        </Card>
      </div>

      {/* Monthly Report Growth Breakdown */}
      <Card className="p-6 bg-slate-950 border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Top Supported Tanzanian Institutions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {analytics?.popularUniversities.map((st) => (
            <div key={st.name} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-xs font-bold text-slate-400">{st.name}</span>
              <p className="text-lg font-black text-teal-400 font-mono">{st.count} Reports</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Payments Log */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Recent Payment Transactions</h3>
        <Card className="overflow-hidden bg-slate-950 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Report</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount (TZS)</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_PAYMENTS.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/60">
                    <td className="p-4 font-mono font-bold text-white">{tx.transactionId}</td>
                    <td className="p-4 text-slate-300">{tx.reportTitle}</td>
                    <td className="p-4 font-bold text-teal-400">{tx.paymentMethod}</td>
                    <td className="p-4 font-mono text-white">{formatCurrencyTzs(tx.amountTzs)}</td>
                    <td className="p-4">
                      <Badge variant="success">{tx.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
