// src/app/(auth)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, decodeToken } from '@/lib/auth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const decoded = decodeToken();
      if (decoded && typeof decoded !== "string" && decoded.status === "Active") {
        router.push("/funnels");
      }
    }
  }, [router]);

  return (
    <> {children}</>
  );
}
