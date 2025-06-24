"use client"

import { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { TableWrapper } from "./TableWrapper";
import { VendorFormDialog } from "./VendorFormDialog";
import { DeleteVendorDialog } from "./DeleteVendorDialog";
import { VendorActionMenu } from "./VendorActionMenu";
import { useVendorStore } from "./stores/vendorStore";
import { Vendor } from "@/types/vendor";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function VendorsTable() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);

  // Get store state and actions
  const {
    vendors,
    loading,
    error,
    fetchVendors,
    updateVendor,
    addVendor,
    removeVendor,
    toggleVendorStatus
  } = useVendorStore();

  const itemsPerPage = 5;

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading vendors",
        description: error,
      });
    }
  }, [error, toast]);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.contact_person && vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: Vendor["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const handleCreateVendor = () => {
    setEditingVendor(null);
    setDialogOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setDialogOpen(true);
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    setDeletingVendor(vendor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingVendor) {
      try {
        fetch(`http://127.0.0.1:8000/api/vendors/${deletingVendor.id}/`, { 
          method: "DELETE" 
        });
        removeVendor(deletingVendor.id); 
        toast({
          title: "Vendor deleted",
          description: "The vendor has been successfully deleted.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error deleting vendor",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleToggleVendorStatus = async (id: string) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/vendors/${id}/`,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: vendors.find(v => v.id === id)?.status === "active" ? "inactive" : "active" }),
      });

      await toggleVendorStatus(id);
      const vendor = vendors.find(v => v.id === id);
      toast({
        title: vendor?.status === "active" ? "Vendor activated" : "Vendor deactivated",
        description: `The vendor has been ${vendor?.status === "active" ? "activated" : "deactivated"}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleSaveVendor = async (vendor: Vendor) => {
    try {
      if (editingVendor) {
        await updateVendor(vendor);
        toast({
          title: "Vendor updated",
          description: "The vendor has been successfully updated.",
        });
      } else {
        await addVendor(vendor);
        toast({
          title: "Vendor created",
          description: "The vendor has been successfully created.",
        });
      }
      setDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: editingVendor ? "Error updating vendor" : "Error creating vendor",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  if (loading && vendors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Vendors</CardTitle>
              <CardDescription>Loading vendor data...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border-b">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>Manage vendors and their access to your store</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateVendor}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full sm:w-[300px]"
          />
        </div>

        <TableWrapper>
          {paginatedVendors.map((vendor) => (
            <div key={vendor.id} className="flex flex-col border-b p-4 last:border-0 md:hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground">{vendor.email}</p>
                </div>
                <VendorActionMenu
                  vendor={vendor}
                  onEdit={() => handleEditVendor(vendor)}
                  onDelete={() => handleDeleteVendor(vendor)}
                  onToggleStatus={() => handleToggleVendorStatus(vendor.id)}
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getStatusColor(vendor.status)}>
                  {vendor.status}
                </Badge>
                <span className="text-sm">{vendor.commission}%</span>
              </div>
              <div className="text-sm">
                <p>Contact: {vendor.contact_person || 'N/A'}</p>
                <p>Phone: {vendor.phone || 'N/A'}</p>
                <p>Joined: {vendor.created_at || 'N/A'}</p>
              </div>
            </div>
          ))}

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Vendor</th>
                  <th className="py-3 px-4 text-left font-medium">Contact</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Commission</th>
                  <th className="py-3 px-4 text-left font-medium">Join Date</th>
                  <th className="py-3 px-4 text-right w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-muted-foreground">{vendor.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div>{vendor.contact_person || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{vendor.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{vendor.commission}%</td>
                    <td className="py-3 px-4">
                      {vendor.created_at ? new Date(vendor.created_at).toISOString().slice(0, 10) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <VendorActionMenu
                        vendor={vendor}
                        onEdit={() => handleEditVendor(vendor)}
                        onDelete={() => handleDeleteVendor(vendor)}
                        onToggleStatus={() => handleToggleVendorStatus(vendor.id)}
                      />
                    </td>
                  </tr>
                ))}
                {paginatedVendors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="h-24 text-center text-muted-foreground">
                      {vendors.length === 0 ? "No vendors available" : "No matching vendors found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TableWrapper>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredVendors.length > 0 ? Math.min(filteredVendors.length, 1 + startIndex) : 0} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </CardContent>

      <VendorFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendor={editingVendor}
        onSave={handleSaveVendor}
      />

      <DeleteVendorDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        vendor={deletingVendor}
        onDelete={confirmDelete}
      />
    </Card>
  );
}