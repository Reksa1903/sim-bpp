// src/app/api/formdata/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  // 🧱 Skip waktu build
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing!');
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    );
  }

  // ✅ Lazy import prisma
  const { default: prisma } = await import('@/lib/prisma');

  try {
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
          select: {
            id: true,
            name: true,
            penyuluh: {
              select: { id: true, name: true },
            },
          },
        });

        const penyuluh = await prisma.penyuluh.findMany({
          select: {
            id: true,
            name: true,
            desaBinaan: { select: { id: true } },
          },
        });

        relatedData = { desaBinaan, penyuluh };
        break;
      }

      case 'desabinaan': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });

        const kelompokTani = await prisma.kelompokTani.findMany({
          select: {
            id: true,
            name: true,
            desaBinaan: { select: { name: true } },
          },
        });

        const kelompokTaniOptions = kelompokTani.map((kt) => ({
          id: kt.id,
          label: `${kt.name} - ${kt.desaBinaan?.name ?? 'Tanpa Desa'}`,
        }));

        relatedData = { penyuluh, kelompokTani: kelompokTaniOptions };
        break;
      }

      case 'materi': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      case 'pengumuman': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });

        const kelompokTani = await prisma.kelompokTani.findMany({
          select: {
            id: true,
            name: true,
            desaBinaan: { select: { name: true } },
          },
        });

        const desaBinaan = await prisma.desaBinaan.findMany({
          select: { id: true, name: true },
        });

        const kelompokTaniOptions = kelompokTani.map((kt) => ({
          id: kt.id,
          label: `${kt.name} - ${kt.desaBinaan?.name ?? 'Tanpa Desa'}`,
        }));

        relatedData = {
          penyuluh,
          kelompokTani: kelompokTaniOptions,
          desaBinaan,
        };
        break;
      }

      case 'kegiatan': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      case 'dokumentasiacara': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      case 'kiospertanian': {
        relatedData = {};
        break;
      }

      default:
        break;
    }

    return NextResponse.json(relatedData, { status: 200 });
  } catch (err: any) {
    console.error('❌ Error in /api/formdata:', err.message);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
