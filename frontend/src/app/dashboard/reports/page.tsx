'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, Edit3, ExternalLink, Download, CreditCard } from 'lucide-react';
import { MOCK_REPORTS } from '@/lib/data/mock-data';
import { formatDate } from '@/lib/utils';
import { ReportStatus } from '@/types';

export default function MyReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReports = MOCK_REPORTS.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.universityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Academic Reports
          </h1>
          <p className="text-xs text-slate-500">
            View, edit, preview, pay, and export your academic report documents.
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />}>
            + Generate Report
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'draft', 'ready', 'paid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </Card>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-6 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">ID: {report.id}</span>
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
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {report.title}
              </h3>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>University:</strong> {report.universityName}</p>
                <p><strong>Programme:</strong> {report.programmeName}</p>
                <p><strong>Quality Readiness:</strong> <span className="text-emerald-600 font-bold">{report.qualityScore}%</span></p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Updated: {formatDate(report.updatedAt)}</span>
                <span>{report.sections.length} Chapters</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/editor/${report.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" icon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit Document
                  </Button>
                </Link>
                <Link href={`/preview/${report.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Preview
                  </Button>
                </Link>
                {report.status !== 'Paid' ? (
                  <Link href={`/dashboard/payments/${report.id}`}>
                    <Button variant="primary" size="sm" icon={<CreditCard className="w-3.5 h-3.5" />}>
                      Pay & Unlock
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/preview/${report.id}`}>
                    <Button variant="accent" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                      Download Export
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
