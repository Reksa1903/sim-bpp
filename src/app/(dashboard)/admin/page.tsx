// src/app/(dashboard)/admin/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import NextDynamic from 'next/dynamic';

const AdminClient = NextDynamic(() => import('./_client'), { ssr: false });

export default function AdminPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  return <AdminClient searchParams={searchParams} />;
}
