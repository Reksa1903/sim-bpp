// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
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
