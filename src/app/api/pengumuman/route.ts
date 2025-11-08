// src/app/api/pengumuman/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Pastikan route ini tidak di-prerender
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs"; // tambahkan ini!

export async function GET() {
  try {
    // 🧱 Tambahkan pengaman agar Prisma tidak jalan waktu build
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json({ message: "Skipping API during build" });
    }

    // 🔐 Cek database URL dulu
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is missing during build");
      return NextResponse.json(
        { error: "Database URL not found" },
        { status: 500 }
      );
    }

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
