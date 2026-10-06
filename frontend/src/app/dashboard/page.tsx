'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  FileText, 
  FileClock, 
  CheckCircle2, 
  Download, 
  ArrowRight,
  BookOpenCheck,
  CreditCard,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { MOCK_REPORTS } from '@/lib/data/mock-data';
import { formatDate } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const totalReports = MOCK_REPORTS.length;
  const draftsCount = MOCK_REPORTS.filter((r) => r.status === 'Draft').length;
  const completedCount = MOCK_REPORTS.filter((r) => r.status === 'Ready' || r.status === 'Paid').length;
  const downloadsCount = MOCK_REPORTS.filter((r) => r.status === 'Paid').length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 text-white shadow-lg">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good day, {user?.name || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100">
            Continue working on your academic reports for {user?.universityName || 'University of Dar es Salaam'}.
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 font-bold shrink-0" icon={<PlusCircle className="w-5 h-5" />}>
            + Generate New Report
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalReports}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Drafts</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{draftsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <FileClock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Downloads</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{downloadsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/generate">
            <Card className="p-4 hover:border-blue-500/50 hover:shadow-md transition-all flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Generate Report</h4>
                <p className="text-[10px] text-slate-500">Create new AI report</p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/drafts">
            <Card className="p-4 hover:border-amber-500/50 hover:shadow-md transition-all flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <FileClock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Continue Draft</h4>
                <p className="text-[10px] text-slate-500">Pick up where left off</p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/templates">
            <Card className="p-4 hover:border-teal-500/50 hover:shadow-md transition-all flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Browse Templates</h4>
                <p className="text-[10px] text-slate-500">University standards</p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/payments">
            <Card className="p-4 hover:border-indigo-500/50 hover:shadow-md transition-all flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">View Payments</h4>
                <p className="text-[10px] text-slate-500">Invoices & exports</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Reports</h3>
          <Link href="/dashboard/reports" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Reports <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">Report Title</th>
                  <th className="p-4">University</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {MOCK_REPORTS.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {report.title}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{report.universityName}</td>
                    <td className="p-4 text-slate-500 capitalize">{report.reportTypeSlug.replace(/-/g, ' ')}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          report.status === 'Ready' || report.status === 'Paid'
                            ? 'success'
                            : report.status === 'Draft'
                            ? 'warning'
                            : 'primary'
                        }
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(report.updatedAt)}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/editor/${report.id}`}>
                        <Button size="sm" variant="outline" icon={<Edit3 className="w-3.5 h-3.5" />}>
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/preview/${report.id}`}>
                        <Button size="sm" variant="ghost" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                          Preview
                        </Button>
                      </Link>
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
