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
  const h = req.headers;

  // ⬇️ Bypass RSC/Flight (pakai query ATAU header), aset Next, file statik, dan proxy Clerk
  const isRSC =
    url.searchParams.has('_rsc') ||
    h.has('rsc') ||
    h.has('next-router-state-tree') ||
    h.get('next-router-prefetch') === '1' ||
    h.get('purpose') === 'prefetch';

  const isAsset =
    url.pathname === '/sw.js' ||
    /^\/workbox-.*\.js$/.test(url.pathname) ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/clerk/') ||
    /\.[a-zA-Z0-9]+$/.test(url.pathname);

  if (isRSC || isAsset) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();
  const role =
    (sessionClaims?.metadata as { role?: string })?.role ??
    (sessionClaims?.publicMetadata as { role?: string })?.role ??
    null;

  // Belum login → redirect ke sign-in (kecuali halaman auth)
  if (!userId && !isAuthPath(url.pathname)) {
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in', req.url),
    );
  }

  // Cek ACL (hanya jika sudah login & punya role)
  if (userId && role) {
    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }

  return NextResponse.next();
});

// Jangan intercept static, _next, proxy clerk, dan auth routes
export const config = {
  matcher: [
    '/((?!.*\\..*|_next|clerk|sign-in|sign-up).*)',
    '/(api|trpc)(.*)',
  ],
};
