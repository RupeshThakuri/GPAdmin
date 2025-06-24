"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { ChevronLeft, ChevronRight, Download, MoreHorizontal, Plus, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { CustomerProfileDialog } from "./customer-profile-dialog"
import { CustomerOrdersDialog } from "./customer-orders-dialog"
import { EditCustomerDialog } from "./edit-customer-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { AddCustomerDialog } from "./add-customer-dialog"
import { downloadCSV } from "@/lib/export-utils"

interface Customer {
  id: string
  name: string
  email: string
  orders: number
  spent: string
  lastOrder: string
  avatar?: string
}

const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
    orders: 12,
    spent: "$1,245.89",
    lastOrder: "2023-04-23",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane@example.com",
    orders: 8,
    spent: "$986.50",
    lastOrder: "2023-04-20",
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    email: "robert@example.com",
    orders: 5,
    spent: "$765.25",
    lastOrder: "2023-04-18",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily@example.com",
    orders: 3,
    spent: "$542.75",
    lastOrder: "2023-04-15",
  },
  {
    id: "CUST-005",
    name: "Michael Wilson",
    email: "michael@example.com",
    orders: 7,
    spent: "$321.30",
    lastOrder: "2023-04-12",
  },
  {
    id: "CUST-006",
    name: "Sarah Brown",
    email: "sarah@example.com",
    orders: 4,
    spent: "$654.20",
    lastOrder: "2023-04-10",
  },
  {
    id: "CUST-007",
    name: "David Miller",
    email: "david@example.com",
    orders: 9,
    spent: "$879.75",
    lastOrder: "2023-04-08",
  },
  {
    id: "CUST-008",
    name: "Jennifer Taylor",
    email: "jennifer@example.com",
    orders: 6,
    spent: "$432.60",
    lastOrder: "2023-04-05",
  },
  {
    id: "CUST-009",
    name: "James Anderson",
    email: "james@example.com",
    orders: 11,
    spent: "$1,098.40",
    lastOrder: "2023-04-03",
  },
  {
    id: "CUST-010",
    name: "Lisa Thomas",
    email: "lisa@example.com",
    orders: 2,
    spent: "$187.25",
    lastOrder: "2023-04-01",
  },
]

export function CustomersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const itemsPerPage = 5

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsProfileOpen(true)
  }

  const handleViewOrders = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsOrdersOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteOpen(true)
  }

  const handleAddCustomer = () => {
    setIsAddOpen(true)
  }

  const handleExport = () => {
    // Format the data for export
    const exportData = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      orders: customer.orders,
      spent: customer.spent,
      lastOrder: customer.lastOrder,
    }))

    // Download as CSV
    downloadCSV(exportData, "customers-export")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Customers</CardTitle>
              <CardDescription>Manage your customer accounts</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={handleAddCustomer}>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-full sm:w-[300px]"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Orders</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead className="hidden md:table-cell">Last Order</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.avatar} alt={customer.name} />
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{customer.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{customer.orders}</TableCell>
                    <TableCell>{customer.spent}</TableCell>
                    <TableCell className="hidden md:table-cell">{customer.lastOrder}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewProfile(customer)}>View profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewOrders(customer)}>View orders</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                            Edit customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteCustomer(customer)} className="text-red-600">
                            Delete customer
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} customers
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

      {/* Customer Profile Dialog */}
      {selectedCustomer && (
        <CustomerProfileDialog customer={selectedCustomer} open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      )}

      {/* Customer Orders Dialog */}
      {selectedCustomer && (
        <CustomerOrdersDialog customer={selectedCustomer} open={isOrdersOpen} onOpenChange={setIsOrdersOpen} />
      )}

      {/* Edit Customer Dialog */}
      {selectedCustomer && (
        <EditCustomerDialog customer={selectedCustomer} open={isEditOpen} onOpenChange={setIsEditOpen} />
      )}

      {/* Delete Customer Dialog */}
      {selectedCustomer && (
        <DeleteConfirmationDialog
          title="Delete Customer"
          description={`Are you sure you want to delete ${selectedCustomer.name}? This action cannot be undone.`}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={() => {
            console.log(`Deleting customer: ${selectedCustomer.id}`)
            setIsDeleteOpen(false)
          }}
        />
      )}

      {/* Add Customer Dialog */}
      <AddCustomerDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </>
  )
}

