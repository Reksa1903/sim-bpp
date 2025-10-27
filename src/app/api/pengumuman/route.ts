// src/api/pengumumam/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await prisma.pengumuman.findMany({
      take: 3,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch pengumuman" }, { status: 500 });
  }
}
