import type { Control } from "react-hook-form"
import type { z } from "zod"
import type { vendorFormSchema } from "@/schemas/vendorSchema"
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

type VendorFormValues = z.infer<typeof vendorFormSchema>

interface VendorPermissionsFormProps {
  control: Control<VendorFormValues>
}

export function VendorPermissionsForm({ control }: VendorPermissionsFormProps) {
  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-3">Dashboard Permissions</h3>
        <div className="space-y-3">
          <FormField
            control={control}
            name="permissions.dashboard.view"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>View Dashboard</FormLabel>
                  <FormDescription>Allow vendor to access the main dashboard</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.dashboard.analytics"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Analytics Access</FormLabel>
                  <FormDescription>Allow vendor to view sales and performance analytics</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.dashboard.reports"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Reports Access</FormLabel>
                  <FormDescription>Allow vendor to generate and view reports</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.dashboard.notifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Notifications</FormLabel>
                  <FormDescription>Allow vendor to manage system notifications</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.dashboard.settings"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Settings Access</FormLabel>
                  <FormDescription>Allow vendor to modify account settings</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-3">Products Management</h3>
        <div className="space-y-3">
          <FormField
            control={control}
            name="permissions.products.view"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>View Products</FormLabel>
                  <FormDescription>Allow vendor to view products</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.products.add"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Add Products</FormLabel>
                  <FormDescription>Allow vendor to add new products</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.products.edit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Edit Products</FormLabel>
                  <FormDescription>Allow vendor to edit their products</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.products.delete"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Delete Products</FormLabel>
                  <FormDescription>Allow vendor to delete their products</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-3">Orders & Customers</h3>
        <div className="space-y-3">
          <FormField
            control={control}
            name="permissions.orders.view"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>View Orders</FormLabel>
                  <FormDescription>Allow vendor to view orders for their products</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.orders.process"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Process Orders</FormLabel>
                  <FormDescription>Allow vendor to process and fulfill orders</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.orders.cancel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Cancel Orders</FormLabel>
                  <FormDescription>Allow vendor to cancel orders</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.customers.view"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>View Customers</FormLabel>
                  <FormDescription>Allow vendor to view customer information</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.customers.contact"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Contact Customers</FormLabel>
                  <FormDescription>Allow vendor to contact customers</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-3">Content Management</h3>
        <div className="space-y-3">
          <FormField
            control={control}
            name="permissions.cms.view"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>View CMS</FormLabel>
                  <FormDescription>Allow vendor to view CMS content</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="permissions.cms.edit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Edit CMS</FormLabel>
                  <FormDescription>Allow vendor to edit CMS content</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
