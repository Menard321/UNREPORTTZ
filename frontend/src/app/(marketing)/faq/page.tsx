'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Accordion } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const allFaqs = [
    {
      id: 'faq-1',
      title: 'What is UniReportTZ?',
      content: 'UniReportTZ is a Tanzania-focused AI academic reporting workspace designed specifically for university students. It helps you generate, structure, edit, verify, format, preview, and export academic reports according to your specific university, college, department, and programme guidelines.'
    },
    {
      id: 'faq-2',
      title: 'Which Tanzanian universities are supported?',
      content: 'UniReportTZ supports guidelines for top institutions including University of Dar es Salaam (UDSM), University of Dodoma (UDOM), Sokoine University of Agriculture (SUA), Mzumbe University, Ardhi University (ARU), MUHAS, NM-AIST, Open University of Tanzania (OUT), CBE, IFM, and more.'
    },
    {
      id: 'faq-3',
      title: 'What types of reports can I create?',
      content: 'You can create Field Practical Training (FPT) Reports, Industrial Attachment Reports, Final Year Projects (FYP), Academic Research Papers, Master’s Dissertations, Lab Practical Reports, and Seminar Documentation.'
    },
    {
      id: 'faq-4',
      title: 'Can I upload photos and logbook evidence?',
      content: 'Yes! Our evidence uploader allows you to attach photos, stamped logbook pages, site inspection images, and PDFs. UniReportTZ automatically organizes them into labeled figures with university-compliant captions.'
    },
    {
      id: 'faq-5',
      title: 'How does reference verification work?',
      content: 'Our built-in reference inspector checks DOIs, journal indexes, and academic database sources to assign verification badges (Verified, Needs Review, Could Not Verify) ensuring your bibliography is academically trustworthy.'
    },
    {
      id: 'faq-6',
      title: 'How do payments work in Tanzania?',
      content: 'You can pay instantly using local mobile money providers (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa) or Tanzanian bank transfers. Once payment status is verified by the server, PDF and editable DOCX exports unlock immediately.'
    },
    {
      id: 'faq-7',
      title: 'Can I edit the report before downloading?',
      content: 'Absolutely! You have complete control inside our interactive rich document editor. You can refine text, rewrite chapters using the AI assistant, adjust headings, and format tables before final export.'
    },
    {
      id: 'faq-8',
      title: 'Is my data private and secure?',
      content: 'Yes. Student files and draft reports are stored securely with encrypted access. Your documents are never publicly indexed or shared with third parties.'
    }
  ];

  const filteredFaqs = allFaqs.filter(
    (f) => f.title.toLowerCase().includes(searchTerm.toLowerCase()) || f.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <Badge variant="primary">Help Center</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Find answers to common questions about UniReportTZ features, formatting, evidence uploads, and payments.
        </p>

        <div className="max-w-md mx-auto pt-2">
          <Input
            placeholder="Search FAQ questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      <Accordion items={filteredFaqs} />
    </div>
  );
}
