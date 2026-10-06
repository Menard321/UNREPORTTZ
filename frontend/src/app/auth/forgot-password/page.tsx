'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/context/auth-context';
import { forgotPasswordSchema, ForgotPasswordSchemaType } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setErrorMessage('');
    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send reset link.');
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Reset your password
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Enter your registered email address and we'll send you a secure password reset link.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-xs font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {isSuccess ? (
        <div className="space-y-4 text-center py-2 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Check your email</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              If an account is associated with that email address, you'll receive password reset instructions shortly.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            {...register('email')}
            error={errors.email?.message}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      )}

      <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
        Remember your password?{' '}
        <Link href="/auth/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
          Log in
        </Link>
      </div>
    </Card>
  );
}
