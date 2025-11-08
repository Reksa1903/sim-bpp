// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { routeAccessMap } from './lib/settings';

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

const isAuthPath = (p: string) => p.startsWith('/sign-in') || p.startsWith('/sign-up');

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);

  // 0) BYPASS untuk request RSC/Flight dan aset SW
  if (
    url.searchParams.has('_rsc') ||                      // App Router data
    url.pathname === '/sw.js' ||                        // service worker file
    /^\/workbox-.*\.js$/.test(url.pathname) ||          // workbox helper
    url.pathname.startsWith('/_next/') ||               // aset Next
    /\.[a-zA-Z0-9]+$/.test(url.pathname)                // semua file statik
  ) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // 1) Belum login → redirect ke sign-in (kecuali di halaman auth)
  if (!userId && !isAuthPath(url.pathname)) {
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in', req.url)
    );
  }

  // 2) Cek ACL berbasis peta route
  if (userId && role) {
    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }

  return NextResponse.next();
});

// Matcher sederhana ala Clerk: jangan intercept file statik & _next
export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/(api|trpc)(.*)',
  ],
};
