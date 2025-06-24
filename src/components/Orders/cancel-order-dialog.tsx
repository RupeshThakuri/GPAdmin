"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CancelOrderDialogProps {
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

const formSchema = z.object({
  reason: z.string().min(5, {
    message: "Cancellation reason must be at least 5 characters.",
  }),
  notifyCustomer: z.boolean().default(true),
})

export function CancelOrderDialog({ order, open, onOpenChange }: CancelOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      notifyCustomer: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Cancelling order:", values)
      setIsSubmitting(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Cancel Order
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order {order.id} for {order.customer}?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Order ID:</span>
            <span className="text-sm">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Customer:</span>
            <span className="text-sm">{order.customer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Date:</span>
            <span className="text-sm">{order.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Total:</span>
            <span className="text-sm">{order.total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {order.status}
            </Badge>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800 mb-4">
          <p className="font-medium">Warning:</p>
          <p>Cancelling this order cannot be undone. The customer will be notified if selected.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a reason for cancellation"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyCustomer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Notify customer about cancellation</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Go Back
              </Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

