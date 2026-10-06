'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, ExternalLink } from 'lucide-react';
import { MOCK_PAYMENTS } from '@/lib/data/mock-data';
import { formatDate, formatCurrencyTzs } from '@/lib/utils';

export default function PaymentsHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" /> Payment Transactions & Invoices
        </h1>
        <p className="text-xs text-slate-500">
          History of Tanzanian Mobile Money payments, invoices, and unlocked export downloads.
        </p>
      </div>

      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Report</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount (TZS)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {MOCK_PAYMENTS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-slate-100">{tx.transactionId}</td>
                  <td className="p-4 font-semibold max-w-xs truncate">{tx.reportTitle}</td>
                  <td className="p-4 font-bold text-blue-600">{tx.paymentMethod}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{formatCurrencyTzs(tx.amountTzs)}</td>
                  <td className="p-4">
                    <Badge variant={tx.status === 'Successful' ? 'success' : tx.status === 'Pending' ? 'warning' : 'error'}>
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-400">{formatDate(tx.createdAt)}</td>
                  <td className="p-4 text-right">
                    {tx.status === 'Successful' ? (
                      <Link href={`/preview/${tx.reportId}`}>
                        <Button size="sm" variant="accent" icon={<Download className="w-3.5 h-3.5" />}>
                          Download
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/dashboard/payments/${tx.reportId}`}>
                        <Button size="sm" variant="primary" icon={<CreditCard className="w-3.5 h-3.5" />}>
                          Pay Now
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
