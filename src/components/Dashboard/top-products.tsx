"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  name: string
  sales: number
  stock: number
  status: "in-stock" | "low-stock" | "out-of-stock"
}

const products: Product[] = [
  {
    name: "Wireless Headphones",
    sales: 89,
    stock: 35,
    status: "in-stock",
  },
  {
    name: "Smart Watch",
    sales: 65,
    stock: 12,
    status: "low-stock",
  },
  {
    name: "Bluetooth Speaker",
    sales: 45,
    stock: 0,
    status: "out-of-stock",
  },
  {
    name: "Laptop Sleeve",
    sales: 32,
    stock: 23,
    status: "in-stock",
  },
  {
    name: "Phone Case",
    sales: 27,
    stock: 8,
    status: "low-stock",
  },
]

export function TopProducts() {
  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      case "out-of-stock":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  return (
    <Card className="h-full border-t-4 border-t-primary/70">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Your best selling products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center justify-between space-x-2">
              <div className="flex flex-col">
                <span className="font-medium">{product.name}</span>
                <span className="text-xs text-muted-foreground">{product.sales} sales</span>
              </div>
              <Badge variant="outline" className={getStatusColor(product.status)}>
                {product.status === "in-stock"
                  ? `${product.stock} in stock`
                  : product.status === "low-stock"
                    ? `${product.stock} left`
                    : "Out of stock"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

