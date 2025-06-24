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
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react"
import { downloadCSV } from "@/lib/export-utils"

interface CustomerOrdersDialogProps {
  customer: {
    id: string
    name: string
    email: string
    orders: number
    spent: string
    lastOrder: string
    avatar?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock orders data
const customerOrders = [
  {
    id: "ORD-001",
    date: "2023-04-23",
    total: "$125.99",
    status: "completed",
    items: 3,
  },
  {
    id: "ORD-002",
    date: "2023-03-15",
    total: "$89.50",
    status: "completed",
    items: 2,
  },
  {
    id: "ORD-003",
    date: "2023-02-28",
    total: "$254.00",
    status: "completed",
    items: 4,
  },
  {
    id: "ORD-004",
    date: "2023-01-10",
    total: "$42.75",
    status: "completed",
    items: 1,
  },
  {
    id: "ORD-005",
    date: "2022-12-05",
    total: "$178.25",
    status: "completed",
    items: 3,
  },
  {
    id: "ORD-006",
    date: "2022-11-22",
    total: "$65.30",
    status: "completed",
    items: 2,
  },
  {
    id: "ORD-007",
    date: "2022-10-18",
    total: "$112.75",
    status: "completed",
    items: 2,
  },
  {
    id: "ORD-008",
    date: "2022-09-03",
    total: "$89.99",
    status: "completed",
    items: 1,
  },
]

export function CustomerOrdersDialog({ customer, open, onOpenChange }: CustomerOrdersDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredOrders = customerOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || order.status === statusFilter),
  )

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
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

  const handleExport = () => {
    // Format the data for export
    const exportData = customerOrders.map((order) => ({
      id: order.id,
      date: order.date,
      total: order.total,
      status: order.status,
      items: order.items,
    }))

    // Download as CSV
    downloadCSV(exportData, `${customer.name.replace(/\s+/g, "-")}-orders-export`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Orders for {customer.name}</DialogTitle>
          <DialogDescription>Viewing all orders for customer {customer.id}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-full sm:w-[250px]"
            />
          </div>
          <div className="flex items-center gap-2">
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
            <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

