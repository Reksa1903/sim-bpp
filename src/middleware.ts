// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth(); // <-- INI YANG BENAR!!

  if (!userId) return NextResponse.next();

  const role = (sessionClaims as any)?.metadata?.role || null;
  const pathname = req.nextUrl.pathname;

  // Redirect setelah login
  if (pathname === "/") {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "penyuluh") return NextResponse.redirect(new URL("/penyuluh", req.url));
    if (role === "kelompoktani") return NextResponse.redirect(new URL("/kelompoktani", req.url));
  }

  // Proteksi role
  if (pathname.startsWith("/admin") && role !== "admin")
    return NextResponse.redirect(new URL("/", req.url));

  if (pathname.startsWith("/penyuluh") && role !== "penyuluh")
    return NextResponse.redirect(new URL("/", req.url));

  if (pathname.startsWith("/kelompoktani") && role !== "kelompoktani")
    return NextResponse.redirect(new URL("/", req.url));

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|api|sign-in|sign-up).*)"],
};
