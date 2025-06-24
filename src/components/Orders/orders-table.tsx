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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, MoreHorizontal, Search } from "lucide-react"
import { OrderDetailsDialog } from "./order-details-dialog"
import { UpdateOrderStatusDialog } from "./update-order-status-dialog"
import { ContactCustomerDialog } from "./contact-customer-dailog"
import { CancelOrderDialog } from "./cancel-order-dialog"
import { downloadCSV } from "@/lib/export-utils"
import { AddOrderDialog } from "./add-order-dialog"

type OrderStatus = "pending" | "processing" | "completed" | "cancelled"

interface Order {
  id: string
  customer: string
  status: OrderStatus
  date: string
  total: string
  email: string
  address: string
}

const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    status: "completed",
    date: "2023-04-23",
    total: "$125.99",
    email: "john@example.com",
    address: "123 Main St, City, Country",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    status: "processing",
    date: "2023-04-22",
    total: "$89.50",
    email: "jane@example.com",
    address: "456 Oak Ave, Town, Country",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    status: "pending",
    date: "2023-04-22",
    total: "$254.00",
    email: "robert@example.com",
    address: "789 Pine Rd, Village, Country",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    status: "cancelled",
    date: "2023-04-21",
    total: "$42.75",
    email: "emily@example.com",
    address: "101 Elm Blvd, City, Country",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    status: "completed",
    date: "2023-04-20",
    total: "$178.25",
    email: "michael@example.com",
    address: "202 Maple Dr, Town, Country",
  },
  {
    id: "ORD-006",
    customer: "Sarah Brown",
    status: "processing",
    date: "2023-04-19",
    total: "$65.30",
    email: "sarah@example.com",
    address: "303 Cedar Ln, Village, Country",
  },
  {
    id: "ORD-007",
    customer: "David Miller",
    status: "completed",
    date: "2023-04-18",
    total: "$112.75",
    email: "david@example.com",
    address: "404 Birch St, City, Country",
  },
  {
    id: "ORD-008",
    customer: "Jennifer Taylor",
    status: "pending",
    date: "2023-04-17",
    total: "$89.99",
    email: "jennifer@example.com",
    address: "505 Walnut Ave, Town, Country",
  },
  {
    id: "ORD-009",
    customer: "James Anderson",
    status: "completed",
    date: "2023-04-16",
    total: "$145.50",
    email: "james@example.com",
    address: "606 Spruce Rd, Village, Country",
  },
  {
    id: "ORD-010",
    customer: "Lisa Thomas",
    status: "cancelled",
    date: "2023-04-15",
    total: "$32.25",
    email: "lisa@example.com",
    address: "707 Fir Blvd, City, Country",
  },
]

export function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const itemsPerPage = 5

  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || order.status === statusFilter),
  )

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order)
    setIsStatusDialogOpen(true)
  }

  const handleContactCustomer = (order: Order) => {
    setSelectedOrder(order)
    setIsContactDialogOpen(true)
  }

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsCancelDialogOpen(true)
  }

  const handleExport = () => {
    // Format the data for export
    const exportData = orders.map((order) => ({
      id: order.id,
      customer: order.customer,
      status: order.status,
      date: order.date,
      total: order.total,
      email: order.email,
    }))

    // Download as CSV
    downloadCSV(exportData, "orders-export")
  }

  const handleAddOrder = () => {
    setIsAddOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Manage and process customer orders</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={handleAddOrder}>
                Add Order
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-full sm:w-[300px]"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                {paginatedOrders.map((order) => (
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
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>Update status</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleContactCustomer(order)}>
                            Contact customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleCancelOrder(order)}
                            className="text-red-600"
                            disabled={order.status === "cancelled" || order.status === "completed"}
                          >
                            Cancel order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
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
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog order={selectedOrder} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}

      {/* Update Status Dialog */}
      {selectedOrder && (
        <UpdateOrderStatusDialog order={selectedOrder} open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen} />
      )}

      {/* Contact Customer Dialog */}
      {selectedOrder && (
        <ContactCustomerDialog order={selectedOrder} open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
      )}

      {/* Cancel Order Dialog */}
      {selectedOrder && (
        <CancelOrderDialog order={selectedOrder} open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen} />
      )}

      {/* Add Order Dialog */}
      <AddOrderDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </>
  )
}

