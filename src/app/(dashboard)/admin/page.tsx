// src/app/(dashboard)/admin/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import NextDynamic from 'next/dynamic';
import EventCalendarContainer from '@/components/EventCalendarContainer';
import Announcements from '@/components/Announcements';

// kiri: komponen client
const AdminClient = NextDynamic(() => import('./_client'), { ssr: false });

export default function AdminPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* KIRI (client only) */}
      <AdminClient />

      {/* KANAN (server OK; boleh render client di dalamnya) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
}
