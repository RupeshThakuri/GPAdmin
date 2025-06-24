"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Package, Tag, BarChart, ShoppingCart, Clock, Truck, Download, Share2, DollarSign } from "lucide-react"
import type { ProductFormValues } from "../../services/product-form-schema"

interface ProductDetailsDialogProps {
  product: ProductFormValues & { id: string }
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (product: ProductFormValues & { id: string }) => void
}

// Generate mock sales data
const generateSalesData = (stock: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((month) => {
    const baseSales = Math.max(5, Math.floor(stock / 10))
    const randomVariation = Math.floor(Math.random() * 10) - 5
    return {
      month,
      sales: Math.max(1, baseSales + randomVariation),
    }
  })
}

// Generate mock inventory history
const generateInventoryHistory = (stock: number) => {
  const today = new Date()
  const history = []

  history.push({
    date: today.toISOString().split("T")[0],
    action: "Current stock",
    quantity: stock,
    location: "Main Warehouse",
  })

  // Add some historical entries
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i * 7)

    history.push({
      date: date.toISOString().split("T")[0],
      action: i % 2 === 0 ? "Stock adjustment" : "Restock",
      quantity: i % 2 === 0 ? -Math.floor(Math.random() * 5) : Math.floor(Math.random() * 20) + 10,
      location: "Main Warehouse",
      order: i % 2 === 0 ? undefined : `PO-${1000 + i}`,
    })
  }

  return history
}

// Generate mock recent orders
const generateRecentOrders = () => {
  const today = new Date()
  const orders = []

  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i * 2)

    orders.push({
      id: `ORD-${String(1001 + i).padStart(4, "0")}`,
      date: date.toISOString().split("T")[0],
      quantity: Math.floor(Math.random() * 3) + 1,
      customer: `Customer ${i + 1}`,
      status: i === 0 ? "Processing" : i === 1 ? "Shipped" : "Delivered",
    })
  }

  return orders
}

// Generate mock sales statistics
const generateSalesStatistics = (price: number, stock: number) => {
  const totalSold = Math.max(20, stock * 2)
  const totalRevenue = totalSold * price
  const avgRating = (3.5 + Math.random() * 1.5).toFixed(1)
  const conversionRate = (Math.random() * 5 + 2).toFixed(1)

  return {
    totalSold,
    totalRevenue,
    avgRating,
    conversionRate,
  }
}

export function ProductDetailsDialog({ product, open, onOpenChange, onEdit }: ProductDetailsDialogProps) {
  const [salesData, setSalesData] = useState<any[]>([])
  const [inventoryHistory, setInventoryHistory] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [salesStatistics, setSalesStatistics] = useState<any>(null)

  useEffect(() => {
    if (open && product) {
      setSalesData(generateSalesData(product.inventory?.quantity || 0))
      setInventoryHistory(generateInventoryHistory(product.inventory?.quantity || 0))
      setRecentOrders(generateRecentOrders())
      setSalesStatistics(generateSalesStatistics(product.price, product.inventory?.quantity || 0))
    }
  }, [open, product])

  const getStockStatus = (quantity: number, lowThreshold = 10) => {
    if (quantity === 0) return { status: "out-of-stock", label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (quantity <= lowThreshold)
      return { status: "low-stock", label: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    return { status: "in-stock", label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  const stockStatus = getStockStatus(product.inventory?.quantity || 0, product.inventory?.lowStockThreshold || 10)

  // Calculate warehouse distribution
  const warehouseDistribution = [
    { name: "Main Warehouse", location: "New York", stock: Math.max(0, (product.inventory?.quantity || 0) - 5) },
    { name: "East Warehouse", location: "Boston", stock: Math.min(3, product.inventory?.quantity || 0) },
    { name: "Store Front", location: "Manhattan", stock: Math.min(2, product.inventory?.quantity || 0) },
  ]

  if (!product) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <DialogTitle className="text-xl">{product.name}</DialogTitle>
              <DialogDescription>
                SKU: {product.sku} • ID: {product.id}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button size="sm" className="gap-2" onClick={() => onEdit && onEdit(product)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-1/3">
                <div className="relative h-48 w-full overflow-hidden rounded-md border bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {product.images.slice(1, 4).map((image, index) => (
                      <div key={index} className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`${product.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {product.images.length > 4 && (
                      <div className="h-16 w-16 flex-shrink-0 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        +{product.images.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="lg:w-2/3 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Category:</span>
                          <span className="text-sm">{product.categories?.join(", ") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Brand:</span>
                          <span className="text-sm">{product.brand || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Status:</span>
                          <Badge variant="outline" className="text-xs">
                            {product.status || "draft"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Visibility:</span>
                          <span className="text-sm">{product.visibility || "visible"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Price:</span>
                          <span className="text-sm font-semibold">${product.price}</span>
                        </div>
                        {product.compareAtPrice && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Compare at:</span>
                            <span className="text-sm line-through text-gray-500">${product.compareAtPrice}</span>
                          </div>
                        )}
                        {product.discount && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Discount:</span>
                            <span className="text-sm text-green-600">{product.discount}% off</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Taxable:</span>
                          <span className="text-sm">{product.taxable ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {product.fullDescription || product.shortDescription || "No description available."}
                    </p>
                    {product.features && product.features.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">Features:</h4>
                        <ul className="text-sm space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-primary" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.tags && product.tags.length > 0 ? (
                      product.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Truck className="mr-2 h-4 w-4 text-primary" />
                    Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Weight:</span>
                    <span className="text-sm">
                      {product.shipping?.weight ? `${product.shipping.weight} ${product.shipping.weightUnit}` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Dimensions:</span>
                    <span className="text-sm">
                      {product.shipping?.dimensions?.length &&
                      product.shipping?.dimensions?.width &&
                      product.shipping?.dimensions?.height
                        ? `${product.shipping.dimensions.length} × ${product.shipping.dimensions.width} × ${product.shipping.dimensions.height} ${product.shipping.dimensions.unit}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Free shipping:</span>
                    <span className="text-sm">{product.shipping?.freeShipping ? "Yes" : "No"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Package className="mr-2 h-4 w-4 text-primary" />
                    Inventory Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center p-6 bg-primary/10 rounded-md">
                    <span className="text-4xl font-bold">{product.inventory?.quantity || 0}</span>
                    <span className="text-sm text-muted-foreground">Units in Stock</span>
                    <Badge variant="outline" className={`mt-2 ${stockStatus.color}`}>
                      {stockStatus.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Low Stock Threshold:</span>
                      <span className="text-sm">{product.inventory?.lowStockThreshold || 10} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Track Inventory:</span>
                      <span className="text-sm">{product.inventory?.trackInventory ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Backorders:</span>
                      <span className="text-sm">{product.inventory?.allowBackorders ? "Allowed" : "Not allowed"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Truck className="mr-2 h-4 w-4 text-primary" />
                    Warehouse Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {warehouseDistribution.map((warehouse, index) => (
                      <div
                        key={warehouse.name}
                        className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium text-sm">{warehouse.name}</div>
                          <div className="text-xs text-muted-foreground">{warehouse.location}</div>
                        </div>
                        <Badge variant="outline">{warehouse.stock} units</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  Inventory History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryHistory.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        {index < inventoryHistory.length - 1 && (
                          <div className="absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                        )}
                      </div>
                      <div className={index < inventoryHistory.length - 1 ? "pb-4" : ""}>
                        <div className="text-sm font-medium">
                          {item.action}: {item.quantity > 0 ? "+" : ""}
                          {item.quantity} units
                          {item.order && ` (${item.order})`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.date} • {item.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <BarChart className="mr-2 h-4 w-4 text-primary" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
                    {salesData.map((item) => (
                      <div key={item.month} className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-primary/80 rounded-t-md"
                          style={{ height: `${Math.max(item.sales * 6, 10)}px` }}
                        ></div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs">{item.month}</span>
                          <span className="text-xs font-medium">{item.sales}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4 text-primary" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentOrders.map((order, index) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium text-sm">{order.id}</div>
                          <div className="text-xs text-muted-foreground">{order.date}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {order.quantity} unit{order.quantity > 1 ? "s" : ""}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">{order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-primary" />
                  Sales Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <span className="text-2xl font-bold">{salesStatistics?.totalSold || 0}</span>
                    <span className="text-sm text-muted-foreground text-center">Total Units Sold</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <span className="text-2xl font-bold">${salesStatistics?.totalRevenue?.toLocaleString() || 0}</span>
                    <span className="text-sm text-muted-foreground text-center">Total Revenue</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <span className="text-2xl font-bold">{salesStatistics?.avgRating || 0}/5</span>
                    <span className="text-sm text-muted-foreground text-center">Average Rating</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <span className="text-2xl font-bold">{salesStatistics?.conversionRate || 0}%</span>
                    <span className="text-sm text-muted-foreground text-center">Conversion Rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
