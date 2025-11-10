// src/app/api/stats/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json({ message: "Skipping API during build" });
    }

    const { default: prisma } = await import("@/lib/prisma");

    // ==== batas minggu ini (Sen 00:00 s/d Min 23:59:59) ====
    const now = new Date();                // timezone server (Vercel = UTC)
    const dow = now.getDay();              // 0=Min ... 6=Sab
    const offsetToMonday = (dow + 6) % 7;  // Sen=0
    const monday = new Date(now);
    monday.setDate(now.getDate() - offsetToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    // ================================================

    const [admin, penyuluh, kelompokTani, kiosPertanian, kegiatan] =
      await Promise.all([
        prisma.admin.count(),
        prisma.penyuluh.count(),
        prisma.kelompokTani.count(),
        prisma.kiosPertanian.count(),
        prisma.kegiatan.findMany({
          where: { startDate: { gte: monday, lte: sunday } }, // ⬅️ filter minggu ini
          select: { id: true, startDate: true },
        }),
      ]);

    return NextResponse.json({
      admin,
      penyuluh,
      kelompokTani,
      kiosPertanian,
      kegiatan, // sudah hanya minggu ini
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
