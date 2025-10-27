// src/lib/formValidationSchemas.ts
import z from "zod";

/**
 * Validasi untuk form Materi Penyuluhan
 * - `title`: Wajib diisi, minimal 1 karakter
 * - `penyuluhId`: Harus ada dan bertipe string (bukan array lagi)
 * - `id`: Optional, digunakan hanya saat update
 */


// === Materi === //
export const materiSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(1, { message: 'Judul materi diperlukan!' }),
  penyuluhId: z
    .string()
    .min(1, { message: 'Pilih penyuluh yang bertanggung jawab!' }),
  fileName: z
    .string()
    .min(1, { message: 'Nama file diperlukan!' }),
  fileUrl: z
    .string()
    .url({ message: 'URL file tidak valid!' }),
});

export type MateriSchema = z.infer<typeof materiSchema>;


// === Pengumuman === //
export const pengumumanSchema = z.object({
  id: z.coerce.string().optional(), // UUID opsional
  title: z
    .string()
    .min(1, { message: 'Judul pengumuman diperlukan!' }),
  description: z
    .string()
    .min(1, { message: 'Deskripsi pengumuman harus diisi!' }),
  penyuluhId: z
    .string()
    .min(1, { message: 'Pilih penyuluh yang membuat pengumuman!' }),
  kelompokTaniId: z
    .string()
    .min(1, { message: 'Pilih kelompok tani yang dituju!' }),
  desaBinaanId: z
    .string()
    .min(1, { message: 'Pilih desa binaan tujuan!' }),
});

export type PengumumanSchema = z.infer<typeof pengumumanSchema>;


// === Kegiatan === //
export const kegiatanSchema = z.object({
  id: z.coerce.string().optional(), // UUID saat update

  title: z
    .string()
    .min(1, { message: 'Judul kegiatan diperlukan!' }),

  description: z
    .string()
    .min(1, { message: 'Deskripsi kegiatan harus diisi!' }),

  startDate: z
    .string()
    .min(1, { message: 'Tanggal dan jam mulai kegiatan wajib diisi oleh pengguna!' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Format tanggal mulai tidak valid!',
    }),

  endDate: z
    .string()
    .min(1, { message: 'Tanggal dan jam selesai kegiatan wajib diisi oleh pengguna!' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Format tanggal selesai tidak valid!',
    }),

  day: z
    .enum(["Senin", "Selasa", "Rabu", "Kamis", "Jumat"], {
      errorMap: () => ({ message: 'Hari kegiatan harus dipilih dari opsi yang tersedia!' }),
    }),

  penyuluhId: z
    .string()
    .min(1, { message: 'Pilih penyuluh yang bertanggung jawab!' }),
});

export type KegiatanSchema = z.infer<typeof kegiatanSchema>;


// === DokumentasiAcara === //
const PHOTO_PATH_REGEX = /^(\/?photos\/).+\.(jpe?g|png|webp|gif)$/i;

// Validasi jika photo diberikan sebagai string (path di public/photos)
const photoStringSchema = z
  .string()
  .min(1, { message: 'Path/URL foto tidak boleh kosong!' })
  .regex(PHOTO_PATH_REGEX, { message: 'Path foto tidak valid. Gunakan path seperti /photos/namafile.jpg' });

// Validasi jika photo diberikan sebagai File (client-side upload)
// Guard typeof File !== 'undefined' untuk menghindari error saat build di server
const imageFileSchema = z.custom<File>(
  (val) =>
    typeof File !== 'undefined' &&
    val instanceof File &&
    val.size > 0 &&
    typeof (val as File).type === 'string' &&
    (val as File).type.startsWith('image/'),
  {
    message: 'File foto harus berupa gambar yang valid (JPG/PNG/WebP/GIF) dan tidak kosong!',
  }
);

// Union: path string (existing file di public/photos) atau File (upload baru)
const photoUnionSchema = z.union([photoStringSchema, imageFileSchema]);

export const dokumentasiAcaraSchema = z
  .object({
    id: z.coerce.string().optional(), // UUID saat update (opsional untuk create)

    title: z
      .string()
      .min(1, { message: 'Judul dokumentasi diperlukan!' }),

    description: z
      .string()
      .min(1, { message: 'Deskripsi dokumentasi harus diisi!' }),

    date: z
      .string()
      .min(1, { message: 'Tanggal dokumentasi wajib diisi!' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Format tanggal dokumentasi tidak valid!',
      }),

    penyuluhId: z
      .string()
      .min(1, { message: 'Pilih penyuluh yang bertanggung jawab!' }),

    // opsional di level field — superRefine nanti paksa pada create
    photo: photoUnionSchema.optional(),
  })
  .superRefine((values, ctx) => {
    const isCreate = !values.id;

    // wajibkan photo bila create
    if (isCreate && !values.photo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Foto wajib diunggah saat membuat dokumentasi!',
        path: ['photo'],
      });
    }

    // jika photo adalah File, periksa ukuran maksimal (mis. 5MB)
    if (values.photo && typeof values.photo !== 'string') {
      const file = values.photo as File;
      const maxBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxBytes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ukuran foto maksimal 5MB.',
          path: ['photo'],
        });
      }
    }
  });

export type DokumentasiAcaraSchema = z.infer<typeof dokumentasiAcaraSchema>;

// === Kios Pertanian === //
export const kiosPertanianSchema = z.object({
  id: z.string().optional(),

  name: z
    .string({
      required_error: "Nama kios wajib diisi",
      invalid_type_error: "Nama kios harus berupa teks",
    })
    .min(3, "Nama kios minimal 3 karakter")
    .max(100, "Nama kios maksimal 100 karakter"),

  owner: z
    .string({
      required_error: "Nama pemilik wajib diisi",
      invalid_type_error: "Nama pemilik harus berupa teks",
    })
    .min(3, "Nama pemilik minimal 3 karakter")
    .max(100, "Nama pemilik maksimal 100 karakter"),

  address: z
    .string({
      required_error: "Alamat wajib diisi",
      invalid_type_error: "Alamat harus berupa teks",
    })
    .min(5, "Alamat minimal 5 karakter")
    .max(255, "Alamat maksimal 255 karakter"),

  phone: z
    .string({
      required_error: "Nomor telepon wajib diisi",
      invalid_type_error: "Nomor telepon harus berupa teks",
    })
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^[+0-9]+$/, "Nomor telepon hanya boleh berisi angka dan tanda '+'"),

  img: z
    .string()
    .url("Format URL gambar tidak valid")
    .optional()
    .or(z.literal("").transform(() => undefined))
    .nullable(),
});

export type KiosPertanianSchema = z.infer<typeof kiosPertanianSchema>;

// === Desa Binaan === //
export const desaBinaanSchema = z.object({
  id: z.string().optional(),

  // Nama desa wajib diisi dan minimal 1 karakter
  name: z
    .string()
    .min(1, { message: 'Nama desa wajib diisi!' })
    .max(100, { message: 'Nama desa terlalu panjang!' }),

  // Penyuluh bersifat opsional (karena penyuluhId di Prisma nullable)
  penyuluhId: z
    .string()
    .optional()
    .or(z.literal('')) // agar tidak error jika belum dipilih di form
    .transform((val) => (val === '' ? null : val)),

  // Kelompok tani: wajib pilih minimal satu
  kelompokTaniIds: z
    .array(
      z.string().min(1, { message: 'Kelompok tani tidak valid!' })
    )
    .min(1, { message: 'Pilih minimal satu kelompok tani!' }),
});

export type DesaBinaanSchema = z.infer<typeof desaBinaanSchema>;

// === user === //
// == Penyuluh == // 
export const penyuluhSchema = z
  .object({
    id: z.string().optional(),

    username: z
      .string()
      .min(3, { message: "Username harus minimal 3 karakter!" })
      .max(20, { message: "Username tidak boleh lebih dari 20 karakter!" }),

    email: z
      .string()
      .email({ message: "Alamat email tidak valid!" })
      .optional()
      .or(z.literal("")),

    // password opsional agar update tanpa password tetap valid;
    // akan dipaksa di superRefine saat create
    password: z
      .string()
      .min(8, { message: "Password harus minimal 8 karakter!" })
      .optional()
      .or(z.literal("")),

    name: z.string().min(1, { message: "Nama depan diperlukan!" }),
    surname: z.string().min(1, { message: "Nama belakang diperlukan!" }),

    phone: z
      .string()
      .min(6, { message: "Nomor HP tidak valid atau terlalu pendek!" }),

    address: z.string().min(1, { message: "Alamat anda diperlukan!" }),

    // bidang harus array string, tapi fleksibel: boleh string "a,b,c" -> array
    bidang: z.preprocess(
      (val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === "string") {
          return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [];
      },
      z.array(z.string()).min(1, { message: "Bidang anda diperlukan!" })
    ),

    birthday: z.coerce.date({
      required_error: "Tanggal lahir diperlukan!",
      invalid_type_error: "Format tanggal lahir tidak valid!",
    }),

    gender: z.enum(["PRIA", "WANITA"], {
      errorMap: () => ({ message: "Gender anda diperlukan!" }),
    }),

    img: z.string().url({ message: "URL gambar tidak valid!" }).optional(),

    // === Tambahan untuk relasi ke Desa Binaan === //
    desaBinaanIds: z
      .array(z.string())
      .nonempty({ message: "Minimal pilih 1 Desa Binaan!" })
      .optional(),
  })
  .superRefine((values, ctx) => {
    // Jika create (tidak ada id), password wajib
    const isCreate = !values.id;
    if (isCreate) {
      if (
        !values.password ||
        (typeof values.password === "string" && values.password.length < 8)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message:
            "Password wajib diisi dan minimal 8 karakter saat membuat akun baru.",
        });
      }
    }

    // Validasi tambahan: birthday tidak boleh di masa depan
    if (values.birthday instanceof Date && !isNaN(values.birthday.getTime())) {
      const now = new Date();
      if (values.birthday > now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["birthday"],
          message: "Tanggal lahir tidak boleh di masa depan.",
        });
      }
    }
  });

export type PenyuluhSchema = z.infer<typeof penyuluhSchema>;

/**
 * ============================================
 * KelompokTani schema (update) - untuk create/update
 * ============================================
 *
 * Perubahan:
 * - Mengganti field `email` menjadi `luasArea`.
 * - `luasArea` menerima:
 *    - number (coerced dari string jika perlu), atau
 *    - empty string '' (ketika input kosong di form), atau
 *    - null / undefined
 * - Jika diberikan sebagai angka, harus >= 0.
 *
 * Catatan implementasi:
 * - Setelah validasi sukses, saat mengirim ke server:
 *    - Jika luasArea === '' atau luasArea == null -> kirim undefined / biarkan kosong
 *    - Jika luasArea adalah number -> kirim sebagai number (contoh: 12.5)
 */

export const kelompokTaniSchema = z
  .object({
    id: z.string().optional(),

    // authentication fields (Clerk)
    username: z
      .string()
      .min(3, { message: 'Username harus minimal 3 karakter!' })
      .max(20, { message: 'Username tidak boleh lebih dari 20 karakter!' }),

    // password opsional untuk update; wajib pada create (diperiksa di superRefine)
    password: z
      .string()
      .min(8, { message: 'Password harus minimal 8 karakter!' })
      .optional()
      .or(z.literal('')),

    // KelompokTani fields
    name: z.string().min(1, { message: 'Nama kelompok diperlukan!' }),
    ketua: z.string().min(1, { message: 'Nama ketua diperlukan!' }),

    phone: z
      .string()
      .min(6, { message: 'Nomor HP tidak valid atau terlalu pendek!' }),

    address: z.string().min(1, { message: 'Alamat diperlukan!' }),

    // image URL (opsional) - terima URL atau empty string / null / undefined
    img: z
      .string()
      .url({ message: 'URL gambar tidak valid!' })
      .optional()
      .or(z.literal(''))
      .nullable(),

    // relasi ke DesaBinaan (single select) -> wajib
    desaBinaanId: z.string().min(1, { message: 'Desa Binaan harus dipilih!' }),

    /**
     * Field tambahan untuk form:
     * - penyuluhId: string optional -> akan diisi otomatis ketika admin memilih desaBinaan
     */
    penyuluhId: z.string().optional().or(z.literal('')),

    /**
     * luasArea:
     * - menerima angka (coerced dari string) atau empty string '' / null / undefined
     * - jika angka, harus >= 0
     */
    luasArea: z
      .union([
        z.coerce.number({ invalid_type_error: 'Luas area harus berupa angka' }).min(0, {
          message: 'Luas area harus bernilai 0 atau lebih (HA).',
        }),
        z.literal(''),
        z.null(),
        z.undefined(),
      ])
      .optional(),
  })
  .superRefine((values, ctx) => {
    // Jika create (tidak ada id), password wajib
    const isCreate = !values.id;
    if (isCreate) {
      if (
        !values.password ||
        (typeof values.password === 'string' && values.password.length < 8)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['password'],
          message:
            'Password wajib diisi dan minimal 8 karakter saat membuat akun baru.',
        });
      }
    }

    // Validasi tambahan: phone hanya angka/spasi/+ - namun tidak memaksakan format ketat
    if (values.phone && typeof values.phone === 'string') {
      const cleaned = values.phone.replace(/[\s()+-]/g, '');
      if (!/^\d+$/.test(cleaned)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message:
            'Nomor HP hanya boleh berisi angka dan karakter + - (opsional).',
        });
      }
    }

    // Optional: validasi luasArea bila user memasukkan sesuatu selain empty string
    const luas = values.luasArea;
    if (luas !== '' && luas != null) {
      // karena kita menggunakan z.coerce.number di union, nilai numerik sudah ter-coerce,
      // tetapi guard tambahan agar superRefine lebih aman:
      if (typeof luas !== 'number' || Number.isNaN(luas)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['luasArea'],
          message: 'Luas area harus berupa angka yang valid (contoh: 12.5).',
        });
      } else if (luas < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['luasArea'],
          message: 'Luas area tidak boleh negatif.',
        });
      }
    }

    // NOTE: kita sengaja TIDAK memaksa validasi penyuluhId di client-side,
    // karena pengecekan yang akurat butuh data server (prisma). actions.ts
    // sudah melakukan verifikasi server-side (penyuluhId milik desaBinaan).
  });

export type KelompokTaniSchema = z.infer<typeof kelompokTaniSchema>;