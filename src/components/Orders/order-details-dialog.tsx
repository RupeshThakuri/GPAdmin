"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Truck, CreditCard, Calendar, User, Clock, FileText, Printer, Download } from "lucide-react"

interface OrderDetailsDialogProps {
  order: {
    id: string
    customer: string
    status: "pending" | "processing" | "completed" | "cancelled"
    date: string
    total: string
    email: string
    address: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock order items data
const orderItems = [
  {
    id: "ITEM-001",
    name: "Wireless Headphones",
    sku: "WH-100-BLK",
    price: "$129.99",
    quantity: 1,
    total: "$129.99",
  },
  {
    id: "ITEM-002",
    name: "Phone Case",
    sku: "PC-200-RED",
    price: "$19.99",
    quantity: 2,
    total: "$39.98",
  },
  {
    id: "ITEM-003",
    name: "USB-C Cable",
    sku: "USB-C-100",
    price: "$12.99",
    quantity: 1,
    total: "$12.99",
  },
]

// Mock payment details
const paymentDetails = {
  method: "Credit Card",
  cardType: "Visa",
  cardNumber: "**** **** **** 4242",
  billingAddress: "123 Main St, City, Country",
}

// Mock shipping details
const shippingDetails = {
  method: "Standard Shipping",
  trackingNumber: "TRK123456789",
  estimatedDelivery: "2023-04-28",
  shippingAddress: "123 Main St, City, Country",
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details")

  const getStatusColor = (status: "pending" | "processing" | "completed" | "cancelled") => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  // Calculate order summary
  const subtotal = orderItems.reduce((sum, item) => sum + Number.parseFloat(item.total.replace("$", "")), 0)
  const shipping = 10.0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <DialogTitle className="text-xl">Order {order.id}</DialogTitle>
              <DialogDescription>
                Placed on {order.date} by {order.customer}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          {/* Order Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {order.customer}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {order.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> +1 (555) 123-4567
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Order Placed</span>
                    </div>
                    <span>{order.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Processing Started</span>
                    </div>
                    <span>{order.date}</span>
                  </div>
                  {order.status === "completed" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Completed</span>
                      </div>
                      <span>2023-04-25</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Items Tab */}
          <TabsContent value="items">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Package className="mr-2 h-4 w-4 text-primary" />
                  Order Items
                </CardTitle>
                <CardDescription>{orderItems.length} items in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell className="text-right">{item.price}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-primary" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium w-32">Payment Method:</span>
                    <span>{paymentDetails.method}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-32">Card Type:</span>
                    <span>{paymentDetails.cardType}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-32">Card Number:</span>
                    <span>{paymentDetails.cardNumber}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Billing Address</h4>
                  <p className="text-sm text-muted-foreground">{paymentDetails.billingAddress}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Truck className="mr-2 h-4 w-4 text-primary" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium w-40">Shipping Method:</span>
                    <span>{shippingDetails.method}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-40">Tracking Number:</span>
                    <span>{shippingDetails.trackingNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-40">Estimated Delivery:</span>
                    <span>{shippingDetails.estimatedDelivery}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">{shippingDetails.shippingAddress}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:mr-auto" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print Order
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

