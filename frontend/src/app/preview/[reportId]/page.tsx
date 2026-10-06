'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Printer, 
  ArrowLeft, 
  Edit3, 
  ShieldCheck, 
  Lock, 
  FileText,
  Building2,
  GraduationCap
} from 'lucide-react';
import { reportService } from '@/lib/api/reports';
import { AcademicReport } from '@/types';
import confetti from 'canvas-confetti';

export default function DocumentPreviewPage() {
  const params = useParams();
  const reportId = params.reportId as string;

  const [report, setReport] = useState<AcademicReport | null>(null);
  const [viewMode, setViewMode] = useState<'paged' | 'full'>('paged');

  useEffect(() => {
    async function loadReport() {
      const rep = await reportService.getReportById(reportId);
      if (rep) setReport(rep);
    }
    loadReport();
  }, [reportId]);

  const handleDownloadPdf = () => {
    confetti({ particleCount: 80, spread: 60 });
    alert('Simulating PDF Export Download for ' + report?.title);
  };

  const handleDownloadDocx = () => {
    confetti({ particleCount: 80, spread: 60 });
    alert('Simulating DOCX Editable Download for ' + report?.title);
  };

  const isPaid = report?.status === 'Paid';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Preview Action Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href={`/editor/${reportId}`}>
            <Button variant="ghost" size="sm" className="text-slate-300" icon={<ArrowLeft className="w-4 h-4" />}>
              Return to Editor
            </Button>
          </Link>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white max-w-md truncate">{report?.title}</h1>
            <p className="text-[10px] text-slate-400">{report?.universityName} Standard Format</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="hidden sm:inline-flex p-1 rounded-lg bg-slate-800 text-xs">
            <button
              onClick={() => setViewMode('paged')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'paged' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Paged Preview
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'full' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Continuous
            </button>
          </div>

          <Button variant="outline" size="sm" className="border-slate-700 text-slate-200" onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
            Print
          </Button>

          {isPaid ? (
            <>
              <Button variant="accent" size="sm" onClick={handleDownloadPdf} icon={<Download className="w-4 h-4" />}>
                PDF Export
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownloadDocx} icon={<Download className="w-4 h-4" />}>
                Editable DOCX
              </Button>
            </>
          ) : (
            <Link href={`/dashboard/payments/${reportId}`}>
              <Button variant="primary" size="sm" icon={<Lock className="w-4 h-4" />}>
                Pay TZS 15,000 to Export
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Document Preview Stage */}
      <main className="flex-1 p-4 sm:p-8 flex justify-center items-start overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-white text-slate-900 shadow-2xl rounded-none p-12 md:p-16 space-y-10 min-h-[1050px]">
          {!isPaid && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 rotate-[-30deg]">
              <span className="text-6xl sm:text-8xl font-black uppercase text-slate-900 tracking-widest">
                UNIREPORTTZ PREVIEW WATERMARK
              </span>
            </div>
          )}

          {/* Cover Page Layout */}
          <div className="text-center space-y-8 py-8 border-b-2 border-slate-900">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl">
                {report?.universityName.substring(0, 4) || 'UDSM'}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{report?.universityName}</h2>
              <p className="text-sm font-semibold uppercase text-slate-700 mt-1">{report?.programmeName}</p>
            </div>

            <div className="py-6 space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 max-w-xl mx-auto leading-snug">
                {report?.title}
              </h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Field Practical Training Report
              </p>
            </div>

            <div className="text-xs space-y-1.5 text-slate-800 font-medium">
              <p>Submitted by: <strong>{report?.regNumber || '2023-04-08219'}</strong></p>
              <p>Academic Supervisor: <strong>{report?.academicSupervisor || 'Dr. Josephat Shirima'}</strong></p>
              <p>Field Supervisor: <strong>{report?.fieldSupervisor || 'Eng. Godfrey Mwakyusa'}</strong></p>
              <p className="pt-2 text-slate-500 font-semibold">{report?.academicYear || '2024/2025 Academic Year'}</p>
            </div>
          </div>

          {/* Chapters Body */}
          <div className="space-y-8">
            {report?.sections.map((sec) => (
              <div key={sec.id} className="space-y-3">
                <h3 className="text-lg font-bold uppercase text-slate-900 border-b border-slate-300 pb-1">
                  {sec.title}
                </h3>
                <div className="text-sm leading-relaxed text-slate-800 font-serif whitespace-pre-wrap">
                  {sec.content}
                </div>
              </div>
            ))}
          </div>

          {/* Document Footer */}
          <div className="pt-12 border-t text-center text-[11px] text-slate-400 font-mono">
            Generated via UniReportTZ Platform • Verified Tanzanian Academic Standard Format
          </div>
        </div>
      </main>
    </div>
  );
}
