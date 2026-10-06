'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Download, 
  ArrowRight 
} from 'lucide-react';
import { paymentService } from '@/lib/api/payments';
import { reportService } from '@/lib/api/reports';
import { AcademicReport, PaymentMethod, PaymentTransaction } from '@/types';
import { formatCurrencyTzs } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function PaymentCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.reportId as string;

  const [report, setReport] = useState<AcademicReport | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('M-PESA');
  const [phoneNumber, setPhoneNumber] = useState('+255 754 123 456');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    async function loadReport() {
      const rep = await reportService.getReportById(reportId);
      if (rep) setReport(rep);
    }
    loadReport();
  }, [reportId]);

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate mobile money USSD prompt polling delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await paymentService.initiatePayment({
        reportId,
        paymentMethod: selectedMethod,
        phoneNumber,
        amountTzs: 15000,
      });

      setTransactionSuccess(res);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    } finally {
      setIsProcessing(false);
    }
  };

  const methods: { id: PaymentMethod; name: string; color: string }[] = [
    { id: 'M-PESA', name: 'Vodacom M-Pesa', color: 'text-red-600' },
    { id: 'TIGO-PESA', name: 'Tigo Pesa (Mix)', color: 'text-blue-600' },
    { id: 'AIRTEL-MONEY', name: 'Airtel Money', color: 'text-red-500' },
    { id: 'HALOPESA', name: 'HaloPesa', color: 'text-orange-500' },
    { id: 'CRDB-BANK', name: 'CRDB Bank SimBanking', color: 'text-emerald-700' },
    { id: 'NMB-BANK', name: 'NMB Mkononi', color: 'text-blue-800' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" /> Export Order Checkout
        </h1>
        <p className="text-xs text-slate-500">
          Unlock PDF & editable DOCX downloads formatted to your university requirements.
        </p>
      </div>

      {transactionSuccess ? (
        <Card className="p-8 text-center space-y-6 bg-white dark:bg-slate-900 border-2 border-emerald-500 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Payment Verified & Successful!</h2>
            <p className="text-xs text-slate-500">
              Transaction ID: <strong className="font-mono text-slate-800 dark:text-slate-200">{transactionSuccess.transactionId}</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Report Title:</span>
              <span className="font-bold">{report?.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-bold text-emerald-600">{formatCurrencyTzs(transactionSuccess.amountTzs)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Button
              variant="accent"
              size="lg"
              onClick={() => router.push(`/preview/${reportId}`)}
              icon={<Download className="w-5 h-5" />}
            >
              Download PDF & DOCX Export
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Order Summary */}
          <Card className="md:col-span-5 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Order Summary</h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Report Document:</span>
                <p className="font-bold text-slate-900 dark:text-white line-clamp-2">{report?.title || 'Academic Report'}</p>
              </div>

              <div>
                <span className="text-slate-400 block">University Standards:</span>
                <p className="font-semibold text-blue-600">{report?.universityName}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-base font-bold">
                <span>Total Due:</span>
                <span className="text-blue-600 font-mono">{formatCurrencyTzs(15000)}</span>
              </div>
            </div>
          </Card>

          {/* Payment Method Selector */}
          <Card className="md:col-span-7 p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Select Tanzanian Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {methods.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 text-xs font-bold ${
                    selectedMethod === m.id
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>{m.name}</span>
                </div>
              ))}
            </div>

            <Input
              label="Mobile Money Phone Number"
              placeholder="+255 754 123 456"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isProcessing}
              onClick={handleInitiatePayment}
              icon={<ShieldCheck className="w-5 h-5" />}
            >
              Pay {formatCurrencyTzs(15000)} via {selectedMethod}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
