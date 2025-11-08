// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { routeAccessMap } from './lib/settings';

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

const isAuthPath = (pathname: string) =>
  pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Root → biarkan ditangani oleh src/app/page.tsx
  // (tidak perlu redirect di middleware)

  // Belum login & bukan halaman auth → arahkan ke sign-in
  if (!userId && !isAuthPath(url.pathname)) {
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in', req.url)
    );
  }

  // Cek ACL berdasarkan routeAccessMap (hanya jika sudah login & punya role)
  if (userId && role) {
    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && !allowedRoles.includes(role)) {
        // unauthorized → arahkan ke dashboard sesuai role
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
