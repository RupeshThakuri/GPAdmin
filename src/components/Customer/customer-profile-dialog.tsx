"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Clock, Edit } from "lucide-react"

interface CustomerProfileDialogProps {
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

// Mock customer data
const customerDetails = {
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, CA 12345, USA",
  dateJoined: "2022-01-15",
  lastLogin: "2023-04-22",
  status: "active",
  notes: "Prefers email communication. Interested in electronics and accessories.",
}

// Mock order history
const orderHistory = [
  {
    id: "ORD-001",
    date: "2023-04-23",
    total: "$125.99",
    status: "completed",
  },
  {
    id: "ORD-002",
    date: "2023-03-15",
    total: "$89.50",
    status: "completed",
  },
  {
    id: "ORD-003",
    date: "2023-02-28",
    total: "$254.00",
    status: "completed",
  },
  {
    id: "ORD-004",
    date: "2023-01-10",
    total: "$42.75",
    status: "completed",
  },
]

export function CustomerProfileDialog({ customer, open, onOpenChange }: CustomerProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="text-lg">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">{customer.name}</DialogTitle>
                <DialogDescription>Customer ID: {customer.id}</DialogDescription>
              </div>
            </div>
            <Button size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customerDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{customerDetails.address}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined: {customerDetails.dateJoined}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last login: {customerDetails.lastLogin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <span>Status: {customerDetails.status}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Customer Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                    <span className="text-2xl font-bold">{customer.orders}</span>
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <DollarSign className="h-8 w-8 text-primary mb-2" />
                    <span className="text-2xl font-bold">{customer.spent}</span>
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <span className="text-2xl font-bold">{customer.lastOrder}</span>
                    <span className="text-sm text-muted-foreground">Last Order</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {customerDetails.notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{customerDetails.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">{order.date}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{order.total}</div>
                          <div className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            {order.status}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">Placed order #ORD-001</div>
                      <div className="text-xs text-muted-foreground">2023-04-23 • 10:23 AM</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">Updated shipping address</div>
                      <div className="text-xs text-muted-foreground">2023-04-20 • 3:45 PM</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">Added item to wishlist</div>
                      <div className="text-xs text-muted-foreground">2023-04-18 • 9:12 AM</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Account created</div>
                      <div className="text-xs text-muted-foreground">2022-01-15 • 2:30 PM</div>
                    </div>
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

