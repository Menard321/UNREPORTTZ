'use client';

import React from 'react';
import { GraduationCap, ShieldCheck, CheckCircle2, BookOpen, Award, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-10 bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Background Decorative Gradient Radial */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 font-black">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white">
              UniReport<span className="text-teal-400">TZ</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Tanzania Academic Intelligence
            </span>
          </div>
        </div>
        <Badge variant="teal" className="bg-teal-500/10 border-teal-500/30 text-teal-300">
          v2026.1 Enterprise
        </Badge>
      </div>

      {/* Center Value Proposition */}
      <div className="relative z-10 space-y-6 my-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-blue-400" />
          <span>Institutional Reporting Standard</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Academic Reports, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
            Built Around Your University.
          </span>
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-md">
          Join thousands of university students across Tanzania generating, formatting, verifying, and exporting professional reports according to exact institutional guidelines.
        </p>

        {/* Feature List */}
        <div className="space-y-3 pt-2">
          {[
            { title: 'University-Specific Formatting', desc: 'Auto-adjusts font 12pt Times New Roman, line spacing, margins & signature fields for UDSM, UDOM, SUA, Mzumbe & ARU.', icon: BookOpen },
            { title: 'Verified Reference Citations', desc: 'DOI & ISBN database verification for IEEE, APA7, and Harvard academic styles.', icon: ShieldCheck },
            { title: 'AI Assistant & Quality Inspector', desc: 'Academic tone enhancement, objective structuring, and logbook evidence attachment checks.', icon: FileText },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3.5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <item.icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Quote */}
      <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Supported across 14+ Higher Learning Institutions
        </span>
        <span className="font-mono text-[10px] text-slate-500">TZ-EDTECH-2026</span>
      </div>
    </div>
  );
}
