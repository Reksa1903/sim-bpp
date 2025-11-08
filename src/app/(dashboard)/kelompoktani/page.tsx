// src/app/(dashboard)/kelompoktani/page.tsx  ← SERVER
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// runtime tidak perlu di sini karena halaman ini murni wrapper
// export const runtime = 'nodejs';

import KelompoktaniClient from './_client';

export default function Page() {
  return <KelompoktaniClient />;
}
