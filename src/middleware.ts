// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { routeAccessMap } from './lib/settings';

// 1) Daftar rute publik yang tidak boleh diblokir middleware
const isPublicRoute = createRouteMatcher([
  '/',                     // jika punya landing
  '/sign-in(.*)',          // Clerk UI
  '/api/webhooks(.*)',     // kalau punya webhook
  '/api/health(.*)',       // opsional
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
  '/workbox-(.*)\\.js',
  '/_next/(.*)',           // asset Next
  '/public/(.*)',          // kalau ada
]);

// 2) Halaman home/landing tiap role (untuk redirect aman)
const roleHome: Record<string, string> = {
  admin: '/admin',
  penyuluh: '/penyuluh',
  kelompoktani: '/kelompoktani',
};

// Utility: cocokkan path ke allowed roles dari routeAccessMap
const matchers = Object.entries(routeAccessMap).map(([pattern, allowedRoles]) => ({
  matcher: createRouteMatcher([pattern]),
  allowedRoles,
}));

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // 0) Lewatkan semua rute publik tanpa pemeriksaan
  if (isPublicRoute(req)) return NextResponse.next();

  // 1) Proteksi: user harus login
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) {
    // arahkan ke sign-in dan kembali lagi setelah sukses
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // 2) Ambil role dari metadata (jangan pakai non-null assertion)
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  // Jika role belum ada di metadata, arahkan ke halaman sign-in agar refresh session/role
  if (!role) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // 3) Validasi akses berbasis peta routeAccessMap
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      // Jika route ini punya batasan role dan role user tidak termasuk → arahkan ke home role-nya
      if (!allowedRoles.includes(role)) {
        const dest = roleHome[role] || '/';
        if (pathname !== dest) {
          return NextResponse.redirect(new URL(dest, req.url));
        }
        // kalau sudah di dest tapi tetap tidak boleh, biarkan lewat untuk menghindari loop
        break;
      }
    }
  }

  // 4) Default: izinkan request
  return NextResponse.next();
});

// 5) Jalankan middleware untuk semua rute kecuali file statik
export const config = {
  matcher: [
    // semua path kecuali file statik umum
    '/((?!_next|.*\\.(?:html?|css|js(?!on)|map|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
