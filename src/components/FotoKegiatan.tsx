// src/components/FotoKegiatan.tsx
import Image from 'next/image';

type FotoKegiatanProps = {
  photo: string;
  title: string;
  description: string;
  // Membuat onDelete opsional
  onDelete?: () => void;
};

const FotoKegiatan = ({
  photo,
  title,
  description,
  onDelete,
}: FotoKegiatanProps) => {
  return (
    <div className="border-2 border-dashed border-purple-300 rounded-md p-4">
      <div className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden mb-3">
        <Image
          src={photo}
          alt={title}
          width={400}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
      {/* Hapus tombol Hapus jika tidak diperlukan */}
      {/* <button
        onClick={onDelete}  
        className="mt-2 text-xs text-red-500 hover:text-red-700"
      >
        Hapus
      </button> */}
    </div>
  );
};

export default FotoKegiatan;
