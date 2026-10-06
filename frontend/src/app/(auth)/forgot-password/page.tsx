'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/forgot-password');
  }, [router]);

  return null;
}
