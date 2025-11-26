// src/lib/auth.ts
import { auth } from "@clerk/nextjs/server";

// Definisikan tipe metadata kamu sendiri saja
interface CustomClaims {
  metadata?: {
    role?: string;
  };
}

export const getUserSession = async () => {
  const { userId, sessionClaims } = await auth();

  // Paksa typing agar metadata dikenali
  const claims = sessionClaims as CustomClaims;

  const role = claims.metadata?.role ?? null;

  return { userId, role };
};
