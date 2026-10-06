'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, MessageSquare, PhoneCall } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" /> Help & Student Support Desk
        </h1>
        <p className="text-xs text-slate-500">
          Find answers, read report guides, or contact technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6 space-y-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Formatting Tutorials</h3>
          <p className="text-xs text-slate-500">Learn how margins, Times New Roman, and IEEE citation rules are auto-enforced.</p>
          <Link href="/faq">
            <Button variant="outline" size="sm">Read FAQ</Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-3">
          <MessageSquare className="w-6 h-6 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">WhatsApp & Email Support</h3>
          <p className="text-xs text-slate-500">Get direct assistance with payment verification or template questions.</p>
          <Link href="/contact">
            <Button variant="primary" size="sm">Contact Support</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
