// src/lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import fs from 'fs';
import { v4 as uuidv4 } from "uuid";
import { clerkClient } from "@clerk/nextjs/server";
import { cloudinary } from "@/lib/cloudinary";

// Tipe respons form
export type FormResult = {
  success: boolean;
  error: boolean;
  message?: string | null;
};

// === Materi === //
export const createMateriFromForm = async (formData: FormData): Promise<FormResult> => {
  try {
    const title = (formData.get("title") as string || "").trim();
    const penyuluhId = formData.get("penyuluhId") as string;
    let fileName = (formData.get("fileName") as string || "").trim();
    const file = formData.get("file") as File | null;

    if (!title || !penyuluhId || !file || file.size === 0) {
      return { success: false, error: true, message: "Field belum lengkap / file kosong" };
    }
    if (!file.type.includes("pdf")) {
      return { success: false, error: true, message: "Hanya PDF yang diizinkan" };
    }

    // Tambahkan .pdf jika user lupa menulis ekstensi
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      fileName = `${fileName}.pdf`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const baseName = fileName.replace(/\.pdf$/i, "");
    const publicIdBase = `${uuidv4()}-${baseName}`;

    const uploaded = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "sim-bpp/materi",
          resource_type: "raw",
          public_id: publicIdBase,
          overwrite: true,
        },
        (err, res) => (err || !res ? reject(err) : resolve(res))
      ).end(buffer);
    });

    await prisma.materi.create({
      data: {
        title,
        penyuluhId,
        fileName,
        fileUrl: uploaded.secure_url,
      },
    });

    return { success: true, error: false };
  } catch (e) {
    console.error("createMateriFromForm failed:", e);
    return { success: false, error: true, message: "Gagal menyimpan data di server" };
  }
};


// --- UPDATE ---
// --- UPDATE MATERI ---
export const updateMateriFromForm = async (formData: FormData): Promise<FormResult> => {
  try {
    const id = formData.get("id") as string;
    const title = (formData.get("title") as string || "").trim();
    const penyuluhId = formData.get("penyuluhId") as string;

    let fileName = (formData.get("fileName") as string || "").trim();
    const file = formData.get("file") as File | null;

    let fileUrl: string | undefined;

    // 🔥 Otomatis tambahkan .pdf jika tidak ditulis user
    if (fileName && !fileName.toLowerCase().endsWith(".pdf")) {
      fileName = `${fileName}.pdf`;
    }

    // Jika ada file baru → upload ulang
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const baseName = fileName ? fileName.replace(/\.pdf$/i, "") : file.name.replace(/\.[^.]+$/, "");

      const publicIdBase = `${uuidv4()}-${baseName}`;

      const uploaded = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "sim-bpp/materi",
            resource_type: "raw",
            public_id: publicIdBase,
            overwrite: true,
          },
          (err, res) => (err || !res ? reject(err) : resolve(res))
        ).end(buffer);
      });

      fileUrl = uploaded.secure_url;
    }

    // Update database
    await prisma.materi.update({
      where: { id },
      data: {
        title,
        penyuluhId,
        ...(fileName && { fileName }),
        ...(fileUrl && { fileUrl }),
      },
    });

    return { success: true, error: false };
  } catch (e) {
    console.error("updateMateriFromForm failed:", e);
    return { success: false, error: true, message: "Gagal menyimpan data di server" };
  }
};

// --- DELETE ---
// Sementara hapus record saja. Jika kamu simpan `public_id`,
// kamu bisa panggil `cloudinary.uploader.destroy(public_id, { resource_type: "raw" })`.
export const deleteMateri = async (_: FormResult, formData: FormData): Promise<FormResult> => {
  try {
    const id = formData.get("id") as string;
    await prisma.materi.delete({ where: { id } });
    return { success: true, error: false };
  } catch (e) {
    console.error("deleteMateri failed:", e);
    return { success: false, error: true };
  }
};

// === Pengumuman === //
export const createPengumumanFromForm = async (formData: FormData): Promise<FormResult> => {
  try {
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const penyuluhId = (formData.get("penyuluhId") as string) || null;
    const kelompokTaniId = (formData.get("kelompokTaniId") as string) || null;
    const desaBinaanId = (formData.get("desaBinaanId") as string) || null;

    if (!title || !description) {
      return { success: false, error: true, message: "Judul & deskripsi wajib diisi." };
    }

    await prisma.pengumuman.create({
      data: {
        title,
        description,
        penyuluhId: penyuluhId || null,
        kelompokTaniId: kelompokTaniId || null,
        desaBinaanId: desaBinaanId || null,
      },
    });

    // Segarkan halaman terkait
    revalidatePath("/list/pengumuman");
    revalidatePath("/admin");

    return { success: true, error: false, message: null };
  } catch (error: any) {
    console.error("Create Pengumuman Error:", error);
    return { success: false, error: true, message: error?.message || "Gagal membuat pengumuman." };
  }
};

// UPDATE
export const updatePengumumanFromForm = async (formData: FormData): Promise<FormResult> => {
  try {
    const id = formData.get("id") as string;
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const penyuluhId = (formData.get("penyuluhId") as string) || null;
    const kelompokTaniId = (formData.get("kelompokTaniId") as string) || null;
    const desaBinaanId = (formData.get("desaBinaanId") as string) || null;

    if (!id || !title || !description) {
      return { success: false, error: true, message: "Data tidak lengkap." };
    }

    await prisma.pengumuman.update({
      where: { id },
      data: {
        title,
        description,
        penyuluhId: penyuluhId || null,
        kelompokTaniId: kelompokTaniId || null,
        desaBinaanId: desaBinaanId || null,
      },
    });

    revalidatePath("/list/pengumuman");
    revalidatePath("/admin");

    return { success: true, error: false, message: null };
  } catch (error: any) {
    console.error("Update Pengumuman Error:", error);
    return { success: false, error: true, message: error?.message || "Gagal mengubah pengumuman." };
  }
};

// DELETE
export const deletePengumuman = async (_: FormResult, formData: FormData): Promise<FormResult> => {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: true, message: "ID tidak ditemukan." };

    await prisma.pengumuman.delete({ where: { id } });

    revalidatePath("/list/pengumuman");
    revalidatePath("/admin");

    return { success: true, error: false, message: null };
  } catch (error: any) {
    console.error("Delete Pengumuman Error:", error);
    return { success: false, error: true, message: error?.message || "Gagal menghapus pengumuman." };
  }
};

// === Kegiatan === //
export const createKegiatanFromForm = async (formData: FormData): Promise<FormResult> => {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const day = formData.get("day") as "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
    const penyuluhId = formData.get("penyuluhId") as string;

    await prisma.kegiatan.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        day,
        penyuluhId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Create Kegiatan Error:", error);
    return { success: false, error: true };
  }
};

export const updateKegiatanFromForm = async (formData: FormData): Promise<FormResult> => {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const day = formData.get("day") as "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
    const penyuluhId = formData.get("penyuluhId") as string;

    await prisma.kegiatan.update({
      where: { id },
      data: {
        title,
        description,
        startDate,
        endDate,
        day,
        penyuluhId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Update Kegiatan Error:", error);
    return { success: false, error: true };
  }
};

export const deleteKegiatan = async (
  _currentState: FormResult,
  formData: FormData
): Promise<FormResult> => {
  try {
    const id = formData.get("id") as string;
    await prisma.kegiatan.delete({ where: { id } });

    return { success: true, error: false };
  } catch (error) {
    console.error("Delete Kegiatan Error:", error);
    return { success: false, error: true };
  }
};

// === DokumentasiAcara === //
// CREATE
export const createDokumentasiAcaraFromForm = async (
  _prevState: FormResult,
  formData: FormData
): Promise<FormResult> => {
  try {
    const title = (formData.get("title") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const dateStr = formData.get("date") as string | null;        // "YYYY-MM-DD"
    const penyuluhId = formData.get("penyuluhId") as string | null;
    const photo = formData.get("photo") as File | null;           // ← name input = "photo"

    if (!title || !description || !photo || photo.size === 0) {
      return { success: false, error: true, message: "Data belum lengkap / foto kosong" };
    }

    const buffer = Buffer.from(await photo.arrayBuffer());

    const uploaded: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "sim-bpp/dokumentasi",
            resource_type: "image",
            public_id: `${uuidv4()}-${(photo.name || "photo").replace(/\.[^.]+$/,"")}`,
            overwrite: true,
          },
          (err, res) => (err || !res ? reject(err) : resolve(res))
        )
        .end(buffer);
    });

    await prisma.dokumentasiAcara.create({
      data: {
        title,
        description,
        date: dateStr ? new Date(`${dateStr}T00:00:00.000Z`) : new Date(),
        ...(penyuluhId ? { penyuluhId } : {}),
        photo: uploaded.secure_url,           // simpan URL Cloudinary
      },
    });

    revalidatePath("/list/dokumentasiacara");
    revalidatePath("/admin");
    return { success: true, error: false, message: null };
  } catch (e: any) {
    console.error("Create Dokumentasi Error:", e);
    return { success: false, error: true, message: e?.message || "Upload gagal" };
  }
};

// UPDATE
export const updateDokumentasiAcaraFromForm = async (
  _prevState: FormResult,
  formData: FormData
): Promise<FormResult> =>  {
  try {
    const id = formData.get("id") as string;
    const title = (formData.get("title") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const dateStr = formData.get("date") as string | null;
    const penyuluhId = formData.get("penyuluhId") as string | null;
    const photo = formData.get("photo") as File | null;

    if (!id || !title || !description) {
      return { success: false, error: true, message: "Data tidak lengkap" };
    }

    const patch: any = {
      title, description,
      ...(dateStr ? { date: new Date(`${dateStr}T00:00:00.000Z`) } : {}),
      ...(penyuluhId ? { penyuluhId } : {}),
    };

    if (photo && photo.size > 0) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const uploaded: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "sim-bpp/dokumentasi",
              resource_type: "image",
              public_id: `${uuidv4()}-${(photo.name || "photo").replace(/\.[^.]+$/,"")}`,
              overwrite: true,
            },
            (err, res) => (err || !res ? reject(err) : resolve(res))
          )
          .end(buffer);
      });
      patch.photo = uploaded.secure_url;
    }

    await prisma.dokumentasiAcara.update({ where: { id }, data: patch });

    revalidatePath("/list/dokumentasiacara");
    revalidatePath("/admin");
    return { success: true, error: false, message: null };
  } catch (e: any) {
    console.error("Update Dokumentasi Error:", e);
    return { success: false, error: true, message: e?.message || "Update gagal" };
  }
};

export const deleteDokumentasiAcaraFromForm = async (
  _currentState: FormResult,
  formData: FormData
): Promise<FormResult> => {
  try {
    const id = formData.get("id") as string;
    if (!id) throw new Error("ID tidak ditemukan");

    const existing = await prisma.dokumentasiAcara.findUnique({ where: { id } });
    if (existing?.photo) {
      const rel = existing.photo.startsWith("/") ? existing.photo.slice(1) : existing.photo;
      const filePath = path.join(process.cwd(), "public", rel);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn("Gagal menghapus foto:", err);
      }
    }

    await prisma.dokumentasiAcara.delete({ where: { id } });

    return { success: true, error: false };
  } catch (error) {
    console.error("Delete Dokumentasi Error:", error);
    return { success: false, error: true };
  }
};

// === Kios Pertanian === //
type KiosPertanianFormResult = { success: boolean; error: boolean };

// create kios pertanian
export const createKiosPertanianFromForm = async (
  _prevState: KiosPertanianFormResult,
  payload: any
): Promise<KiosPertanianFormResult> => {
  try {
    // Normalisasi data dari form
    const name = String(payload.name ?? "").trim();
    const owner = String(payload.owner ?? "").trim();
    const address = String(payload.address ?? "").trim();
    const phone = String(payload.phone ?? "").trim();
    const img = payload.img ?? null; // Cloudinary secure_url (string) atau null

    // Validasi sederhana (server-side)
    if (!name) throw new Error("Nama kios wajib diisi");
    if (!owner) throw new Error("Nama pemilik wajib diisi");
    if (!address) throw new Error("Alamat wajib diisi");
    if (!phone) throw new Error("Nomor telepon wajib diisi");

    // Pastikan nomor telepon unik (karena ada @unique)
    const existingPhone = await prisma.kiosPertanian.findUnique({
      where: { phone },
    });
    if (existingPhone) {
      throw new Error("Nomor telepon sudah terdaftar pada kios lain");
    }

    // Buat record di database
    await prisma.kiosPertanian.create({
      data: {
        name,
        owner,
        address,
        phone,
        img: img ?? null,
      },
    });

    // Revalidate halaman list
    try {
      revalidatePath("/list/parakiospertanian");
    } catch (_) {}

    return { success: true, error: false };
  } catch (err) {
    console.error("Create Kios Pertanian Error:", err);
    return { success: false, error: true };
  }
};

// update kios pertanian
export const updateKiosPertanianFromForm = async (
  _prevState: KiosPertanianFormResult,
  payload: any
): Promise<KiosPertanianFormResult> => {
  try {
    const id = String(payload.id ?? "").trim();
    if (!id) throw new Error("ID kios tidak ditemukan");

    // Normalisasi input (biar undefined tidak overwrite field lama)
    const name =
      payload.name === undefined ? undefined : String(payload.name).trim();
    const owner =
      payload.owner === undefined ? undefined : String(payload.owner).trim();
    const address =
      payload.address === undefined ? undefined : String(payload.address).trim();
    const phone =
      payload.phone === undefined ? undefined : String(payload.phone).trim();
    const img =
      payload.img === undefined ? undefined : (String(payload.img).trim() || null);

    // Pastikan kios dengan ID ini ada
    const existing = await prisma.kiosPertanian.findUnique({ where: { id } });
    if (!existing) throw new Error("Data kios tidak ditemukan");

    // Validasi unik untuk phone (jika diubah)
    if (phone && phone !== existing.phone) {
      const existingPhone = await prisma.kiosPertanian.findUnique({
        where: { phone },
      });
      if (existingPhone) throw new Error("Nomor telepon sudah digunakan oleh kios lain");
    }

    // Bangun data update
    const updateData: any = {
      ...(name !== undefined && { name }),
      ...(owner !== undefined && { owner }),
      ...(address !== undefined && { address }),
      ...(phone !== undefined && { phone }),
      ...(img !== undefined && { img }),
    };

    // Eksekusi update
    await prisma.kiosPertanian.update({
      where: { id },
      data: updateData,
    });

    // Revalidate list dan halaman detail
    try {
      revalidatePath("/list/parakiospertanian");
      revalidatePath(`/list/parakiospertanian/${id}`);
    } catch (_) {}

    return { success: true, error: false };
  } catch (err) {
    console.error("Update Kios Pertanian Error:", err);
    return { success: false, error: true };
  }
};

// delete kios pertanian
export const deleteKiosPertanian = async (
  _currentState: KiosPertanianFormResult,
  formData: FormData
): Promise<KiosPertanianFormResult> => {
  try {
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("ID kios tidak ditemukan");

    const existing = await prisma.kiosPertanian.findUnique({ where: { id } });
    if (!existing) throw new Error("Kios tidak ditemukan");

    // Hapus dari database
    await prisma.kiosPertanian.delete({ where: { id } });

    // Revalidate list page
    try {
      revalidatePath("/list/parakiospertanian");
    } catch (_) {}

    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Kios Pertanian Error:", err);
    return { success: false, error: true };
  }
};

// === Desa Binaan === //
export const createDesaBinaanFromForm = async (formData: FormData): Promise<{ success: boolean; error: boolean }> => {
  "use server";
  try {
    const name = formData.get("name") as string;
    const penyuluhId = formData.get("penyuluhId") as string | null;
    const kelompokTaniIds = formData.getAll("kelompokTaniIds") as string[];

    // Validasi dasar
    if (!name || name.trim() === "") throw new Error("Nama Desa Binaan diperlukan");

    await prisma.desaBinaan.create({
      data: {
        name,
        penyuluhId: penyuluhId && penyuluhId !== "" ? penyuluhId : null,
        kelompokTani: {
          connect: kelompokTaniIds
            .filter((id) => id && id !== "")
            .map((id) => ({ id })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error creating Desa Binaan:", error);
    return { success: false, error: true };
  }
};

export const updateDesaBinaanFromForm = async (formData: FormData): Promise<{ success: boolean; error: boolean }> => {
  "use server";
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const penyuluhId = formData.get("penyuluhId") as string | null;
    const kelompokTaniIds = formData.getAll("kelompokTaniIds") as string[];

    // Validasi dasar
    if (!id) throw new Error("ID Desa Binaan tidak ditemukan");
    if (!name || name.trim() === "") throw new Error("Nama Desa Binaan diperlukan");

    await prisma.desaBinaan.update({
      where: { id },
      data: {
        name,
        penyuluhId: penyuluhId && penyuluhId !== "" ? penyuluhId : null,
        kelompokTani: {
          set: [], // Kosongkan dulu semua relasi lama
          connect: kelompokTaniIds
            .filter((kid) => kid && kid !== "")
            .map((kid) => ({ id: kid })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error updating Desa Binaan:", error);
    return { success: false, error: true };
  }
};

export const deleteDesaBinaan = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
): Promise<{ success: boolean; error: boolean }> => {
  "use server";

  try {
    const id = formData.get("id") as string;
    if (!id) throw new Error("ID Desa Binaan tidak ditemukan");

    await prisma.desaBinaan.delete({
      where: { id },
    });

    revalidatePath("/list/desabinaan");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error deleting Desa Binaan:", error);
    return { success: false, error: true };
  }
};

// === user === //
// Penyuluh //
type PenyuluhFormResult = { success: boolean; error: boolean };

// helper parsing bidang (string CSV/array -> string[])
function parseBidangFromPayload(val: any): string[] | undefined {
  // kalau field tidak dikirim (undefined), return undefined
  if (val === undefined) return undefined;
  if (!val) return []; // "", null -> []
  if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
  if (typeof val === "string") {
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// helper parsing untuk array id (desaBinaanIds)
function parseIdArrayFromPayload(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "") return [];
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// Helper kompatibilitas Clerk (jaga2 environment)
async function getClerkClientSafe(): Promise<any> {
  const maybe = clerkClient as unknown;
  if (typeof maybe === "function") {
    // @ts-ignore
    return await (maybe as () => Promise<any>)();
  }
  return maybe;
}

/**
 * createPenyuluhFromForm
 * - payload berasal dari react-hook-form + img (object hasil Cloudinary)
 * - sekarang support desaBinaanIds (array)
 */
export const createPenyuluhFromForm = async (
  _prevState: PenyuluhFormResult,
  payload: any
): Promise<PenyuluhFormResult> => {
  try {
    // Ambil fields dari payload (toleran terhadap beberapa nama)
    const username = String(payload.username ?? "").trim();
    const password = String(payload.password ?? "").trim();
    const name = String(payload.name ?? payload.firstName ?? "").trim();
    const surname = String(payload.surname ?? payload.lastName ?? "").trim();
    const email = payload.email ? String(payload.email).trim() : null;
    const phone = payload.phone ? String(payload.phone).trim() : "";
    const address = String(payload.address ?? "").trim();
    const img = payload.img ?? null; // string URL (secure_url) diharapkan
    const bidang = parseBidangFromPayload(payload.bidang);
    const gender = payload.gender ?? null; // "PRIA" | "WANITA"
    const birthday = payload.birthday ? new Date(payload.birthday) : null;

    // parse desaBinaanIds (bisa array atau CSV string)
    const desaBinaanIds = parseIdArrayFromPayload(payload.desaBinaanIds);

    // minimal validation (server-side safety)
    if (!username || !password) throw new Error("username & password wajib");
    if (!name || !surname) throw new Error("nama depan & belakang wajib");
    if (!birthday || isNaN(birthday.getTime())) throw new Error("birthday invalid");

    // buat user di Clerk (opsional, tangani error agar tidak memblokir DB create jika Clerk down)
    let createdUser: any = null;
    try {
      const client = await getClerkClientSafe();
      if (client && client.users && typeof client.users.createUser === "function") {
        createdUser = await client.users.createUser({
          username,
          password,
          firstName: name,
          lastName: surname,
          publicMetadata: { role: "penyuluh" },
          // Jika ingin tambah email langsung: gunakan emailAddresses sesuai dokumentasi Clerk
        });
      } else {
        console.warn("Clerk client tidak tersedia / tidak support createUser, skip Clerk creation.");
      }
    } catch (err) {
      console.warn("Gagal membuat user di Clerk, lanjut create Prisma:", err);
      createdUser = null;
    }

    // data untuk prisma
    const dataForPrisma: any = {
      username,
      name,
      surname,
      email: email ?? null,
      phone,
      address,
      img: img ?? null,
      bidang,
      ...(gender ? { gender } : {}),
      birthday,
    };

    // jika Clerk berhasil, gunakan id Clerk sebagai id record (opsional — sesuai struktur lama Anda)
    if (createdUser?.id) {
      dataForPrisma.id = createdUser.id;
    }

    // Jika ada desaBinaanIds -> connect relasi many-to-many / one-to-many
    if (desaBinaanIds && desaBinaanIds.length > 0) {
      dataForPrisma.desaBinaan = {
        connect: desaBinaanIds.map((id) => ({ id })),
      };
    }

    // Create di Prisma — jika gagal, rollback Clerk (hapus user yang sudah dibuat)
    try {
      await prisma.penyuluh.create({
        data: dataForPrisma,
      });
    } catch (prismaErr) {
      // rollback clerk jika diperlukan
      if (createdUser?.id) {
        try {
          const client = await getClerkClientSafe();
          if (client && client.users && typeof client.users.deleteUser === "function") {
            await client.users.deleteUser(createdUser.id);
          }
        } catch (rollbackErr) {
          console.warn("Gagal rollback (hapus user Clerk) setelah Prisma gagal:", rollbackErr);
        }
      }
      throw prismaErr;
    }

    // revalidate list
    try {
      revalidatePath("/list/parapenyuluh");
    } catch (e) {}

    return { success: true, error: false };
  } catch (err) {
    console.error("Create Penyuluh Error:", err);
    return { success: false, error: true };
  }
};

/**
 * updatePenyuluhFromForm
 * - Password hanya diupdate kalau ADMIN mengisi kolom password (non-empty).
 * - Field lain tidak akan di-reset jika tidak dikirim (undefined).
 * - Relasi desaBinaan akan di-replace hanya jika field 'desaBinaanIds' dikirim.
 */
export const updatePenyuluhFromForm = async (
  _prevState: PenyuluhFormResult,
  payload: any
): Promise<PenyuluhFormResult> => {
  try {
    const id = String(payload.id ?? "").trim();
    if (!id) throw new Error("ID tidak ditemukan");

    // ---- NORMALISASI INPUT ----
    // string opsional: kalau undefined -> undefined (tidak diupdate)
    // kalau string kosong "" → kita biarkan “kosong” untuk field yang memang boleh kosong (mis. email/img -> null)

    const username =
      payload.username === undefined ? undefined : String(payload.username).trim();
    // password: kosong/"" -> undefined (jangan update)
    const passwordRaw = payload.password;
    const password =
      passwordRaw === undefined || String(passwordRaw).trim() === ""
        ? undefined
        : String(passwordRaw);
    const name =
      payload.name === undefined && payload.firstName === undefined
        ? undefined
        : String((payload.name ?? payload.firstName) ?? "").trim();
    const surname =
      payload.surname === undefined && payload.lastName === undefined
        ? undefined
        : String((payload.surname ?? payload.lastName) ?? "").trim();
    // email: jika undefined -> jangan update; jika "" -> set null; jika ada -> string
    const email =
      payload.email === undefined
        ? undefined
        : (String(payload.email).trim() || null);
    // phone: jika undefined -> jangan update
    const phone =
      payload.phone === undefined ? undefined : String(payload.phone).trim();
    // address: jika undefined -> jangan update
    const address =
      payload.address === undefined ? undefined : String(payload.address).trim();
    // img: jika undefined -> jangan update; kalau ""/null/falsey -> set null; kalau ada -> string
    const img =
      payload.img === undefined ? undefined : (String(payload.img).trim() || null);
    // bidang: hanya kirim kalau memang ada di payload (biar tidak me-reset jadi [])
    const bidang = parseBidangFromPayload(payload.bidang);
    // gender: kalau undefined atau "" -> jangan update
    const gender =
      payload.gender === undefined || String(payload.gender).trim() === ""
        ? undefined
        : payload.gender;
    // birthday: jika undefined atau "" -> jangan update; kalau ada dan invalid → abaikan (tidak update)
    let birthday: Date | undefined = undefined;
    if (payload.birthday !== undefined && String(payload.birthday).trim() !== "") {
      const d = new Date(payload.birthday);
      if (!isNaN(d.getTime())) birthday = d;
    }
    // parse relasi desaBinaan (hanya update kalau field disertakan)
    const desaBinaanFieldIncluded = Object.prototype.hasOwnProperty.call(
      payload,
      "desaBinaanIds"
    );
    const desaBinaanIds = parseIdArrayFromPayload(payload.desaBinaanIds);

    // ---- UPDATE CLERK USER (kalau id adalah id Clerk) ----
    try {
      const client = await getClerkClientSafe();
      if (client?.users?.updateUser) {
        await client.users.updateUser(id, {
          username: username || undefined,
          firstName: name || undefined,
          lastName: surname || undefined,
          // hanya kirim password jika diisi
          ...(password && { password }),
          publicMetadata: { role: "penyuluh" },
        });
      }
    } catch (err) {
      console.warn("Gagal update user Clerk (mungkin id bukan id Clerk):", err);
    }

    // ---- BANGUN OBJEK UPDATE PRISMA ----
    const updateData: any = {
      ...(username !== undefined && { username }),
      ...(name !== undefined && { name }),
      ...(surname !== undefined && { surname }),
      // Email:
      // - undefined -> tidak update
      // - null -> set NULL
      // - string -> set email
      ...(email !== undefined && { email }),

      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      // Img:
      // - undefined -> tidak update
      // - null -> set NULL
      // - string -> set img
      ...(img !== undefined && { img }),
      // Bidang: hanya update jika field dikirim
      ...(bidang !== undefined && { bidang }),
      // Gender: hanya update bila dikirim (dan truthy)
      ...(gender !== undefined && { gender }),
      // Birthday: hanya update bila dikirim valid
      ...(birthday !== undefined && { birthday }),
    };
    // Relasi desaBinaan: hanya replace kalau field disertakan
    if (desaBinaanFieldIncluded) {
      updateData.desaBinaan = {
        set: desaBinaanIds.map((desaId) => ({ id: desaId })),
      };
    }
    // ---- EKSEKUSI UPDATE PRISMA ----
    await prisma.penyuluh.update({
      where: { id },
      data: updateData,
    });
    // Revalidate list & halaman detail
    try {
      revalidatePath("/list/parapenyuluh");
      revalidatePath(`/list/parapenyuluh/${id}`);
    } catch (_) {}

    return { success: true, error: false };
  } catch (err) {
    console.error("Update Penyuluh Error:", err);
    return { success: false, error: true };
  }
};

/**
 * deletePenyuluh
 * - tetap pakai signature (_state, formData) karena FormModal delete mengirim form with id hidden
 */
export const deletePenyuluh = async (
  _currentState: PenyuluhFormResult,
  formData: FormData
): Promise<PenyuluhFormResult> => {
  try {
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("ID penyuluh tidak ditemukan");

    const existing = await prisma.penyuluh.findUnique({ where: { id } });
    if (!existing) throw new Error("Penyuluh tidak ditemukan");

    // try delete user in Clerk if exists (menggunakan existing.id sesuai struktur Anda saat ini)
    try {
      const client = await getClerkClientSafe();
      if (client && client.users && typeof client.users.deleteUser === "function") {
        await client.users.deleteUser(existing.id);
      }
    } catch (err) {
      console.warn("Gagal menghapus user Clerk (mungkin id bukan user Clerk):", err);
    }

    await prisma.penyuluh.delete({ where: { id } });

    try {
      revalidatePath("/list/parapenyuluh");
    } catch (e) {}

    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Penyuluh Error:", err);
    return { success: false, error: true };
  }
};

// Kelompok Tani
type KelompokTaniFormResult = { success: boolean; error: boolean };

/** Helper: normalisasi luasArea dari payload menjadi number | undefined */
function parseLuasArea(input: any): number | undefined {
  if (input === undefined || input === null) return undefined;
  // jika empty string -> anggap tidak diisi
  if (typeof input === 'string' && input.trim() === '') return undefined;

  // jika sudah number
  if (typeof input === 'number') {
    if (Number.isNaN(input)) return undefined;
    return input;
  }

  // coba coerce ke number (mis. '12.5')
  const coerced = Number(String(input).trim());
  if (Number.isNaN(coerced)) return undefined;
  return coerced;
}

/**
 * createKelompokTaniFromForm
 * - payload dari react-hook-form + img (Cloudinary)
 * - hanya boleh pilih 1 desaBinaanId
 * - server-side: pastikan desaBinaan ada dan (jika penyuluhId dikirim) cocok dengan desa tersebut
 */
export const createKelompokTaniFromForm = async (
  _prevState: KelompokTaniFormResult,
  payload: any
): Promise<KelompokTaniFormResult> => {
  try {
    // Ambil fields dari payload (normalisasi & trim)
    const username = String(payload.username ?? '').trim();
    const password = String(payload.password ?? '').trim();
    const name = String(payload.name ?? '').trim();
    const ketua = String(payload.ketua ?? '').trim();
    const phone = payload.phone ? String(payload.phone).trim() : '';
    const address = String(payload.address ?? '').trim();
    const img = payload.img ?? null; // URL dari Cloudinary atau null

    // luasArea (optional) -> parse
    const luasAreaParsed = parseLuasArea(payload.luasArea);

    // hanya 1 desa binaan
    const desaBinaanId = payload.desaBinaanId
      ? String(payload.desaBinaanId).trim()
      : null;

    // optional penyuluhId (datang dari form)
    const penyuluhIdFromForm =
      payload.penyuluhId === undefined || payload.penyuluhId === null
        ? undefined
        : String(payload.penyuluhId).trim();

    // Minimal validation (server-side)
    if (!username || !password) throw new Error('username & password wajib');
    if (!name) throw new Error('nama kelompok tani wajib');
    if (!ketua) throw new Error('nama ketua wajib');
    if (!desaBinaanId) throw new Error('desa binaan wajib dipilih');

    // --- Server-side: pastikan desa binaan ada dan cocok dengan penyuluh (jika disediakan) ---
    const desa = await prisma.desaBinaan.findUnique({
      where: { id: desaBinaanId },
      include: { penyuluh: true },
    });

    if (!desa) throw new Error('Desa Binaan tidak ditemukan');

    // Jika form mengirim penyuluhId, pastikan sesuai dengan desa yang dipilih
    if (
      penyuluhIdFromForm !== undefined &&
      penyuluhIdFromForm !== '' &&
      desa.penyuluh?.id !== penyuluhIdFromForm
    ) {
      throw new Error('Penyuluh tidak sesuai dengan Desa Binaan yang dipilih.');
    }

    // buat user di Clerk (jaga2, jangan biarkan gagal Clerk menghentikan DB jika di-handle)
    let createdUser: any = null;
    try {
      const client = await getClerkClientSafe();
      if (client?.users?.createUser) {
        // NOTE: kita tidak lagi menambahkan email ke Clerk karena field email dihapus
        createdUser = await client.users.createUser({
          username,
          password,
          firstName: name,
          publicMetadata: { role: 'kelompoktani' },
        });
      }
    } catch (err) {
      console.warn('Gagal membuat user di Clerk, lanjut ke Prisma:', err);
      createdUser = null;
    }

    // Data untuk Prisma — sertakan luasArea hanya jika tersedia (tidak undefined)
    const dataForPrisma: any = {
      username,
      name,
      ketua,
      phone,
      address,
      img,
      desaBinaan: { connect: { id: desaBinaanId } },
      // luasArea hanya ditambahkan apabila parsed value !== undefined
      ...(luasAreaParsed !== undefined && { luasArea: luasAreaParsed }),
    };

    // gunakan id Clerk sebagai id record jika tersedia
    if (createdUser?.id) {
      dataForPrisma.id = createdUser.id;
    }

    try {
      await prisma.kelompokTani.create({ data: dataForPrisma });
    } catch (prismaErr) {
      // rollback Clerk jika Prisma gagal
      if (createdUser?.id) {
        try {
          const client = await getClerkClientSafe();
          if (client?.users?.deleteUser) {
            await client.users.deleteUser(createdUser.id);
          }
        } catch (rollbackErr) {
          console.warn('Rollback gagal (hapus Clerk user):', rollbackErr);
        }
      }
      throw prismaErr;
    }

    try {
      revalidatePath('/list/parakelompoktani');
    } catch (_) {}

    return { success: true, error: false };
  } catch (err) {
    console.error('Create Kelompok Tani Error:', err);
    return { success: false, error: true };
  }
};

/**
 * updateKelompokTaniFromForm
 * - Password hanya diupdate kalau diisi (non-empty).
 * - desaBinaanId harus selalu valid (hanya 1).
 * - server-side: jika desaBinaanId berubah, validasi bahwa penyuluhId (jika disediakan)
 *   sesuai dengan desa tersebut.
 */
export const updateKelompokTaniFromForm = async (
  _prevState: KelompokTaniFormResult,
  payload: any
): Promise<KelompokTaniFormResult> => {
  try {
    const id = String(payload.id ?? '').trim();
    if (!id) throw new Error('ID kelompok tani tidak ditemukan');

    // Normalisasi input
    const username =
      payload.username === undefined ? undefined : String(payload.username).trim();

    const passwordRaw = payload.password;
    const password =
      passwordRaw === undefined || String(passwordRaw).trim() === ''
        ? undefined
        : String(passwordRaw);

    const name = payload.name === undefined ? undefined : String(payload.name).trim();

    const ketua =
      payload.ketua === undefined ? undefined : String(payload.ketua).trim();

    // luasArea handling (may be '', null, undefined, or numeric string)
    const luasAreaParsed = (() => {
      if (!('luasArea' in payload)) return undefined; // not provided
      return parseLuasArea(payload.luasArea);
    })();

    const phone = payload.phone === undefined ? undefined : String(payload.phone).trim();

    const address =
      payload.address === undefined ? undefined : String(payload.address).trim();

    const img =
      payload.img === undefined ? undefined : (String(payload.img).trim() || null);

    const desaBinaanId =
      payload.desaBinaanId === undefined
        ? undefined
        : String(payload.desaBinaanId).trim();

    const penyuluhIdFromForm =
      payload.penyuluhId === undefined
        ? undefined
        : String(payload.penyuluhId).trim();

    // Jika desaBinaanId disertakan -> validasi keberadaan dan kecocokan penyuluh
    if (desaBinaanId !== undefined) {
      const desa = await prisma.desaBinaan.findUnique({
        where: { id: desaBinaanId },
        include: { penyuluh: true },
      });
      if (!desa) throw new Error('Desa Binaan tidak ditemukan');

      if (
        penyuluhIdFromForm !== undefined &&
        penyuluhIdFromForm !== '' &&
        desa.penyuluh?.id !== penyuluhIdFromForm
      ) {
        throw new Error('Penyuluh tidak sesuai dengan Desa Binaan yang dipilih.');
      }
    }

    // Update Clerk user (jika id Clerk digunakan)
    try {
      const client = await getClerkClientSafe();
      if (client?.users?.updateUser) {
        await client.users.updateUser(id, {
          username: username || undefined,
          firstName: name || undefined,
          ...(password && { password }),
          publicMetadata: { role: 'kelompoktani' },
        });
      }
    } catch (err) {
      console.warn('Gagal update Clerk user:', err);
    }

    // Bangun updateData untuk Prisma (jangan kirim undefined)
    const updateData: any = {
      ...(username !== undefined && { username }),
      ...(name !== undefined && { name }),
      ...(ketua !== undefined && { ketua }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(img !== undefined && { img }),
      // luasArea hanya di-include jika field disediakan pada payload.
      // Jika luasAreaParsed === undefined dan payload.luasArea ada (mis. ''), kita tidak set apa-apa.
      ...(luasAreaParsed !== undefined && { luasArea: luasAreaParsed }),
    };

    // relasi desaBinaan (jika disertakan)
    if (desaBinaanId !== undefined) {
      updateData.desaBinaan = {
        connect: { id: desaBinaanId },
      };
    }

    await prisma.kelompokTani.update({
      where: { id },
      data: updateData,
    });

    try {
      revalidatePath('/list/parakelompoktani');
      revalidatePath(`/list/parakelompoktani/${id}`);
    } catch (_) {}

    return { success: true, error: false };
  } catch (err) {
    console.error('Update Kelompok Tani Error:', err);
    return { success: false, error: true };
  }
};

/**
 * deleteKelompokTani
 * - delete juga user di Clerk
 */
export const deleteKelompokTani = async (
  _state: KelompokTaniFormResult,
  formData: FormData
): Promise<KelompokTaniFormResult> => {
  try {
    const id = String(formData.get('id') ?? '');
    if (!id) throw new Error('ID kelompok tani tidak ditemukan');

    const existing = await prisma.kelompokTani.findUnique({ where: { id } });
    if (!existing) throw new Error('Kelompok tani tidak ditemukan');

    // Hapus user di Clerk (jika id Clerk digunakan)
    try {
      const client = await getClerkClientSafe();
      if (client?.users?.deleteUser) {
        await client.users.deleteUser(existing.id);
      }
    } catch (err) {
      console.warn('Gagal hapus Clerk user:', err);
    }

    await prisma.kelompokTani.delete({ where: { id } });

    try {
      revalidatePath('/list/parakelompoktani');
    } catch (_) {}

    return { success: true, error: false };
  } catch (err) {
    console.error('Delete Kelompok Tani Error:', err);
    return { success: false, error: true };
  }
};