"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, ShoppingBag, Users } from "lucide-react"

export function SalesOverview() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: DollarSign,
      change: "+20.1%",
      trend: "up",
    },
    {
      title: "Orders",
      value: "356",
      icon: ShoppingBag,
      change: "+12.2%",
      trend: "up",
    },
    {
      title: "New Customers",
      value: "42",
      icon: Users,
      change: "+5.4%",
      trend: "up",
    },
    {
      title: "Refunds",
      value: "$642.00",
      icon: DollarSign,
      change: "-2.1%",
      trend: "down",
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="border-t-4 border-t-primary/70">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {stat.trend === "up" ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

