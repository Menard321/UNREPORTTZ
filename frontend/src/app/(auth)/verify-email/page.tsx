'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LegacyVerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      router.replace(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      router.replace('/auth/verify-email');
    }
  }, [router, searchParams]);

  return null;
}

export default function LegacyVerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <LegacyVerifyEmailContent />
    </Suspense>
  );
}
