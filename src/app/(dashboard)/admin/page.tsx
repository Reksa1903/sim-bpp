// src/app/(dashboard)/admin/page.tsx
console.log('🔍 BUILD-TIME ENV CHECK:', {
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  CLERK_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
});

import ActivityChartContainer from '@/components/ActivityChartContainer';
import Announcements from '@/components/Announcements';
import CountChartContainer from '@/components/CountChartContainer';
import EventCalendar from '@/components/EventCalendar';
import EventCalendarContainer from '@/components/EventCalendarContainer';
import PanenChart from '@/components/PanenChart';
import UserCard from '@/components/UserCard';

const AdminPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USE CARDS  */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Admin" />
          <UserCard type="Kelompok_Tani" />
          <UserCard type="Penyuluh_Pertanian" />
          <UserCard type="Kios_Pertanian" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ACTIVITY CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <ActivityChartContainer />
          </div>
        </div>
        {/* BOTTOM CHARTS */}
        <div className="w-full h-[500px]">
          <PanenChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
