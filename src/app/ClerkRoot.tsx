// src/app/ClerkRoot.tsx
'use client';

import { ClerkProvider } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';

// ⬇️ ToastContainer juga dibuat no-SSR agar aman
const ToastContainer = dynamic(
  () => import('react-toastify').then((m) => m.ToastContainer),
  { ssr: false }
);

export default function ClerkRoot({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in'}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up'}
      afterSignInUrl="/admin"
      afterSignUpUrl="/admin"
    >
      {children}
      <ToastContainer position="bottom-right" theme="dark" />
    </ClerkProvider>
  );
}
