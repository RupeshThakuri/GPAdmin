import { DashboardHeader } from "@/components/Dashboard/dashboard-header";
import { DashboardShell } from "@/components/Dashboard/dashboard-shell";
import { OrdersTable } from "@/components/Orders/orders-table";

export default function OrdersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Orders" text="Manage your customer orders" />
      <OrdersTable />
    </DashboardShell>
  )
}
