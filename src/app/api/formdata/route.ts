// src/app/api/formdata/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamicParams = true;
export const fetchCache = 'force-no-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    try { 
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');
  let relatedData: any = {};

    switch (table) {
      // === Penyuluh ===
      case 'penyuluh': {
        const desaBinaan = await prisma.desaBinaan.findMany({
          select: { id: true, name: true },
        });
        relatedData = { desaBinaan };
        break;
      }

      // === Kelompok Tani ===
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

      // === Desa Binaan ===
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

      // === Materi ===
      case 'materi': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      // === Pengumuman ===
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

      // === Kegiatan ===
      case 'kegiatan': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      // === Dokumentasi Acara ===
      case 'dokumentasiacara': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      // === Kios Pertanian ===
      case 'kisopertanian': {
        // Tidak ada relasi ke tabel lain
        relatedData = {};
        break;
      }

      default:
        break;
    }

    return NextResponse.json(relatedData, { status: 200 });
    } catch (err: any) {
        console.error('❌ Error in /api/formdata:', err.message, err.stack);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

