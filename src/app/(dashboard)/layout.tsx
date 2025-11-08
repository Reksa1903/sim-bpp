// src/app/(dashboard)/layout.tsx
import Image from 'next/image'
import Link from 'next/link'
import NextDynamic from 'next/dynamic'

// ⬇️ import client components via dynamic no-SSR
const Menu = NextDynamic(() => import('@/components/Menu'), { ssr: false })
const Navbar = NextDynamic(() => import('@/components/Navbar'), { ssr: false })

// ⬇️ MATIKAN SSG/PRERENDER untuk segmen dashboard
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">Balai Pertanian</span>
        </Link>
        <Menu />
      </div>

      {/* RIGHT */}
      {/* ⬇️ perbaiki class Tailwind yang kurang bracket */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  )
}
