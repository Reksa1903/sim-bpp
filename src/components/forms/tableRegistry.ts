// src/components/forms/tableRegistry.ts
export const TABLES = {
  penyuluh: "penyuluh",
  kelompoktani: "kelompoktani",
  kiospertanian: "kiospertanian",
  materi: "materi",
  kegiatan: "kegiatan",
  dokumentasiacara: "dokumentasiacara",
  pengumuman: "pengumuman",
  desabinaan: "desabinaan",
} as const;

export type TableName = keyof typeof TABLES;
