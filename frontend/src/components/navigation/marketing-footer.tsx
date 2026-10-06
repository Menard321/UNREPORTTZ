'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Mail, MapPin } from 'lucide-react';

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-black text-xl text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span>UniReport<span className="text-blue-400">TZ</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tanzania’s premier AI academic reporting platform. Built around university guidelines, verified citation structures, and field training requirements.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Dar es Salaam, Tanzania</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Supported Reports</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/report-types" className="hover:text-white transition-colors">Field Practical Training Report</Link></li>
              <li><Link href="/report-types" className="hover:text-white transition-colors">Industrial Attachment Report</Link></li>
              <li><Link href="/report-types" className="hover:text-white transition-colors">Final Year Project (FYP)</Link></li>
              <li><Link href="/report-types" className="hover:text-white transition-colors">Academic Research Report</Link></li>
              <li><Link href="/report-types" className="hover:text-white transition-colors">Postgraduate Dissertation</Link></li>
            </ul>
          </div>

          {/* Universities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Top Universities</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/universities" className="hover:text-white transition-colors">University of Dar es Salaam (UDSM)</Link></li>
              <li><Link href="/universities" className="hover:text-white transition-colors">University of Dodoma (UDOM)</Link></li>
              <li><Link href="/universities" className="hover:text-white transition-colors">Sokoine University of Agriculture (SUA)</Link></li>
              <li><Link href="/universities" className="hover:text-white transition-colors">Mzumbe University</Link></li>
              <li><Link href="/universities" className="hover:text-white transition-colors">Ardhi University (ARU)</Link></li>
            </ul>
          </div>

          {/* Platform & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform & Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing & Export Tiers</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About UniReportTZ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Student Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} UniReportTZ. Built for Tanzanian University Excellence.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Standardized Formatting Guarantee
            </span>
            <Link href="/faq" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/faq" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
