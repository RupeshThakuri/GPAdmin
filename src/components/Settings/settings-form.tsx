"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

const storeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
})

const notificationFormSchema = z.object({
  orderConfirmation: z.boolean().default(true),
  orderShipped: z.boolean().default(true),
  orderDelivered: z.boolean().default(true),
  lowStock: z.boolean().default(true),
  newCustomer: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
})

type StoreFormValues = z.infer<typeof storeFormSchema>
type NotificationFormValues = z.infer<typeof notificationFormSchema>

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState("store")
  const [isSaving, setIsSaving] = useState(false)

  const storeForm = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "My E-commerce Store",
      description: "Selling high-quality products online.",
      address: "123 Main Street",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "United States",
      currency: "usd",
    },
  })

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      lowStock: true,
      newCustomer: true,
      marketingEmails: false,
    },
  })

  function onStoreSubmit(data: StoreFormValues) {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
    }, 1000)
  }

  function onNotificationSubmit(data: NotificationFormValues) {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
    }, 1000)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="store">Store Information</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
      </TabsList>
      <TabsContent value="store" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Manage your store details and location</CardDescription>
          </CardHeader>
          <Form {...storeForm}>
            <form onSubmit={storeForm.handleSubmit(onStoreSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={storeForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Store" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={storeForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="jpy">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={storeForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell customers about your store" className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>This will be displayed on your store's homepage.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={storeForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={storeForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={storeForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={storeForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP / Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={storeForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage your email notification preferences</CardDescription>
          </CardHeader>
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={notificationForm.control}
                  name="orderConfirmation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Order Confirmation</FormLabel>
                        <FormDescription>Receive emails when a new order is placed</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="orderShipped"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Order Shipped</FormLabel>
                        <FormDescription>Receive emails when an order is shipped</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="orderDelivered"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Order Delivered</FormLabel>
                        <FormDescription>Receive emails when an order is delivered</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="lowStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Low Stock Alerts</FormLabel>
                        <FormDescription>Receive emails when product stock is low</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="newCustomer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">New Customer Signup</FormLabel>
                        <FormDescription>Receive emails when a new customer registers</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Marketing Emails</FormLabel>
                        <FormDescription>Receive emails about new features and promotions</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="payment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Configure your store's payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Payment settings will be available soon.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="shipping" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Options</CardTitle>
            <CardDescription>Configure your store's shipping methods</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Shipping settings will be available soon.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

