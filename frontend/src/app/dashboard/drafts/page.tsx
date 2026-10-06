'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileClock, Edit3, AlertTriangle, ArrowRight } from 'lucide-react';
import { MOCK_REPORTS } from '@/lib/data/mock-data';

export default function DraftsPage() {
  const drafts = MOCK_REPORTS.filter((r) => r.status === 'Draft');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <FileClock className="w-6 h-6 text-amber-500" /> Incomplete Drafts
        </h1>
        <p className="text-xs text-slate-500">
          Continue where you left off and complete missing student information.
        </p>
      </div>

      {drafts.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <p className="text-sm text-slate-500">No active incomplete drafts. All reports are completed!</p>
          <Link href="/dashboard/generate">
            <Button variant="primary">Start New Report</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {drafts.map((report) => (
            <Card key={report.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">In Progress</Badge>
                    <span className="text-xs text-slate-400 font-mono">ID: {report.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{report.title}</h3>
                  <p className="text-xs text-slate-500">{report.universityName} • {report.programmeName}</p>
                </div>

                <Link href={`/editor/${report.id}`}>
                  <Button variant="primary" icon={<Edit3 className="w-4 h-4" />}>
                    Continue Draft
                  </Button>
                </Link>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Completion Status</span>
                  <span>{report.completionPercentage}%</span>
                </div>
                <Progress value={report.completionPercentage} />
              </div>

              {report.missingFields.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Some required fields are missing:</span>
                    <p>{report.missingFields.join(', ')}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
