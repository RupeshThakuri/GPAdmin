import { DashboardHeader } from "@/components/Dashboard/dashboard-header"
import { DashboardShell } from "@/components/Dashboard/dashboard-shell"
import { NotificationsManager } from "@/components/Notification/notifications-manager"
export default function NotificationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Notifications" text="Manage user notifications" />
      <NotificationsManager />
    </DashboardShell>
  )
}

