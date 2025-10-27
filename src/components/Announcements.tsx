import prisma from '@/lib/prisma';

const Announcements = async () => {
  const data = await prisma.pengumuman.findMany({
    take: 3, // Mengambil 3 pengumuman terbaru
    orderBy: {
      date: 'desc', // Urutkan berdasarkan tanggal secara menurun
    },
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pengumuman</h1>
        <span className="text-xs text-gray-400">Lihat Semua</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-BppLightGreen rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Date(data[0].date).toLocaleDateString('id-ID')}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
          </div>
        )}

        {data[1] && (
          <div className="bg-BppLightYellow rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Date(data[1].date).toLocaleDateString('id-ID')}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
          </div>
        )}

        {data[2] && (
          <div className="bg-BppLightBlue rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Date(data[2].date).toLocaleDateString('id-ID')}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
