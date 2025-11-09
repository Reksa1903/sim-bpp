// src/app/(dashboard)/list/desabinaan/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import NextDynamic from 'next/dynamic';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getRole } from '@/lib/utils';
import { Prisma } from '@prisma/client';

const DesaBinaanClient = NextDynamic(() => import('./_client'), { ssr: false });

export default async function Page({ searchParams }: { searchParams: { [k: string]: string | undefined } }) {
  const role = (await getRole().catch(() => 'guest')) ?? 'guest';
  const p = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search ?? '';

  const where: Prisma.DesaBinaanWhereInput = search
    ? { name: { contains: search, mode: 'insensitive' as const } }
    : {};

  const [rows, count] = await prisma.$transaction([
    prisma.desaBinaan.findMany({
      where,
      include: { penyuluh: true, kelompokTani: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { name: Prisma.SortOrder.asc },
    }),
    prisma.desaBinaan.count({ where }),
  ]);

  return <DesaBinaanClient rows={rows} role={role} page={p} count={count} search={search} />;
}
