"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Package, Settings, ShoppingCart, User, Users, Truck, LayoutDashboard, Bell } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Truck,
  },
  {
    title: "CMS",
    href: "/cms",
    icon: LayoutDashboard, 
  },
  {
    title: "Notification",
    href: "/notification",
    icon: Bell, 
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-secondary hover:text-primary",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}

