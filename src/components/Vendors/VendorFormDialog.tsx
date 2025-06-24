"use client"

import { useState, useEffect } from "react"
import type { Vendor } from "@/types/vendor"
import { vendorFormSchema } from "@/schemas/vendorSchema"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VendorDetailsForm } from "@/components/Vendors/forms/VendorDetailsForm"
import { VendorPermissionsForm } from "@/components/Vendors/forms/VendorPermissionsForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Form } from "@/components/ui/form"

interface VendorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vendor: Vendor | null
  onSave: (vendor: Vendor) => void
}

type VendorFormValues = z.infer<typeof vendorFormSchema>

export function VendorFormDialog({ open, onOpenChange, vendor, onSave }: VendorFormDialogProps) {
  const [activeTab, setActiveTab] = useState("details")

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      created_at: "",
      status: "pending",
      commission: 15,
      permissions: {
        dashboard: {
          view: false,
          analytics: false,
          reports: false,
          notifications: false,
          settings: false,
        },
        products: {
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        orders: {
          view: false,
          process: false,
          cancel: false,
        },
        customers: {
          view: false,
          contact: false,
        },
        cms: {
          view: false,
          edit: false,
        },
      },
    },
  })

  // Reset form when vendor changes
  useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor.name,
        contact_person: vendor.contact_person,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        status: vendor.status,
        commission: vendor.commission,
        created_at: vendor.created_at,
        permissions: vendor.permissions,
      })
    } else {
      form.reset({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        status: "pending",
        commission: 15,
        permissions: {
          dashboard: {
            view: false,
            analytics: false,
            reports: false,
            notifications: false,
            settings: false,
          },
          products: {
            view: false,
            add: false,
            edit: false,
            delete: false,
          },
          orders: {
            view: false,
            process: false,
            cancel: false,
          },
          customers: {
            view: false,
            contact: false,
          },
          cms: {
            view: false,
            edit: false,
          },
        },
      })
    }
  }, [vendor, form])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (values: VendorFormValues) => {
    setIsSubmitting(true)
    try {
      const newVendor: Vendor = {
        id: vendor?.id || `V${new Date().getTime()}`,
        ...values,
        created_at: vendor?.created_at || new Date().toISOString().split("T")[0],
      }

      const method = vendor ? "PUT" : "POST"
      const url = vendor ? `http://127.0.0.1:8000/api/vendors/${vendor.id}/` : "http://127.0.0.1:8000/api/vendors/";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVendor),
      })

      if (!response.ok) {
        throw new Error("Failed to save vendor")
      }

      const savedVendor = await response.json()
      onSave(savedVendor)
      form.reset()
      setActiveTab("details")
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving vendor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset()
          setActiveTab("details")
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{vendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
          <DialogDescription>
            Fill in the details to {vendor ? "update" : "add"} a vendor to your store.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent
                  value="details"
                  className="h-[400px] overflow-y-auto pt-4 space-y-4 pb-4 pr-2 scrollbar-thin"
                >
                  <VendorDetailsForm control={form.control} />
                </TabsContent>

                <TabsContent value="permissions" className="h-[400px] overflow-y-auto pt-4 pb-4 pr-2 scrollbar-thin">
                  <VendorPermissionsForm control={form.control} />
                </TabsContent>
              </div>

              <div className="flex justify-between pt-4 mt-2 border-t">
                {activeTab === "details" && (
                  <>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("permissions")}>
                      Next: Permissions
                    </Button>
                  </>
                )}
                {activeTab === "permissions" && (
                  <>
                    <Button type="button" onClick={() => setActiveTab("details")}>
                      Back to Details
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {vendor ? "Update Vendor" : "Add Vendor"}
                    </Button>
                  </>
                )}
              </div>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
