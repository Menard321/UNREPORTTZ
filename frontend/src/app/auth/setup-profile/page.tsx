'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/context/auth-context';
import { setupProfileSchema, SetupProfileSchemaType } from '@/lib/validators/auth';
import { UniversityAcademicSelects } from '@/components/auth/university-academic-selects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, FileCode, Calendar } from 'lucide-react';
import { MOCK_UNIVERSITIES } from '@/lib/data/mock-data';

function SetupProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const { user, isAuthenticated, isLoading, setupProfile } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent('/auth/setup-profile')}`);
    }
  }, [isLoading, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SetupProfileSchemaType>({
    resolver: zodResolver(setupProfileSchema),
    defaultValues: {
      universityId: user?.universityId || MOCK_UNIVERSITIES[0].id,
      programmeName: user?.programmeName || 'B.Sc. Computer Science',
      yearOfStudy: user?.yearOfStudy || 'Year 1',
      regNumber: user?.regNumber || '',
      graduationYear: '',
    },
  });

  const onSubmit = async (data: SetupProfileSchemaType) => {
    setErrorMessage('');
    try {
      await setupProfile({
        universityId: data.universityId,
        collegeId: data.collegeId,
        departmentId: data.departmentId,
        programmeName: data.programmeName,
        yearOfStudy: data.yearOfStudy,
        regNumber: data.regNumber,
        graduationYear: data.graduationYear,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } catch (err: any) {
      const msg = err?.message || 'Failed to save profile. Please try again.';
      if (msg.includes('Unauthenticated') || err?.status === 401) {
        setErrorMessage('Your session has expired. Redirecting to log in...');
        setTimeout(() => {
          router.push(`/auth/login?redirect=${encodeURIComponent('/auth/setup-profile')}`);
        }, 1000);
      } else {
        setErrorMessage(msg);
      }
    }
  };

  if (isLoading) {
    return <Card className="p-8 text-center text-slate-500">Checking authentication session...</Card>;
  }

  return (
    <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="space-y-2">
        <Badge variant="primary">Step 3 of 3 • Academic Profile</Badge>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Set up your academic profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Tell us about your university and programme so UniReportTZ can personalize your reporting guidelines and AI workspace.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-xs font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {isSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile saved! Loading your personalized dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Dynamic Cascade Selects */}
        <UniversityAcademicSelects
          selectedUniversityId={watch('universityId')}
          onUniversityChange={(uniId) => setValue('universityId', uniId, { shouldValidate: true })}
          onCollegeChange={(colId) => setValue('collegeId', colId)}
          onDepartmentChange={(deptId) => setValue('departmentId', deptId)}
          onProgrammeChange={(prog) => setValue('programmeName', prog, { shouldValidate: true })}
          onYearChange={(yr) => setValue('yearOfStudy', yr, { shouldValidate: true })}
          initialValues={{
            universityId: watch('universityId'),
            programmeName: watch('programmeName'),
            yearOfStudy: watch('yearOfStudy'),
          }}
        />

        {errors.programmeName && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">
            {errors.programmeName.message}
          </p>
        )}

        {/* Additional Student Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Student Reg / Roll Number (Optional)"
            placeholder="e.g. 2021-04-08921"
            leftIcon={<FileCode className="w-4 h-4 text-slate-400" />}
            {...register('regNumber')}
            error={errors.regNumber?.message}
          />

          <Input
            label="Expected Graduation Year"
            placeholder="e.g. 2026"
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            {...register('graduationYear')}
            error={errors.graduationYear?.message}
          />
        </div>

        {/* Submission CTA */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? 'Saving profile...' : isSuccess ? 'Profile saved' : 'Continue to Personal Dashboard'}
        </Button>
      </form>
    </Card>
  );
}

export default function SetupProfilePage() {
  return (
    <Suspense fallback={<Card className="p-8 text-center text-slate-500">Loading profile setup...</Card>}>
      <SetupProfileContent />
    </Suspense>
  );
}
