"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { DashboardNav } from "./dashboard-nav"


export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] pr-0">
        <div className="px-7 py-4 flex items-center gap-2 border-b mb-4">
          <Image
            src={"/Image/Admin/logo.png"}
            alt="Gurkha Pasal"
            width={50}
            height={50}
          />
          <span className="font-bold">Gurkha Pasal</span>
        </div>
        <div className="px-4">
          <DashboardNav />
        </div>
      </SheetContent>
    </Sheet>
  )
}

