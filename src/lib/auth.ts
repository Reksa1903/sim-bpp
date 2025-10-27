// src/lib/auth.ts
import { cookies } from 'next/headers';

/**
 * Mendapatkan sesi user dari cookies/session
 * sementara hardcode dulu
 */
export const getUserSession = async () => {
  const cookiesStore = cookies();

  // misalkan kamu punya cookie `user_id` & `role`
  const userId = cookiesStore.get('user_id')?.value || 'penyuluh1';
  const role = cookiesStore.get('role')?.value || 'penyuluh';

  return { userId, role };
};
