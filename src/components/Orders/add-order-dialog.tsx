"use client"

import { useState,useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

interface AddOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  customer: z.string().min(1, {
    message: "Please select a customer.",
  }),
  status: z.enum(["pending", "processing", "completed", "cancelled"], {
    required_error: "Please select a status.",
  }),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer", "cash"], {
    required_error: "Please select a payment method.",
  }),
  shippingMethod: z.enum(["standard", "express", "overnight", "pickup"], {
    required_error: "Please select a shipping method.",
  }),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        product: z.string().min(1, {
          message: "Please select a product.",
        }),
        quantity: z.coerce.number().min(1, {
          message: "Quantity must be at least 1.",
        }),
        price: z.string().min(1, {
          message: "Please enter a price.",
        }),
      }),
    )
    .min(1, {
      message: "Please add at least one item.",
    }),
  billingAddress: z.string().min(5, {
    message: "Billing address must be at least 5 characters.",
  }),
  shippingAddress: z.string().min(5, {
    message: "Shipping address must be at least 5 characters.",
  }),
  sameAsShipping: z.boolean().default(false),
})

export function AddOrderDialog({ open, onOpenChange }: AddOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: "",
      status: "pending",
      paymentMethod: "credit_card",
      shippingMethod: "standard",
      notes: "",
      items: [{ product: "", quantity: 1, price: "" }],
      billingAddress: "",
      shippingAddress: "",
      sameAsShipping: false,
    },
  })

  // Watch for sameAsShipping changes
  const sameAsShipping = form.watch("sameAsShipping")
  const shippingAddress = form.watch("shippingAddress")
  const items = form.watch("items")

  // Calculate the total order amount
  const calculateOrderTotal = (items: { product: string; quantity: number; price: string }[]) => {
    return items
      .reduce((total, item) => {
        const price = Number.parseFloat(item.price.replace("$", "").replace(",", "")) || 0
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  // Update billing address when sameAsShipping changes
  useEffect(() => {
    if (sameAsShipping) {
      form.setValue("billingAddress", shippingAddress)
    }
  }, [sameAsShipping, shippingAddress, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Adding order:", values)
      setIsSubmitting(false)
      onOpenChange(false)
      form.reset()
    }, 1000)
  }

  const addItem = () => {
    const currentItems = form.getValues("items")
    form.setValue("items", [...currentItems, { product: "", quantity: 1, price: "" }])
  }

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items")
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index),
      )
    }
  }

  // Mock data for dropdowns
  const customers = [
    { id: "CUST-001", name: "John Doe" },
    { id: "CUST-002", name: "Jane Smith" },
    { id: "CUST-003", name: "Robert Johnson" },
    { id: "CUST-004", name: "Emily Davis" },
    { id: "CUST-005", name: "Michael Wilson" },
  ]

  const products = [
    { id: "PROD-001", name: "Wireless Headphones", price: "129.99" },
    { id: "PROD-002", name: "Smart Watch", price: "199.50" },
    { id: "PROD-003", name: "Bluetooth Speaker", price: "89.00" },
    { id: "PROD-004", name: "Laptop Sleeve", price: "29.99" },
    { id: "PROD-005", name: "Phone Case", price: "19.99" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>Create a new customer order</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-base font-medium mb-2">Order Items</h3>
              <div className="space-y-4">
                {form.getValues("items").map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-4 md:grid-cols-[2fr,1fr,1fr,auto] items-end border p-3 rounded-md"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.product`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              // Auto-fill price based on selected product
                              const product = products.find((p) => p.id === value)
                              if (product) {
                                form.setValue(`items.${index}.price`, product.price)
                              }
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => removeItem(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-md">
              <div className="flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>${calculateOrderTotal(items)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Shipping:</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Tax (8%):</span>
                <span>${(Number.parseFloat(calculateOrderTotal(items)) * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${(Number.parseFloat(calculateOrderTotal(items)) * 1.08 + 10).toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shipping method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard Shipping</SelectItem>
                        <SelectItem value="express">Express Shipping</SelectItem>
                        <SelectItem value="overnight">Overnight Shipping</SelectItem>
                        <SelectItem value="pickup">Store Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter shipping address" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sameAsShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Billing address same as shipping</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem className={sameAsShipping ? "opacity-50" : ""}>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter billing address"
                      className="resize-none"
                      {...field}
                      disabled={sameAsShipping}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any special instructions or notes for this order"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Include any special requirements or delivery instructions</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Order"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

