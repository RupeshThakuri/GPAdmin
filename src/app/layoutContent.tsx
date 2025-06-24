'use client'

import { usePathname } from "next/navigation";
import { NotificationBar } from "@/components/Layout/NotificationBar";
import { DashboardNav } from "@/components/Layout/dashboard-nav";
import Link from "next/link";
import Image from "next/image";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.includes("/login")) {
    return (
      <div className="flex w-full flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NotificationBar />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-16 items-center border-b px-6 bg-primary/10">
            <Link href="/admin" className="flex items-center gap-2 text-primary-foreground justify-center">
              <Image
                src={"/Image/Admin/logo.png"}
                width={50}
                height={50}
                alt="logo"
              />
              <p>
                <span className="font-bold text-red-400">Gurkha</span><span className="font-bold text-blue-800"> Pasal</span>
              </p>
            </Link>
          </div>
          <div className="px-3 py-4 h-[calc(100vh-4rem-40px)] overflow-auto">
            <DashboardNav />
          </div>
        </aside>
        <div className="flex w-full flex-1 flex-col">
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}