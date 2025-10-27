// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs"; // ✅ pastikan pakai Node runtime, bukan Edge

export async function GET() {
  try {
    // 🚧 Cegah Prisma dijalankan saat build di Vercel
    if (process.env.VERCEL === "1" && process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json({ message: "Skipping stats during build" });
    }

    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is missing");
      return NextResponse.json(
        { error: "Database URL not set" },
        { status: 500 }
      );
    }

    const [admin, penyuluh, kelompokTani, kiosPertanian, kegiatan] =
      await Promise.all([
        prisma.admin.count(),
        prisma.penyuluh.count(),
        prisma.kelompokTani.count(),
        prisma.kiosPertanian.count(),
        prisma.kegiatan.findMany({
          select: { startDate: true },
        }),
      ]);

    return NextResponse.json({
      admin,
      penyuluh,
      kelompokTani,
      kiosPertanian,
      kegiatan,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
