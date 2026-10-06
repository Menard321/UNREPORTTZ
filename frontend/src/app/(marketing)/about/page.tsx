'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GraduationCap, Target, ShieldCheck, Cpu } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="primary">Mission & Vision</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About UniReportTZ
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          UniReportTZ is an AI-powered academic reporting workspace built around the specific requirements of Tanzanian higher education institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Empower Tanzanian university students to produce well-structured, rigorous, and properly formatted academic documents by combining AI intelligence with university-specific guidelines.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Academic Integrity</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We prioritize authentic student experiences, verified reference citations, and real evidence logbook attachment parsing over generic AI text creation.
          </p>
        </Card>
      </div>

      <Card className="p-8 space-y-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-teal-400" />
          <h3 className="text-xl font-bold">Technology & Architecture</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Built on modern engineering principles using Next.js, TypeScript, Tailwind CSS, and a robust Laravel REST API backend with PostgreSQL database isolation.
        </p>
      </Card>
    </div>
  );
}
