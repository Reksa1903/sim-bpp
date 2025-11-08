// src/app/api/formdata/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');
  let relatedData: any = {};

  switch (table) {
    case 'penyuluh': {
      const desaBinaan = await prisma.desaBinaan.findMany({
        select: { id: true, name: true },
      });
      relatedData = { desaBinaan };
      break;
    }

    case 'kelompoktani': {
      const desaBinaan = await prisma.desaBinaan.findMany({
        select: { id: true, name: true },
      });
      const penyuluh = await prisma.penyuluh.findMany({
        select: { id: true, name: true },
      });
      relatedData = { desaBinaan, penyuluh };
      break;
    }

    // Tambahkan case lainnya sesuai struktur kamu...
  }

  return NextResponse.json(relatedData);
}
