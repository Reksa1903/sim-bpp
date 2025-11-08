// src/app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId, sessionClaims } = await auth();

  // Belum login → ke halaman sign-in
  if (!userId) redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in');

  // Sudah login → arahkan sesuai role
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  switch (role) {
    case 'admin':
      redirect('/admin');
    case 'penyuluh':
      redirect('/penyuluh');
    case 'kelompoktani':
      redirect('/kelompoktani');
    default:
      redirect('/admin'); // fallback aman
  }
}
