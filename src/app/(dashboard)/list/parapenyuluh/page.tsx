// src/app/(dashboard)/list/parapenyuluh/page.tsx
"use client";

import prisma from "@/lib/prisma";
import { getRole } from "@/lib/utils";
import { Prisma, DesaBinaan, Penyuluh } from "@prisma/client";
import ParaPenyuluhClient from "./_client";

export type PenyuluhWithDesa = Penyuluh & {
  desaBinaan: DesaBinaan[];
};

const ParaPenyuluhListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const role = (await getRole()) || 'guest';
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.PenyuluhWhereInput = {};

  if (queryParams.search) {
    query.name = { contains: queryParams.search, mode: 'insensitive' };
  }

  const [data, count] = await prisma.$transaction([
    prisma.penyuluh.findMany({
      where: query,
      include: { desaBinaan: true },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.penyuluh.count({ where: query }),
  ]);

  return <ParaPenyuluhClient data={data} count={count} role={role} />;
};

export default ParaPenyuluhListPage;
