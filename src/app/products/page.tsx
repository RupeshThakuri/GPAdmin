'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // App Router version
import { useUser } from '@/components/context/UserContext';
import { DashboardHeader } from "@/components/Dashboard/dashboard-header";
import { DashboardShell } from "@/components/Dashboard/dashboard-shell";
import ProductsTable from '@/components/Products/product-table';

export default function ProductsPage() {
  // const { user, loading } = useUser();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!loading && user?.role !== 'admin') {
  //     router.push('/admin/login');
  //   }
  // }, [loading, user, router]);

  // if (loading || user?.role !== 'admin') {
  //   return <p>Loading...</p>; // or a spinner
  // }

  return (
    <DashboardShell>
      <DashboardHeader heading="Products" text="Manage your product inventory" />
      <ProductsTable />
    </DashboardShell>
  );
}
