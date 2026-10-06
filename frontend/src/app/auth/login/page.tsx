'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/context/auth-context';
import { loginSchema, LoginSchemaType } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setErrorMessage('');
    try {
      const loggedUser = await login(data);
      setIsSuccess(true);
      setTimeout(() => {
        if (loggedUser?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push(redirectUrl);
        }
      }, 600);
    } catch (err: any) {
      setErrorMessage(err?.message || 'The email or password you entered is incorrect.');
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Sign in to continue working on your academic reports.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-xs font-semibold text-red-700 dark:text-red-300 animate-in fade-in duration-200">
          {errorMessage}
        </div>
      )}

      {isSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Signing in... Loading your personal dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          {...register('email')}
          error={errors.email?.message}
        />

        {/* Password */}
        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/20"
                {...register('remember')}
              />
              <span>Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Submit CTA */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? 'Signing in...' : isSuccess ? 'Sign in successful' : 'Log In'}
        </Button>
      </form>

      {/* Create Account Link */}
      <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
        Don't have a student account?{' '}
        <Link href="/auth/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
          Create Account
        </Link>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Card className="p-8 text-center text-slate-500">Loading sign in...</Card>}>
      <LoginFormContent />
    </Suspense>
  );
}
