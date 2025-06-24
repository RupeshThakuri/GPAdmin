import { DashboardHeader } from "@/components/Dashboard/dashboard-header"
import { DashboardShell } from "@/components/Dashboard/dashboard-shell"
import { SettingsForm } from "@/components/Settings/settings-form"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your store settings" />
      <SettingsForm />
    </DashboardShell>
  )
}

