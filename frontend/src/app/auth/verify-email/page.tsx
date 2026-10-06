'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle2, RefreshCw, ArrowRight, Edit3 } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const { user, verifyEmail, resendVerification } = useAuth();

  const userEmail = emailParam || user?.email || '';

  const [cooldown, setCooldown] = useState(42);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setResendSuccess(false);
    try {
      await resendVerification(userEmail);
      setResendSuccess(true);
      setCooldown(60);
    } finally {
      setIsResending(false);
    }
  };

  const handleContinue = async () => {
    setIsVerifying(true);
    try {
      await verifyEmail();
      router.push('/auth/setup-profile');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6 text-center shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Top Verification Icon */}
      <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-md">
        <Mail className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <Badge variant="teal">Step 2 of 3 • Email Confirmation</Badge>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verify your email</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          We've sent a secure verification link to:
        </p>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
          <span>{userEmail}</span>
          <Link href="/auth/register" className="hover:text-blue-600 ml-1 text-slate-400" title="Change email address">
            <Edit3 className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
          Please verify your email address to activate your account and continue to your UniReportTZ academic setup.
        </p>
      </div>

      {resendSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>A fresh verification link has been sent to your email.</span>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isVerifying}
          onClick={handleContinue}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {isVerifying ? 'Verifying Account...' : 'Continue to Academic Profile'}
        </Button>

        <Button
          variant="outline"
          className="w-full text-xs"
          disabled={cooldown > 0 || isResending}
          onClick={handleResend}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />}
        >
          {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email'}
        </Button>
      </div>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span>Already verified?</span>
        <button
          type="button"
          onClick={handleContinue}
          className="font-bold text-blue-600 hover:underline cursor-pointer"
        >
          Continue to Setup →
        </button>
      </div>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Card className="p-8 text-center text-slate-500">Loading verification details...</Card>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
