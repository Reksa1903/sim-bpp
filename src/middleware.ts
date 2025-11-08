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

  // BYPASS: RSC/Flight, SW assets, Next assets, static files, dan **jalur proxy Clerk**
  if (
    url.searchParams.has('_rsc') ||
    url.pathname === '/sw.js' ||
    /^\/workbox-.*\.js$/.test(url.pathname) ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/clerk/') || // <— penting: jangan intercept proxy Clerk
    /\.[a-zA-Z0-9]+$/.test(url.pathname)
  ) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  // Dev instance kadang taruh role di publicMetadata
  const role =
    (sessionClaims?.metadata as { role?: string })?.role ??
    (sessionClaims?.publicMetadata as { role?: string })?.role ?? null;

  // Belum login → arahkan ke sign-in (kecuali di halaman auth)
  if (!userId && !isAuthPath(url.pathname)) {
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in', req.url)
    );
  }

  // Cek ACL berbasis peta route
  if (userId && role) {
    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }

  return NextResponse.next();
});

// Matcher: selain static & _next, **opsional** sekalian exclude /clerk dari intercept
export const config = {
  matcher: [
    '/((?!.*\\..*|_next|clerk|sign-in|sign-up).*)',
    '/(api|trpc)(.*)',
  ],
};

