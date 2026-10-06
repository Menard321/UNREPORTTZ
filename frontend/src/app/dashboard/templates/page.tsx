'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpenCheck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_TEMPLATES } from '@/lib/data/mock-data';

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-teal-600" /> University Template Guidelines
        </h1>
        <p className="text-xs text-slate-500">
          Official report structures verified against Tanzanian university handbooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_TEMPLATES.map((tmpl) => (
          <Card key={tmpl.id} className="p-6 space-y-4 hover:border-teal-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant={tmpl.status === 'Verified' ? 'success' : 'warning'}>
                  {tmpl.status} Guidelines
                </Badge>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{tmpl.universityName}</h3>
                <p className="text-xs font-semibold text-blue-600">{tmpl.reportTypeName}</p>
              </div>
              <span className="font-mono text-xs text-slate-400">{tmpl.version}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Formatting Rules</span>
              <div className="grid grid-cols-2 gap-2">
                <p>Font: <strong>{tmpl.formattingRules.fontFamily}</strong></p>
                <p>Size: <strong>{tmpl.formattingRules.fontSizeBody}</strong></p>
                <p>Spacing: <strong>{tmpl.formattingRules.lineSpacing}</strong></p>
                <p>Citation: <strong>{tmpl.formattingRules.citationStyle}</strong></p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Effective: {tmpl.effectiveDate}</span>
              <Link href={`/dashboard/generate?uni=${tmpl.universityId}&type=${tmpl.reportTypeSlug}`}>
                <Button size="sm" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Use Template
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
