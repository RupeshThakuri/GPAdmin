import { DashboardHeader } from "@/components/Dashboard/dashboard-header"
import { DashboardShell } from "@/components/Dashboard/dashboard-shell"
import { VendorsTable } from "@/components/Vendors/vendors-table"

export default function VendorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Vendor Management" text="Manage your store vendors and their access" />
      <VendorsTable />
    </DashboardShell>
  )
}