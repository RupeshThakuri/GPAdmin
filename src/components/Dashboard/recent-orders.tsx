"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"

type OrderStatus = "pending" | "processing" | "completed" | "cancelled"

interface Order {
  id: string
  customer: string
  status: OrderStatus
  date: string
  total: string
}

const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    status: "completed",
    date: "2023-04-23",
    total: "$125.99",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    status: "processing",
    date: "2023-04-22",
    total: "$89.50",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    status: "pending",
    date: "2023-04-22",
    total: "$254.00",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    status: "cancelled",
    date: "2023-04-21",
    total: "$42.75",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    status: "completed",
    date: "2023-04-20",
    total: "$178.25",
  },
]

export function RecentOrders() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: OrderStatus) => {
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

  return (
    <Card className="col-span-2 border-t-4 border-t-primary/70">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Manage your recent customer orders</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full md:w-[300px]"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Update status</DropdownMenuItem>
                        <DropdownMenuItem>Contact customer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

