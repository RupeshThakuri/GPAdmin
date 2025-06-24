"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notice {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  date: string
}

const initialNotices: Notice[] = [
  {
    id: "1",
    title: "System Maintenance",
    message:
      "The system will be undergoing maintenance on Sunday, March 24th from 2:00 AM to 4:00 AM EST. Some features may be unavailable during this time.",
    type: "info",
    date: "2023-03-20",
  },
  {
    id: "2",
    title: "Payment Processing Issue",
    message:
      "We're currently experiencing issues with payment processing through Stripe. Our team is working to resolve this as quickly as possible.",
    type: "warning",
    date: "2023-03-19",
  },
  {
    id: "3",
    title: "New Feature Released",
    message:
      "We've just released our new inventory management system! Check out the documentation to learn more about the new features.",
    type: "success",
    date: "2023-03-18",
  },
]

export function NoticeSection() {
  const [notices, setNotices] = useState<Notice[]>(initialNotices)

  const dismissNotice = (id: string) => {
    setNotices(notices.filter((notice) => notice.id !== id))
  }

  const getNoticeIcon = (type: Notice["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getNoticeStyles = (type: Notice["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
    }
  }

  if (notices.length === 0) {
    return null
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle>Important Notices</CardTitle>
        <CardDescription>System announcements and important updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className={cn("relative rounded-md border p-4", getNoticeStyles(notice.type))}>
            <div className="flex items-start gap-4">
              {getNoticeIcon(notice.type)}
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-1">{notice.title}</h4>
                <p className="text-sm">{notice.message}</p>
                <p className="text-xs mt-2 text-muted-foreground">{notice.date}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2"
                onClick={() => dismissNotice(notice.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

