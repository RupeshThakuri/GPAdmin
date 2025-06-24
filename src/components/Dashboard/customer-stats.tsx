"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Customer {
  name: string
  email: string
  spent: string
  avatar?: string
}

const customers: Customer[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    spent: "$1,245.89",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    spent: "$986.50",
  },
  {
    name: "Robert Johnson",
    email: "robert@example.com",
    spent: "$765.25",
  },
  {
    name: "Emily Davis",
    email: "emily@example.com",
    spent: "$542.75",
  },
  {
    name: "Michael Wilson",
    email: "michael@example.com",
    spent: "$321.30",
  },
]

export function CustomerStats() {
  return (
    <Card className="h-full border-t-4 border-t-primary/70">
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>Your highest spending customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer, index) => (
            <div key={index} className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-xs text-muted-foreground">{customer.email}</span>
                </div>
              </div>
              <span className="font-medium">{customer.spent}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

