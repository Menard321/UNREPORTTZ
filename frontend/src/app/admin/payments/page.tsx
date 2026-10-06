'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { MOCK_PAYMENTS } from '@/lib/data/mock-data';
import { formatCurrencyTzs, formatDate } from '@/lib/utils';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-teal-400" /> Payment & Revenue Logs
        </h1>
        <p className="text-xs text-slate-400">Reconcile Tanzanian Mobile Money transaction logs.</p>
      </div>

      <Card className="overflow-hidden bg-slate-950 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="p-4">Tx ID</th>
                <th className="p-4">Student</th>
                <th className="p-4">Method</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_PAYMENTS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/60">
                  <td className="p-4 font-mono font-bold text-white">{tx.transactionId}</td>
                  <td className="p-4 text-slate-300">{tx.reportTitle}</td>
                  <td className="p-4 font-bold text-teal-400">{tx.paymentMethod}</td>
                  <td className="p-4 text-slate-400">{tx.phoneNumber}</td>
                  <td className="p-4 font-mono text-white">{formatCurrencyTzs(tx.amountTzs)}</td>
                  <td className="p-4">
                    <Badge variant="success">{tx.status}</Badge>
                  </td>
                  <td className="p-4 text-slate-400">{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
