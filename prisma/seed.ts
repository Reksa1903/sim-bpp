import { PrismaClient, Day, UserSex } from '@prisma/client';

const prisma = new PrismaClient();

// 📅 Fungsi bantu untuk tanggal kegiatan minggu 21 Juli 2025
function getStartOfWeek21July2025(): Date {
  return new Date('2025-07-21T00:00:00+07:00');
}

// 📞 Nomor telepon acak
function randomPhone(): string {
  return `08${Math.floor(1000000000 + Math.random() * 8999999999)}`;
}

// 👩‍🦰 Gender acak (mengembalikan nilai enum UserSex)
function randomGender(): UserSex {
  return Math.random() > 0.5 ? UserSex.PRIA : UserSex.WANITA;
}

// 🎂 Tanggal lahir acak
function randomBirthday(): Date {
  const year = 1980 + Math.floor(Math.random() * 20); // 1980 - 1999
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

// 🌾 Luas area acak (HA) — default antara 0.5 sampai 50.00 HA, 2 desimal
function randomArea(min = 0.5, max = 50): number {
  const value = min + Math.random() * (max - min);
  return parseFloat(value.toFixed(2));
}

async function main() {
  console.log('🔄 Mulai seeding data SIM-BPP...');

  const startOfWeek = getStartOfWeek21July2025();

  // 👨‍💼 Admin
  await prisma.admin.createMany({
    data: [
      { username: 'admin1', email: 'admin1@example.com', password: 'admin123' },
      { username: 'admin2', email: 'admin2@example.com', password: 'admin123' },
    ],
    skipDuplicates: true,
  });

  // 👨‍🌾 Penyuluh
  const penyuluhIds: string[] = [];
  for (let p = 1; p <= 10; p++) {
    const result = await prisma.penyuluh.create({
      data: {
        username: `penyuluh${p}`,
        name: `Penyuluh ${p}`,
        surname: `Surename ${p}`,
        email: `penyuluh${p}@example.com`,
        phone: randomPhone(),
        address: `Alamat Penyuluh ${p}`,
        bidang: [`Tanaman ${p}`, `Pangan ${p}`],
        img: null,
        gender: randomGender(),
        birthday: randomBirthday(),
      },
    });
    penyuluhIds.push(result.id);
  }

  // 🏘️ Desa Binaan & 👨‍🌾 Kelompok Tani
  const desaBinaanIds: string[] = [];
  const kelompokTaniIds: string[] = [];

  for (const penyuluhId of penyuluhIds) {
    for (let d = 1; d <= 2; d++) {
      const desa = await prisma.desaBinaan.create({
        data: {
          name: `Desa Binaan ${d} - Penyuluh ${penyuluhId.slice(0, 4)}`,
          penyuluhId,
        },
      });
      desaBinaanIds.push(desa.id);

      for (let k = 1; k <= 2; k++) {
        const kelompokName = `Kelompok Tani ${k} - ${desa.name}`;
        const slug = kelompokName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const username = `kt_${slug}_${randomSuffix}`;

        const kelompok = await prisma.kelompokTani.create({
          data: {
            username,
            name: kelompokName,
            ketua: `Ketua ${k} - ${desa.name}`,
            // GANTI: tidak lagi pakai email — gunakan luasArea (dalam HA)
            luasArea: randomArea(), // contoh: 12.50 (satuan: HA)
            phone: randomPhone(),
            address: `Alamat Kelompok ${k} - ${desa.name}`,
            img: null,
            desaBinaanId: desa.id,
          },
        });
        kelompokTaniIds.push(kelompok.id);
      }
    }
  }

  // 🏪 Kios Pertanian (✅ Sudah ditambahkan kolom img)
  const kiosIds: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const kios = await prisma.kiosPertanian.create({
      data: {
        name: `Kios ${i}`,
        owner: `Pemilik ${i}`,
        address: `Alamat Kios ${i}`,
        phone: randomPhone(),
        img: `/uploads/kios/kios-${i}.jpg`, // 🆕 Tambahkan gambar mock
      },
    });
    kiosIds.push(kios.id);
  }

  // 📘 Materi
  for (let i = 1; i <= 10; i++) {
    await prisma.materi.create({
      data: {
        title: `Materi ${i}`,
        fileName: `file${i}.pdf`,
        fileUrl: `/files/file${i}.pdf`,
        penyuluhId: penyuluhIds[i % penyuluhIds.length],
      },
    });
  }

  // 📷 Dokumentasi Acara
  for (let i = 1; i <= 10; i++) {
    await prisma.dokumentasiAcara.create({
      data: {
        title: `Dokumentasi ${i}`,
        description: `Deskripsi dokumentasi ${i}`,
        photo: `/photos/doc${i}.jpg`,
        date: new Date(),
        penyuluhId: penyuluhIds[i % penyuluhIds.length],
      },
    });
  }

  // 📢 Pengumuman + Pivot KiosPengumuman
  for (let i = 1; i <= 10; i++) {
    const penyuluhId = penyuluhIds[i % penyuluhIds.length];
    const desaBinaan = await prisma.desaBinaan.findFirst({
      where: { penyuluhId },
    });

    const kelompokTani = await prisma.kelompokTani.findFirst({
      where: { desaBinaanId: desaBinaan?.id },
    });

    if (!desaBinaan || !kelompokTani) {
      console.warn(`⚠️ Data tidak lengkap untuk pengumuman ke-${i}, dilewati.`);
      continue;
    }

    const pengumuman = await prisma.pengumuman.create({
      data: {
        title: `Pengumuman ${i}`,
        description: `Deskripsi pengumuman ${i}`,
        penyuluhId,
        kelompokTaniId: kelompokTani.id,
        desaBinaanId: desaBinaan.id,
      },
    });

    await prisma.kiosPengumuman.create({
      data: {
        kiosPertanianId: kiosIds[i % kiosIds.length],
        pengumumanId: pengumuman.id,
      },
    });
  }

  // 📅 Kegiatan 21–25 Juli 2025
  for (let i = 0; i < 5; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);

    const start = new Date(date);
    const end = new Date(date);
    start.setHours(8, 0, 0);
    end.setHours(10, 0, 0);

    await prisma.kegiatan.create({
      data: {
        title: `Kegiatan Hari ${Object.values(Day)[i]}`,
        description: `Deskripsi kegiatan hari ${Object.values(Day)[i]}`,
        startDate: start,
        endDate: end,
        day: Object.values(Day)[i] as Day,
        penyuluhId: penyuluhIds[i],
      },
    });
  }

  console.log('✅ Sukses: Seeding data SIM-BPP selesai.');
}

// 🚀 Jalankan seeding
main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error('❌ Gagal saat seeding:', err);
    prisma.$disconnect();
    process.exit(1);
  });
