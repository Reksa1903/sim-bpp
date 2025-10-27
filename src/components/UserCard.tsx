// src/components/UserCard.tsx
import Image from 'next/image';

const UserCard = async ({
  type,
}: {
  type: 'Admin' | 'Kelompok_Tani' | 'Penyuluh_Pertanian' | 'Kios_Pertanian';
}) => {
  // Gunakan path relatif, bukan process.env
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
        ? 'https://' + process.env.NEXT_PUBLIC_API_URL
        : ''
    }/api/stats`,
    {
      cache: 'no-store',
      next: { revalidate: 0 },
    }
  );
  const stats = await res.json();

  const countMap: Record<typeof type, number> = {
    Admin: stats.admin,
    Penyuluh_Pertanian: stats.penyuluh,
    Kelompok_Tani: stats.kelompokTani,
    Kios_Pertanian: stats.kiosPertanian,
  };

  const data = countMap[type] || 0;

  return (
    <div className="rounded-2xl odd:bg-BppGreen even:bg-BppBlue p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2025/16
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;
