"use client"

import { useState } from "react"
import { AlertCircle, Bell, ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserNav } from "@/components/Layout/usernav"
import { MobileSidebar } from "./mobile-sidebar";

interface Notice {
  id: string
  message: string
  type: "info" | "warning" | "success"
  date: string
}

const demoNotices: Notice[] = [
  {
    id: "1",
    message: "New order #ORD-5523 has been placed",
    type: "info",
    date: "Just now",
  },
  {
    id: "2",
    message: "Inventory alert: 'Wireless Headphones' is running low on stock",
    type: "warning",
    date: "2 hours ago",
  },
  {
    id: "3",
    message: "System update scheduled for tonight at 2:00 AM",
    type: "info",
    date: "5 hours ago",
  },
  {
    id: "4",
    message: "Monthly sales report is now available",
    type: "success",
    date: "Yesterday",
  },
]

export function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [notices, setNotices] = useState<Notice[]>(demoNotices)
  const [hasUnread, setHasUnread] = useState(true)

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasUnread(false)
    }
  }

  const removeNotice = (id: string) => {
    setNotices(notices.filter((notice) => notice.id !== id))
  }

  const getNoticeColor = (type: Notice["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200"
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "success":
        return "bg-green-50 text-green-800 border-green-200"
      default:
        return "bg-gray-50 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <MobileSidebar />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-sm font-medium"
            onClick={toggleNotifications}
          >
            <Bell className={cn("h-4 w-4", hasUnread && "text-primary")} />
            <span className="hidden sm:inline">Notifications</span>
            {hasUnread && <span className="flex h-2 w-2 rounded-full bg-primary"></span>}
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <UserNav />
        </div>
      </div>

      {/* Notification Panel */}
      <div
        className={cn(
          "absolute w-full bg-white border-b shadow-md z-10 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Recent Notifications</h3>
            <Button variant="ghost" size="sm" className="text-xs">
              Mark all as read
            </Button>
          </div>

          {notices.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={cn("flex items-start justify-between p-3 rounded-md border", getNoticeColor(notice.type))}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{notice.message}</p>
                      <p className="text-xs opacity-70 mt-1">{notice.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeNotice(notice.id)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No new notifications</p>
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" className="w-full">
              View all notifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

