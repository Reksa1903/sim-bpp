// src/app/(dashboard)/list/parapenyuluh/types.ts
import { Penyuluh, DesaBinaan } from "@prisma/client";

export type PenyuluhWithDesa = Penyuluh & {
  desaBinaan: DesaBinaan[];
};
