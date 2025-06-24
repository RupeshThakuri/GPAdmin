import { DashboardShell } from "@/components/Dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/Dashboard/dashboard-header"
import { ProfileForm } from "@/components/Profile/profile-form"

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Profile" text="Manage your account information" />
      <ProfileForm />
    </DashboardShell>
  )
}

