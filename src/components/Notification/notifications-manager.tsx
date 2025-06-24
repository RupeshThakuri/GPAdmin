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
import { Switch } from "@/components/ui/switch"
import { AlertCircle, ChevronLeft, ChevronRight, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// With this custom toast implementation:
const useToast = () => {
  const showToast = (toast: { title: string; description: string; variant?: string }) => {
    // In a real app, this would show a toast notification
    console.log(`Toast: ${toast.title} - ${toast.description}`)
  }

  return { toast: showToast }
}

type NotificationType = "info" | "warning" | "success" | "error"
type TargetAudience = "all" | "new-users" | "returning-users"

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  targetAudience: TargetAudience
  isActive: boolean
  date: string
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  message: z.string().min(5, { message: "Message must be at least 5 characters." }),
  type: z.enum(["info", "warning", "success", "error"] as const),
  targetAudience: z.enum(["all", "new-users", "returning-users"] as const),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const initialNotifications: Notification[] = [
  {
    id: "N001",
    title: "New Feature Released",
    message: "Check out our new product recommendation engine!",
    type: "info",
    targetAudience: "all",
    isActive: true,
    date: "2023-05-15",
  },
  {
    id: "N002",
    title: "Summer Sale",
    message: "Enjoy 30% off on all summer products for a limited time!",
    type: "success",
    targetAudience: "all",
    isActive: true,
    date: "2023-05-10",
  },
  {
    id: "N003",
    title: "Scheduled Maintenance",
    message: "Our site will be down for maintenance from 2-4 AM EST on June 5th.",
    type: "warning",
    targetAudience: "all",
    isActive: true,
    date: "2023-05-08",
  },
  {
    id: "N004",
    title: "Welcome Offer",
    message: "Use code WELCOME10 for 10% off your first purchase!",
    type: "info",
    targetAudience: "new-users",
    isActive: true,
    date: "2023-05-01",
  },
  {
    id: "N005",
    title: "Payment Issue",
    message: "We're experiencing issues with payment processing. We're working to fix it.",
    type: "error",
    targetAudience: "all",
    isActive: false,
    date: "2023-04-28",
  },
]

export function NotificationsManager() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingNotification, setDeletingNotification] = useState<Notification | null>(null)
  const { toast } = useToast()
  const itemsPerPage = 5

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "info",
      targetAudience: "all",
      isActive: true,
    },
  })

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage)

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getAudienceLabel = (audience: TargetAudience) => {
    switch (audience) {
      case "all":
        return "All Users"
      case "new-users":
        return "New Users"
      case "returning-users":
        return "Returning Users"
      default:
        return audience
    }
  }

  const handleCreateNotification = () => {
    setEditingNotification(null)
    form.reset({
      title: "",
      message: "",
      type: "info",
      targetAudience: "all",
      isActive: true,
    })
    setDialogOpen(true)
  }

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification)
    form.reset({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.targetAudience,
      isActive: notification.isActive,
    })
    setDialogOpen(true)
  }

  const handleDeleteNotification = (notification: Notification) => {
    setDeletingNotification(notification)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingNotification) {
      setNotifications(notifications.filter((n) => n.id !== deletingNotification.id))
      toast({
        title: "Notification deleted",
        description: "The notification has been successfully deleted.",
      })
      setDeleteDialogOpen(false)
    }
  }

  const toggleNotificationStatus = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isActive: !notification.isActive } : notification,
      ),
    )
  }

  const onSubmit = (values: FormValues) => {
    if (editingNotification) {
      // Update existing notification
      setNotifications(
        notifications.map((notification) =>
          notification.id === editingNotification.id
            ? {
                ...notification,
                ...values,
                date: new Date().toISOString().split("T")[0], // Update date to today
              }
            : notification,
        ),
      )
      toast({
        title: "Notification updated",
        description: "The notification has been successfully updated.",
      })
    } else {
      // Create new notification
      const newNotification: Notification = {
        id: `N${String(notifications.length + 1).padStart(3, "0")}`,
        ...values,
        date: new Date().toISOString().split("T")[0],
      }
      setNotifications([newNotification, ...notifications])
      toast({
        title: "Notification created",
        description: "The notification has been successfully created.",
      })
    }
    setDialogOpen(false)
  }

  const typeOptions = [
    { value: "info", label: "Information" },
    { value: "warning", label: "Warning" },
    { value: "success", label: "Success" },
    { value: "error", label: "Error" },
  ]

  const audienceOptions = [
    { value: "all", label: "All Users" },
    { value: "new-users", label: "New Users" },
    { value: "returning-users", label: "Returning Users" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>User Notifications</CardTitle>
            <CardDescription>Manage notifications displayed to your customers</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateNotification}>
              <Plus className="mr-2 h-4 w-4" />
              Add Notification
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full sm:w-[300px]"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[250px] truncate">{notification.message}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getAudienceLabel(notification.targetAudience)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={notification.isActive}
                      onCheckedChange={() => toggleNotificationStatus(notification.id)}
                      aria-label={`Toggle ${notification.title}`}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{notification.date}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditNotification(notification)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit notification</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteNotification(notification)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete notification</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedNotifications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No notifications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(filteredNotifications.length, 1 + startIndex)} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length}{" "}
            notifications
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
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Create/Edit Notification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingNotification ? "Edit Notification" : "Create Notification"}</DialogTitle>
            <DialogDescription>
              {editingNotification
                ? "Update the notification details below."
                : "Add a new notification to display to your users."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Notification title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notification message" className="resize-none h-20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the notification type</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {audienceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Who should see this notification</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>Display this notification to users</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingNotification ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-4 py-2">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{deletingNotification?.title}</p>
              <p className="text-muted-foreground mt-1">{deletingNotification?.message}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

