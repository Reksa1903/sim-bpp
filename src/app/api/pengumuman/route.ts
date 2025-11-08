// src/app/api/pengumuman/route.ts
import { NextResponse } from "next/server";

// 🚫 Nonaktifkan Prisma di fase build
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  // 🧱 Skip waktu build (Vercel)
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing!");
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  // ✅ Lazy import prisma (hindari dieksekusi saat build)
  const { default: prisma } = await import("@/lib/prisma");

  try {
    const data = await prisma.pengumuman.findMany({
      take: 3,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("API ERROR /pengumuman:", error);
    return NextResponse.json(
      { error: "Failed to fetch pengumuman" },
      { status: 500 }
    );
  }
}
