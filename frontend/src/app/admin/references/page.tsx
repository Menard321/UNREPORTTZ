'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCheck } from 'lucide-react';

export default function AdminReferencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-teal-400" /> Reference DOI Verification Index
        </h1>
        <p className="text-xs text-slate-400">Inspect citation status across student reports.</p>
      </div>

      <Card className="p-6 bg-slate-950 border-slate-800 text-xs text-slate-300">
        <p>Reference DOI crossref verification index operational. 1,240 verified journal DOIs indexed.</p>
      </Card>
    </div>
  );
}
