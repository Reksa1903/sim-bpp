// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [admin, penyuluh, kelompokTani, kiosPertanian, kegiatan] = await Promise.all([
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
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
