'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';
import { formatCurrencyTzs } from '@/lib/utils';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'per_report' | 'unlimited'>('per_report');

  const tiers = [
    {
      id: 'free',
      name: 'Free Draft',
      priceTzs: 0,
      description: 'Perfect for planning your report structure and testing AI generation capability.',
      features: [
        'Account & Student Profile',
        'Basic Report Outline Planning',
        'Limited Section AI Generation',
        'Document Quality Inspection',
        'Watermarked Web Preview',
      ],
      ctaText: 'Start Free Draft',
      ctaVariant: 'outline' as const,
      isPopular: false,
    },
    {
      id: 'standard',
      name: 'Standard Export',
      priceTzs: 15000,
      description: 'Complete university report generation with editable DOCX & PDF exports.',
      features: [
        'Full 5-6 Chapter Report Generation',
        'University Specific Formatting (UDSM, UDOM, SUA, etc.)',
        'Evidence File & Photo Attachment Parsing',
        'Rich Text Document Editor Access',
        'IEEE, APA7 & Harvard Citation Generator',
        'High-Resolution PDF & Editable DOCX Download',
        'Tanzanian Mobile Money Payment (M-Pesa, Tigo, Airtel)',
      ],
      ctaText: 'Get Standard Access',
      ctaVariant: 'primary' as const,
      isPopular: true,
    },
    {
      id: 'premium',
      name: 'Premium AI & Research',
      priceTzs: 25000,
      description: 'Advanced postgraduate AI assistance, reference verification, and priority export.',
      features: [
        'Everything in Standard Export',
        'Unlimited AI Assistant Rewrites & Expansion',
        'Automated Reference DOI Verification (Crossref Index)',
        'Writing Tone Customization & Style Matching',
        'Priority AI Generation Pipeline',
        'Direct Supervisor Feedback Annotation Tools',
        '24/7 Dedicated Student Support Desk',
      ],
      ctaText: 'Unlock Premium',
      ctaVariant: 'accent' as const,
      isPopular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Transparent Tanzanian Pricing</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Simple, Student-Friendly Pricing
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Pay easily via Tanzanian Mobile Money (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa) or Local Bank Transfer.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center p-1 rounded-full bg-slate-200 dark:bg-slate-800">
          <button
            onClick={() => setBillingCycle('per_report')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              billingCycle === 'per_report' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pay Per Report
          </button>
          <button
            onClick={() => setBillingCycle('unlimited')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              billingCycle === 'unlimited' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Semester Bundle (-20%)
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => {
          const finalPrice = billingCycle === 'unlimited' && tier.priceTzs > 0 
            ? Math.round(tier.priceTzs * 0.8) 
            : tier.priceTzs;

          return (
            <Card
              key={tier.id}
              className={`p-8 flex flex-col justify-between relative transition-all duration-300 ${
                tier.isPopular ? 'border-2 border-blue-600 shadow-xl shadow-blue-500/10' : ''
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular for Students
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tier.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {finalPrice === 0 ? 'FREE' : formatCurrencyTzs(finalPrice)}
                  </span>
                  {finalPrice > 0 && <span className="text-xs text-slate-500 font-medium">/ report</span>}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Included Features</span>
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link href={`/dashboard/generate?tier=${tier.id}`}>
                  <Button variant={tier.ctaVariant} className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                    {tier.ctaText}
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-500" /> Have Questions About Payment Processing?
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Payment confirmation is instant. After completing your M-Pesa or Tigo Pesa prompt, the report download links unlock immediately.
        </p>
      </div>
    </div>
  );
}
