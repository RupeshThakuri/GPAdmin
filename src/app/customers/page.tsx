import { DashboardHeader } from "@/components/Dashboard/dashboard-header";
import { DashboardShell } from "@/components/Dashboard/dashboard-shell";
import { CustomersTable } from "@/components/Customer/customers-table";

export default function page() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Customers" text="Manage your customer accounts" />
      <CustomersTable />
    </DashboardShell>
  )
}

