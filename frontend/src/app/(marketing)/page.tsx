'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Building2, 
  FileText, 
  Upload, 
  Sliders, 
  Download, 
  Search,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { MOCK_UNIVERSITIES, MOCK_REPORT_TYPES } from '@/lib/data/mock-data';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [selectedUniIndex, setSelectedUniIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedUniIndex((prev) => (prev + 1) % MOCK_UNIVERSITIES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentUni = MOCK_UNIVERSITIES[selectedUniIndex];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>AI-POWERED ACADEMIC REPORTING FOR TANZANIA</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Academic Reports, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">
                  Built Around Your University.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Generate, edit and prepare professional academic reports using AI, university-specific requirements, verified references, and evidence attachment validation.
              </p>

              {/* Dynamic University Line */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    TZ
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-medium">Tailored formatting for:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-all duration-300">
                      {currentUni.name} ({currentUni.shortName})
                    </span>
                  </div>
                </div>
                <Badge variant="teal" className="hidden sm:inline-flex">Verified Template</Badge>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href={isAuthenticated ? '/dashboard/generate' : '/register'}>
                  <Button size="lg" variant="primary" icon={<ArrowRight className="w-5 h-5" />}>
                    Generate My Report
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline">
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  IEEE, APA7 & Harvard Citations
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  PDF & DOCX Export
                </span>
              </div>
            </div>

            {/* Hero Right Visual Workspace Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">unireport_workspace.v2</span>
                  </div>
                  <Badge variant="success">94% Quality Ready</Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                      UDSM • Field Practical Training Report
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                      Field Practical Training Report at TTCL Data Center
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Chapter 2: Technical Execution</span>
                      <span className="font-mono text-emerald-600">Saved • 1,420 words</span>
                    </div>
                    <div className="p-3 text-xs bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono leading-relaxed text-slate-700 dark:text-slate-300">
                      "Utilized Optical Time-Domain Reflectometers (OTDR) to identify single-mode attenuation points at 14.2 km. Performed fusion splicing achieving insertion loss &lt; 0.02 dB..."
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-between text-xs text-teal-800 dark:text-teal-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      <span>3 Reference Citations Verified</span>
                    </div>
                    <span className="font-semibold text-xs text-teal-700 dark:text-teal-400">IEEE Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Universities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="primary">Academic Compliance</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built Around Your University
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            UniReportTZ automatically adjusts font styles, margins, citation guidelines, and section structures for top Tanzanian institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_UNIVERSITIES.slice(0, 8).map((uni) => (
            <Card key={uni.id} className="p-5 hover:shadow-lg hover:border-blue-500/50 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                    {uni.shortName}
                  </span>
                  <Badge variant={uni.isVerified ? 'success' : 'secondary'}>
                    {uni.isVerified ? 'Verified' : 'Draft'}
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                  {uni.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{uni.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">{uni.reportTypes.length} Report Templates</span>
                <Link href={`/universities`} className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/universities">
            <Button variant="outline" icon={<Search className="w-4 h-4" />}>
              Explore All Supported Tanzanian Universities
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section (6 Steps) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Seamless Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Six Steps to a Verified Academic Report
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Create your account', desc: 'Register with your student details, university, and degree programme.', icon: Building2 },
              { num: '02', title: 'Choose university & report type', desc: 'Select from UDSM, UDOM, SUA, Mzumbe, ARU, and exact report requirements.', icon: BookOpen },
              { num: '03', title: 'Provide academic information', desc: 'Enter registration number, supervisor names, duration, and objective notes.', icon: FileText },
              { num: '04', title: 'Upload your evidence', desc: 'Attach photos, logbooks, site notes, and dataset files for evidence parsing.', icon: Upload },
              { num: '05', title: 'Generate and edit report', desc: 'Use AI generation assistance, customize chapters, and inspect quality score.', icon: Sliders },
              { num: '06', title: 'Pay and download', desc: 'Pay via Tanzanian mobile money (M-Pesa, Tigo) and export PDF & DOCX.', icon: Download },
            ].map((step) => (
              <div key={step.num} className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-teal-400">{step.num}</span>
                  <step.icon className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Comprehensive Coverage</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Supported Academic Report Types
            </h2>
          </div>
          <Link href="/report-types">
            <Button variant="ghost" className="text-blue-600" icon={<ArrowRight className="w-4 h-4" />}>
              View All Report Guidelines
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_REPORT_TYPES.slice(0, 4).map((rt) => (
            <Card key={rt.id} className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{rt.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-3">{rt.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Build Your University Academic Report?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Join thousands of Tanzanian university students preparing structured, verified, and high-scoring academic documents today.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 font-bold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Pricing Tiers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
