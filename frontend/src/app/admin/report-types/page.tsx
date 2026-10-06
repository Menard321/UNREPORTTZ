'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { MOCK_REPORT_TYPES } from '@/lib/data/mock-data';

export default function AdminReportTypesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-teal-400" /> Report Types Registry
        </h1>
        <p className="text-xs text-slate-400">Configure report categories and requirements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_REPORT_TYPES.map((rt) => (
          <Card key={rt.id} className="p-6 bg-slate-950 border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white">{rt.name}</h3>
            <p className="text-xs text-slate-400">{rt.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
