'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Building2, 
  FileSpreadsheet, 
  UploadCloud, 
  Sparkles, 
  CreditCard,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Student Account',
      desc: 'Sign up in under a minute with your email, student phone number, target university, and degree programme (e.g. UDSM B.Sc. Computer Science or UDOM B.Sc. Software Engineering).',
      icon: UserPlus,
      details: ['Email & phone validation', 'University selection profile', 'Degree year selection']
    },
    {
      num: '02',
      title: 'Choose University & Report Type',
      desc: 'Select the exact document standard required by your department. UniReportTZ automatically loads verified section structures, margin requirements, and formatting rules.',
      icon: Building2,
      details: ['UDSM, UDOM, SUA, Mzumbe, ARU, MUHAS & more', 'Field Training, Industrial Attachment, FYP, Research', 'Verified template loading']
    },
    {
      num: '03',
      title: 'Provide Academic Information',
      desc: 'Input your student registration number, academic year, semester, academic supervisor, field supervisor, and primary training objectives.',
      icon: FileSpreadsheet,
      details: ['Supervisor role mapping', 'Field attachment duration', 'Departmental requirements']
    },
    {
      num: '04',
      title: 'Upload Your Evidence',
      desc: 'Upload stamped logbook photos, site inspection images, lab measurements, or system screenshots. UniReportTZ parses evidence into labeled figures with university captions.',
      icon: UploadCloud,
      details: ['OCR & evidence captioning', 'Drag & drop image/PDF attachment', 'Automatic figure numbering']
    },
    {
      num: '05',
      title: 'AI Generation & Document Workspace',
      desc: 'Our AI engine generates initial draft chapters based on your provided evidence and university guidelines. Refine text in our rich interactive editor with full AI assistant support.',
      icon: Sparkles,
      details: ['Section-by-section AI assistant', 'Reference verification inspector', 'Real-time quality scoring (e.g. 94% Ready)']
    },
    {
      num: '06',
      title: 'Pay & Download Final Document',
      desc: 'Confirm payment using Tanzanian mobile money (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa) or bank transfer. Instantly download fully formatted PDF and DOCX files.',
      icon: CreditCard,
      details: ['Instant mobile money verification', 'Editable DOCX export', 'Print-ready PDF export']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Step-by-Step Guide</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How UniReportTZ Works
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          From initial registration to exporting a university-formatted document, experience a seamless academic reporting workflow designed for Tanzanian students.
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((step, idx) => (
          <Card key={step.num} className="p-8 hover:border-blue-500/50 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-1 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-mono font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  {step.num}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                  <step.icon className="w-4 h-4" />
                  <span>STEP {step.num}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
              </div>

              <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Highlights</span>
                {step.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center bg-blue-50 dark:bg-slate-900 p-10 rounded-2xl border border-blue-200 dark:border-slate-800 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to Start Your Report?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Begin with our step-by-step generator wizard and complete your academic report in record time.
        </p>
        <Link href="/dashboard/generate">
          <Button size="lg" variant="primary" icon={<ArrowRight className="w-5 h-5" />}>
            Start Generating Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
