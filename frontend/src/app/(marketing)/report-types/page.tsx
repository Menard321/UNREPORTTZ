'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, BookOpen, Award, FileText } from 'lucide-react';
import { MOCK_REPORT_TYPES } from '@/lib/data/mock-data';

export default function ReportTypesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Academic Formats</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Supported Academic Report Types
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Discover structured report frameworks aligned with Tanzanian university curriculum standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_REPORT_TYPES.map((rt) => (
          <Card key={rt.id} className="p-6 space-y-5 hover:border-blue-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{rt.name}</h3>
                  <span className="text-xs font-mono text-slate-400">Slug: {rt.slug}</span>
                </div>
              </div>
              <Badge variant="teal">Verified Format</Badge>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {rt.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Typical Academic Use</span>
              <p className="text-xs text-slate-700 dark:text-slate-300">{rt.typicalUse}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Required Information Fields</span>
              <div className="flex flex-wrap gap-2">
                {rt.requiredInformation.map((info, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                    {info}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Universities: <strong>{rt.supportedUniversities.join(', ')}</strong>
              </span>
              <Link href={`/dashboard/generate?type=${rt.slug}`}>
                <Button size="sm" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Use This Report Type
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
