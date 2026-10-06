'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LegacyLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
    } else {
      router.replace('/auth/login');
    }
  }, [router, searchParams]);

  return null;
}

export default function LegacyLoginPage() {
  return (
    <Suspense fallback={null}>
      <LegacyLoginContent />
    </Suspense>
  );
}
