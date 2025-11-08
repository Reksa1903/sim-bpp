// src/app/(dashboard)/kelompoktani/_client.tsx  ← CLIENT
'use client';

import { useEffect, useState } from 'react';
import Announcements from '@/components/Announcements';
import EventCalendar from '@/components/EventCalendar';
import BigCalendarContainer from '@/components/BigCalendarContainer';

export default function KelompoktaniClient() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/session')
      .then((res) => res.json())
      .then((data) => setRole(data?.role ?? null))
      .catch(() => setRole(null));
  }, []);

  if (role !== 'kelompoktani') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 font-semibold">
          Anda tidak memiliki akses ke halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="h-[1200px] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold mb-4">Jadwal Kegiatan</h1>
          <BigCalendarContainer />
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}
