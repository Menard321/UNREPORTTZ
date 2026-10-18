'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Building2, 
  Download, 
  Search,
  BookOpen,
  Users,
  FileCheck,
  Cpu,
  Brain,
  BookmarkCheck,
  FolderOpen,
  LayoutDashboard,
  FileText,
  Bookmark,
  FileUp,
  Bot,
  Settings,
  Plus,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import catalogData from '@/data/catalog.json';

// Curated official university crest styling and colors for all 20 Tanzanian institutions
const UNIVERSITY_CRESTS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  UDSM: { bg: 'bg-blue-900', text: 'text-amber-300', border: 'border-blue-700', accent: '#1e3a8a' },
  UDOM: { bg: 'bg-red-900', text: 'text-white', border: 'border-red-700', accent: '#881337' },
  SUA: { bg: 'bg-emerald-800', text: 'text-amber-300', border: 'border-emerald-600', accent: '#065f46' },
  ARU: { bg: 'bg-indigo-900', text: 'text-amber-200', border: 'border-indigo-700', accent: '#312e81' },
  DIT: { bg: 'bg-teal-900', text: 'text-teal-200', border: 'border-teal-700', accent: '#134e4a' },
  CBE: { bg: 'bg-slate-900', text: 'text-amber-400', border: 'border-slate-700', accent: '#0f172a' },
  IFM: { bg: 'bg-blue-950', text: 'text-sky-300', border: 'border-sky-800', accent: '#0c4a6e' },
  NIT: { bg: 'bg-amber-700', text: 'text-white', border: 'border-amber-600', accent: '#b45309' },
  MU: { bg: 'bg-rose-900', text: 'text-amber-300', border: 'border-rose-700', accent: '#881337' },
  MUST: { bg: 'bg-cyan-900', text: 'text-cyan-200', border: 'border-cyan-700', accent: '#164e63' },
  OUT: { bg: 'bg-blue-800', text: 'text-white', border: 'border-blue-600', accent: '#1e40af' },
  SAUT: { bg: 'bg-red-950', text: 'text-amber-300', border: 'border-red-800', accent: '#450a0a' },
  HKMU: { bg: 'bg-purple-900', text: 'text-amber-200', border: 'border-purple-700', accent: '#581c87' },
  KCMUCo: { bg: 'bg-sky-900', text: 'text-white', border: 'border-sky-700', accent: '#075985' },
  UAUT: { bg: 'bg-violet-900', text: 'text-amber-300', border: 'border-violet-700', accent: '#4c1d95' },
  TUMAINI: { bg: 'bg-blue-900', text: 'text-yellow-300', border: 'border-blue-700', accent: '#1e3a8a' },
  SUZA: { bg: 'bg-green-800', text: 'text-emerald-200', border: 'border-green-600', accent: '#166534' },
  SJUIT: { bg: 'bg-indigo-950', text: 'text-amber-300', border: 'border-indigo-800', accent: '#1e1b4b' },
  TIA: { bg: 'bg-teal-950', text: 'text-amber-300', border: 'border-teal-800', accent: '#042f2e' },
  IAA: { bg: 'bg-slate-800', text: 'text-amber-400', border: 'border-slate-600', accent: '#1e293b' },
};

function OfficialUniversityCrest({ shortName, logoUrl }: { shortName: string; logoUrl?: string }) {
  const crest = UNIVERSITY_CRESTS[shortName] || { bg: 'bg-blue-900', text: 'text-white', border: 'border-blue-700', accent: '#1e3a8a' };
  const imagePath = logoUrl || `/logos/${shortName.toLowerCase()}.svg`;

  return (
    <div className={`w-14 h-14 rounded-full bg-white dark:bg-slate-950 p-1 border-2 ${crest.border} shadow-md flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform shrink-0`}>
      <img 
        src={imagePath} 
        alt={`${shortName} logo`}
        className="w-full h-full object-contain rounded-full"
        onError={(e) => {
          // Fallback if image load has issue
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const institutions = catalogData.institutions;
  // Double list to make infinite marquee seamless
  const marqueeList = [...institutions, ...institutions];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 md:pt-16 pb-16 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-xs font-semibold tracking-wide">
                <span className="text-base">🇹🇿</span>
                <span>Designed for Tanzanian Universities</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                Academic Reports, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">
                  Built Around Your University.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Create professional academic reports faster with AI, university-specific templates, verified references & evidence management.
              </p>

              {/* Checkmark Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <div className="flex items-center justify-center lg:justify-start gap-2 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>UNIVERSITY-SPECIFIC TEMPLATES</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>AI-ASSISTED WRITING</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>VERIFIED REFERENCES & EVIDENCE</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href={isAuthenticated ? '/dashboard/generate' : '/auth/register'}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-lg shadow-blue-500/25">
                    Create My Report <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="font-semibold border-slate-300">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Editor Visual Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-white">
                
                {/* Editor Header Bar */}
                <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="font-bold text-slate-200">Field Practical Training Report</span>
                    <Badge variant="primary" className="bg-blue-600 text-[10px]">UDSM</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Report Progress:</span>
                    <span className="font-bold text-emerald-400">62%</span>
                  </div>
                </div>

                {/* Editor Body Grid */}
                <div className="grid grid-cols-12 min-h-[360px] text-xs">
                  
                  {/* Left Chapter Tree Sidebar */}
                  <div className="col-span-4 bg-slate-950 p-3 border-r border-slate-800 space-y-3 font-mono">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Chapters</div>
                    <div className="space-y-1.5 text-slate-300 text-[11px]">
                      <div className="p-1 rounded text-slate-400">1. Introduction</div>
                      <div className="p-1 rounded text-slate-400">2. Literature Review</div>
                      <div className="p-1.5 rounded bg-blue-900/40 text-blue-300 font-bold border-l-2 border-blue-500">
                        3. Technical Execution
                        <div className="pl-2 pt-1 text-[10px] space-y-1 text-blue-200/80 font-normal">
                          <div className="text-white font-semibold">3.1 Network Infrastructure</div>
                          <div>3.2 System Configuration</div>
                          <div>3.3 Security Implementation</div>
                        </div>
                      </div>
                      <div className="p-1 rounded text-slate-400">4. Findings and Discussion</div>
                      <div className="p-1 rounded text-slate-400">5. Conclusion</div>
                      <div className="p-1 rounded text-slate-400">6. References</div>
                    </div>
                  </div>

                  {/* Right Active Section Editor */}
                  <div className="col-span-8 p-4 space-y-3 flex flex-col justify-between bg-slate-900">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                        <span>3.1 Network Infrastructure</span>
                        <span className="text-emerald-400 font-mono">Saved • 1,240 words</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300 font-mono">
                        "The network infrastructure at the university is designed to support 10,000+ end users with continuous uptime requirements. The implementation includes redundant backbone switches..."
                      </p>
                    </div>

                    {/* AI Prompt Suggestions Box */}
                    <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800 space-y-2">
                      <div className="flex items-center gap-2 text-blue-300 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>AI Writing Assistant</span>
                      </div>
                      <p className="text-[10px] text-blue-200/90 leading-tight">
                        Your evidence shows 10km link attenuation between main server room and campus nodes. Would you like to expand this section?
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <Badge variant="outline" className="border-blue-700 text-blue-300 text-[9px]">Generate</Badge>
                        <span className="text-[9px] text-slate-400">Press Cmd+K for options</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">IEEE Format Applied</span>
                        <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">Evidence Attached</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-bold">Review Report</button>
                        <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">Export PDF</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. BUILT FOR TANZANIAN UNIVERSITIES (INFINITE MOTION CAROUSEL CONTAINING ALL 20 UNIVERSITIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/70 dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          
          {/* Left Title & Subtext */}
          <div className="lg:col-span-4 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-wider">
              <span>Verified Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Built for Tanzanian Universities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              UniReportTZ adapts academic reporting requirements to your institution, programme and report type.
            </p>
          </div>

          {/* Right Continuous Infinite Motion Carousel (All 20 Institutions) */}
          <div className="lg:col-span-8 overflow-hidden rounded-2xl relative py-2">
            
            {/* Fade edges overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50/90 dark:from-slate-900/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50/90 dark:from-slate-900/90 to-transparent z-10 pointer-events-none" />

            {/* Marquee Track */}
            <div className="animate-marquee flex items-center gap-4">
              {marqueeList.map((inst, index) => (
                <div 
                  key={`${inst.id}-${index}`}
                  className="w-40 h-44 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/60 transition-all flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer shrink-0"
                >
                  {/* Official University Crest */}
                  <OfficialUniversityCrest shortName={inst.shortName} logoUrl={(inst as any).logoUrl} />
                  
                  {/* ShortName & Full Name */}
                  <div className="space-y-0.5 w-full">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {inst.shortName}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight px-1">
                      {inst.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. YOUR COMPLETE ACADEMIC REPORTING WORKSPACE (EXACT IMAGE 2 MOCKUP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Your Complete Academic Reporting Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Manage your <strong>reports, research</strong>, evidence and references — all in one place. Stay organized, work smarter and meet your university's requirements <strong>with ease</strong>.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Dashboard & progress tracking',
                'AI assistant & smart suggestions',
                'Evidence & reference management',
                'Collaboration & review',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-5 shadow-lg shadow-blue-500/25">
                  Explore the Workspace <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Complete Workspace UI Mockup */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col md:flex-row text-slate-900 dark:text-white">
              
              {/* Left Dark Sidebar */}
              <div className="w-full md:w-52 bg-slate-900 text-slate-300 p-4 space-y-6 shrink-0 border-r border-slate-800">
                <div className="flex items-center gap-2 font-black text-base text-white">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span>UniReport<span className="text-blue-400">TZ</span></span>
                </div>

                <nav className="space-y-1 text-xs font-semibold">
                  <div className="px-3 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2.5 font-bold shadow-sm">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>My Reports</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4" />
                    <span>Templates</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4" />
                    <span>References</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 flex items-center gap-2.5">
                    <FileUp className="w-4 h-4" />
                    <span>Evidence</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 flex items-center gap-2.5">
                    <Bot className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Collaboration</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 flex items-center gap-2.5">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </div>
                </nav>
              </div>

              {/* Main Body Area */}
              <div className="flex-1 bg-slate-50/80 dark:bg-slate-950 p-5 space-y-5">
                
                {/* Top Header Bar */}
                <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold">Channels</span>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search reports..." 
                        className="pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-44"
                        readOnly 
                      />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      J
                    </div>
                  </div>
                </div>

                {/* Greeting */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Good evening, Joseph 👋</h3>
                  <p className="text-xs text-slate-500">Here's your progress and recent reports.</p>
                </div>

                {/* Your Reports Row */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">Your Reports</span>
                    <span className="text-blue-600 font-bold text-[11px] cursor-pointer">View all →</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Card 1 */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px] flex items-center justify-center">U</div>
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Field Training Report</h4>
                          <span className="text-[9px] text-slate-400">UDSM</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-end text-[9px] font-bold text-blue-600">82% Complete</div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[82%]" />
                        </div>
                      </div>
                      <button className="w-full py-1.5 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs">
                        Continue →
                      </button>
                    </div>

                    {/* Card 2 */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 font-bold text-[10px] flex items-center justify-center">CS</div>
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Research Report</h4>
                          <span className="text-[9px] text-slate-400">Computer Science</span>
                        </div>
                      </div>
                      <div className="py-1">
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[9px] font-bold">Draft</span>
                      </div>
                      <button className="w-full py-1.5 text-[10px] font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50">
                        Open Workspace →
                      </button>
                    </div>

                    {/* Card 3 */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-[10px] flex items-center justify-center">UD</div>
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Project Proposal</h4>
                          <span className="text-[9px] text-slate-400">UDOM</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-end text-[9px] font-bold text-blue-600">45% Complete</div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[45%]" />
                        </div>
                      </div>
                      <button className="w-full py-1.5 text-[10px] font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50">
                        Continue →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Row Grid (Recent Activity + Quick Actions) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
                  
                  {/* Recent Activity (8 cols) */}
                  <div className="md:col-span-8 space-y-2">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Recent Activity</span>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">B</div>
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Chapter 3 updated - Field Training Report</span>
                        </div>
                        <span className="text-[9px] text-slate-400">2 hours ago</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">R</div>
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Reference verified - 12 new references</span>
                        </div>
                        <span className="text-[9px] text-slate-400">5 hours ago</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">E</div>
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Evidence uploaded - Site photos.pdf</span>
                        </div>
                        <span className="text-[9px] text-slate-400">7 hours ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Panel (4 cols) */}
                  <div className="md:col-span-4 space-y-3">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Quick Actions</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 font-semibold text-blue-600 cursor-pointer hover:bg-slate-50">
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Report</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                        <FileUp className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload Evidence</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                        <Search className="w-3.5 h-3.5 text-blue-600" />
                        <span>Search References</span>
                      </div>
                    </div>

                    {/* Need Help Box */}
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 dark:text-blue-300">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                        <span>Need help?</span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-tight">Check our guide or contact support.</p>
                      <div className="text-[9px] font-bold text-blue-600 pt-0.5 cursor-pointer">View Help Center →</div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. SIMPLE 6-STEP PROCESS */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              From Research to Final Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Follow a simple 6-step process to turn your notes, research and evidence into a professional academic report.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {[
              { num: '01', title: 'Choose your university', desc: 'Select your institution, programme and report type.' },
              { num: '02', title: 'Build your report', desc: 'Use a university-specific structure and templates.' },
              { num: '03', title: 'Add evidence', desc: 'Upload notes, PDFs, images, datasets and references.' },
              { num: '04', title: 'AI-assisted writing', desc: 'Draft & embellish report sections with AI.' },
              { num: '05', title: 'Verify', desc: 'Check references, citations, structure and consistency.' },
              { num: '06', title: 'Export', desc: 'Download as professionally formatted PDF/DOCX.' },
            ].map((step) => (
              <div key={step.num} className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 text-center flex flex-col justify-between">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto shadow-md">
                  {step.num}
                </div>
                <h3 className="text-xs font-bold text-white">{step.title}</h3>
                <p className="text-[10px] text-slate-300 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. "EVERYTHING YOU NEED" FEATURE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Build a Better Academic Report
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Building2, title: 'University Templates', desc: 'Follow institution-specific requirements.' },
            { icon: Brain, title: 'AI Writing Assistant', desc: 'Draft, structure and improve sections.' },
            { icon: BookmarkCheck, title: 'Reference Verification', desc: 'Validate citations and sources.' },
            { icon: FolderOpen, title: 'Evidence Management', desc: 'Attach evidence to support report claims.' },
            { icon: Cpu, title: 'Data & Research Tools', desc: 'Structure research and findings.' },
            { icon: Users, title: 'Collaboration', desc: 'Work with supervisory team members.' },
            { icon: FileCheck, title: 'Report Review', desc: 'Detect missing or incomplete content.' },
            { icon: Download, title: 'Export Engine 2.0', desc: 'Produce submission-ready documents.' },
          ].map((item, idx) => (
            <Card key={idx} className="p-5 space-y-3 hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. PRICING PLANS */}
      <section className="bg-slate-50 dark:bg-slate-900/60 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Pricing</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Simple plans for every student
            </h2>
            <p className="text-xs text-slate-500">Choose option that fits your academic journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="p-6 space-y-6 flex flex-col justify-between border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Free</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">TZS 0</span>
                    <span className="text-xs text-slate-500">/3 months</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic report creation</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard templates</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Read-only access</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">Get Started</Button>
            </Card>

            {/* Student Popular */}
            <Card className="p-6 space-y-6 flex flex-col justify-between border-2 border-blue-600 shadow-xl relative bg-white dark:bg-slate-900">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="space-y-4 pt-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Student</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">TZS 20,000</span>
                    <span className="text-xs text-slate-500">/3 months</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Full AI generation</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> University verified templates</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Reference verification</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> PDF/DOCX export</div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">Choose Student</Button>
            </Card>

            {/* Pro */}
            <Card className="p-6 space-y-6 flex flex-col justify-between border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Pro</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">TZS 45,000</span>
                    <span className="text-xs text-slate-500">/3 months</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Advanced research tools</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Priority AI usage</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Evidence management</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Advanced verification</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">Choose Pro</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 md:p-14 rounded-3xl bg-blue-600 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Build Your Next Academic Report?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Join thousands of Tanzanian students, researchers and professionals using UniReportTZ.
          </p>
          <div className="pt-2">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 font-bold px-8 shadow-xl">
                Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
