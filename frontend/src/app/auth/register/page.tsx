'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/context/auth-context';
import { registerSchema, RegisterSchemaType } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterSchemaType) => {
    setErrorMessage('');
    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        password: data.password,
        agreeToTerms: data.agreeToTerms,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
      }, 800);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Create your UniReportTZ account
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Build professional academic reports with university-aware AI, verified references, and powerful editing tools.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-700 dark:text-red-300 animate-in fade-in duration-200">
          {errorMessage}
        </div>
      )}

      {submitSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Account created successfully! Redirecting to email verification...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          leftIcon={<User className="w-4 h-4 text-slate-400" />}
          {...register('name')}
          error={errors.name?.message}
        />

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
            placeholder="Create a strong password"
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
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        {/* Terms and Privacy Checkbox */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/20"
              {...register('agreeToTerms')}
            />
            <span>
              I agree to the{' '}
              <Link href="/about" className="font-semibold text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/contact" className="font-semibold text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 pl-6">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? 'Creating account...' : submitSuccess ? 'Account created' : 'Create Account'}
        </Button>
      </form>

      {/* Login Navigation Link */}
      <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
          Log in
        </Link>
      </div>
    </Card>
  );
}
