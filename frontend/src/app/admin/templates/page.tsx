'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import { MOCK_TEMPLATES } from '@/lib/data/mock-data';

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-teal-400" /> Template Formatting Rules
        </h1>
        <p className="text-xs text-slate-400">Configure institutional margin rules, fonts, and chapter outlines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_TEMPLATES.map((tmpl) => (
          <Card key={tmpl.id} className="p-6 bg-slate-950 border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white">{tmpl.universityName}</h3>
            <p className="text-xs font-semibold text-teal-400">{tmpl.reportTypeName}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
