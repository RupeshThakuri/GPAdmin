"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { AlertCircle, Edit, Eye, Plus, Trash2, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// With this custom toast implementation:
const useToast = () => {
  const showToast = (toast: { title: string; description: string; variant?: string }) => {
    // In a real app, this would show a toast notification
    console.log(`Toast: ${toast.title} - ${toast.description}`)
  }

  return { toast: showToast }
}

interface Banner {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  type: "flash-sale" | "sponsor" | "seasonal" | "special-offer"
  position: "home-top" | "home-middle" | "category-page" | "sidebar"
  startDate: string
  endDate: string
  isActive: boolean
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  imageUrl: z.string().min(5, { message: "Image URL is required." }),
  linkUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  type: z.enum(["flash-sale", "sponsor", "seasonal", "special-offer"]),
  position: z.enum(["home-top", "home-middle", "category-page", "sidebar"]),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const initialBanners: Banner[] = [
  {
    id: "B001",
    title: "Summer Flash Sale",
    description: "Up to 70% off on all summer items! Limited time only.",
    imageUrl: "/placeholder.svg?height=200&width=800&text=SUMMER+FLASH+SALE",
    linkUrl: "https://example.com/summer-sale",
    type: "flash-sale",
    position: "home-top",
    startDate: "2023-06-01",
    endDate: "2023-06-15",
    isActive: true,
  },
  {
    id: "B002",
    title: "Nike - Just Do It",
    description: "Official sponsor of our sports collection",
    imageUrl: "/placeholder.svg?height=200&width=800&text=NIKE+SPONSOR",
    linkUrl: "https://example.com/nike",
    type: "sponsor",
    position: "category-page",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    isActive: true,
  },
  {
    id: "B003",
    title: "Holiday Season Sale",
    description: "Prepare for the holidays with our special discounts",
    imageUrl: "/placeholder.svg?height=200&width=800&text=HOLIDAY+SEASON",
    linkUrl: "https://example.com/holiday",
    type: "seasonal",
    position: "home-middle",
    startDate: "2023-11-15",
    endDate: "2023-12-25",
    isActive: false,
  },
  {
    id: "B004",
    title: "Buy One Get One Free",
    description: "Special offer on selected items",
    imageUrl: "/placeholder.svg?height=200&width=800&text=BOGO+OFFER",
    linkUrl: "https://example.com/bogo",
    type: "special-offer",
    position: "sidebar",
    startDate: "2023-05-10",
    endDate: "2023-05-20",
    isActive: true,
  },
]

export function PromotionalBanners() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      type: "flash-sale",
      position: "home-top",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isActive: true,
    },
  })

  const filteredBanners = activeTab === "all" ? banners : banners.filter((banner) => banner.type === activeTab)

  const handleCreateBanner = () => {
    setEditingBanner(null)
    form.reset({
      title: "",
      description: "",
      imageUrl: "/placeholder.svg?height=200&width=800", // Default placeholder
      linkUrl: "",
      type: "flash-sale",
      position: "home-top",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isActive: true,
    })
    setDialogOpen(true)
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    form.reset({
      title: banner.title,
      description: banner.description || "",
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      type: banner.type,
      position: banner.position,
      startDate: banner.startDate,
      endDate: banner.endDate,
      isActive: banner.isActive,
    })
    setDialogOpen(true)
  }

  const handleDeleteBanner = (banner: Banner) => {
    setDeletingBanner(banner)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingBanner) {
      setBanners(banners.filter((b) => b.id !== deletingBanner.id))
      toast({
        title: "Banner deleted",
        description: "The promotional banner has been successfully deleted.",
      })
      setDeleteDialogOpen(false)
    }
  }

  const toggleBannerStatus = (id: string) => {
    setBanners(banners.map((banner) => (banner.id === id ? { ...banner, isActive: !banner.isActive } : banner)))
  }

  const handlePreview = (banner: Banner) => {
    setPreviewBanner(banner)
    setPreviewOpen(true)
  }

  const onSubmit = (values: FormValues) => {
    if (editingBanner) {
      // Update existing banner
      setBanners(
        banners.map((banner) =>
          banner.id === editingBanner.id
            ? {
                ...banner,
                ...values,
              }
            : banner,
        ),
      )
      toast({
        title: "Banner updated",
        description: "The promotional banner has been successfully updated.",
      })
    } else {
      // Create new banner
      const newBanner: Banner = {
        id: `B${String(banners.length + 1).padStart(3, "0")}`,
        ...values,
        description: values.description || "",
        linkUrl: values.linkUrl || "",
      }
      setBanners([...banners, newBanner])
      toast({
        title: "Banner created",
        description: "The promotional banner has been successfully created.",
      })
    }
    setDialogOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError(null)

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size should not exceed 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Only image files are allowed")
      return
    }

    // In a real app, we would upload the file to a server
    // For this demo, we'll just use a placeholder
    form.setValue("imageUrl", `/placeholder.svg?height=200&width=800&text=${encodeURIComponent(file.name)}`)
    toast({
      title: "Image selected",
      description: "In a real app, this would upload to your server.",
    })
  }

  const getBannerTypeLabel = (type: Banner["type"]) => {
    switch (type) {
      case "flash-sale":
        return "Flash Sale"
      case "sponsor":
        return "Sponsor"
      case "seasonal":
        return "Seasonal"
      case "special-offer":
        return "Special Offer"
    }
  }

  const getBannerPositionLabel = (position: Banner["position"]) => {
    switch (position) {
      case "home-top":
        return "Home Page (Top)"
      case "home-middle":
        return "Home Page (Middle)"
      case "category-page":
        return "Category Page"
      case "sidebar":
        return "Sidebar"
    }
  }

  const getBannerTypeColor = (type: Banner["type"]) => {
    switch (type) {
      case "flash-sale":
        return "bg-red-100 text-red-800"
      case "sponsor":
        return "bg-blue-100 text-blue-800"
      case "seasonal":
        return "bg-green-100 text-green-800"
      case "special-offer":
        return "bg-purple-100 text-purple-800"
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Promotional Banners</CardTitle>
              <CardDescription>Manage promotional banners displayed across your store</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateBanner}>
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="flash-sale">Flash Sales</TabsTrigger>
              <TabsTrigger value="sponsor">Sponsors</TabsTrigger>
              <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
              <TabsTrigger value="special-offer">Special Offers</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {filteredBanners.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No banners found. Add your first banner!</p>
              </div>
            ) : (
              filteredBanners.map((banner) => (
                <div
                  key={banner.id}
                  className={cn("flex flex-col gap-4 p-4 border rounded-lg", !banner.isActive && "bg-muted/40")}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-64 h-32 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={banner.imageUrl || "/placeholder.svg"}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg">{banner.title}</h3>
                        <Badge variant="outline" className={getBannerTypeColor(banner.type)}>
                          {getBannerTypeLabel(banner.type)}
                        </Badge>
                        {!banner.isActive && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{banner.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Position: </span>
                          <span>{getBannerPositionLabel(banner.position)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Duration: </span>
                          <span>
                            {banner.startDate} to {banner.endDate}
                          </span>
                        </div>
                        {banner.linkUrl && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Link: </span>
                            <a
                              href={banner.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary truncate"
                            >
                              {banner.linkUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex md:flex-col items-center gap-2 md:ml-auto">
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={() => toggleBannerStatus(banner.id)}
                        aria-label={`Toggle ${banner.title}`}
                      />
                      <Button variant="outline" size="icon" onClick={() => handlePreview(banner)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEditBanner(banner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteBanner(banner)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <div className="text-sm text-muted-foreground">Displaying {filteredBanners.length} promotional banners</div>
        </CardFooter>
      </Card>

      {/* Create/Edit Banner Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Promotional Banner" : "Add Promotional Banner"}</DialogTitle>
            <DialogDescription>
              {editingBanner
                ? "Update the promotional banner details below."
                : "Add a new promotional banner to your store."}
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
                      <Input placeholder="Banner title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Banner description"
                        className="resize-none h-20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="flash-sale">Flash Sale</SelectItem>
                          <SelectItem value="sponsor">Sponsor</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                          <SelectItem value="special-offer">Special Offer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Position</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="home-top">Home Page (Top)</SelectItem>
                          <SelectItem value="home-middle">Home Page (Middle)</SelectItem>
                          <SelectItem value="category-page">Category Page</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <div className="flex flex-col gap-4">
                      {field.value && (
                        <div className="relative w-full h-40 rounded-md overflow-hidden">
                          <Image
                            src={field.value || "/placeholder.svg"}
                            alt="Banner preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <FormControl>
                          <Input className="hidden" {...field} />
                        </FormControl>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        {fileError && <p className="text-sm font-medium text-destructive">{fileError}</p>}
                      </div>
                    </div>
                    <FormDescription>Recommended size: 800×200 pixels, max 5MB</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/page" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Where users will go when they click this banner</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>Display this banner on your store</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingBanner ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Promotional Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this promotional banner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-4 py-2">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{deletingBanner?.title}</p>
              <p className="text-muted-foreground mt-1">{deletingBanner?.description}</p>
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

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[80vw] p-0 overflow-hidden">
          <DialogHeader className="p-6">
            <DialogTitle>Banner Preview</DialogTitle>
            <DialogDescription>Preview how your promotional banner will appear on your website</DialogDescription>
          </DialogHeader>
          {previewBanner && (
            <div className="p-6">
              <div className="relative w-full overflow-hidden rounded-lg border">
                <div className="relative w-full h-48">
                  <Image
                    src={previewBanner.imageUrl || "/placeholder.svg"}
                    alt={previewBanner.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {previewBanner.type === "flash-sale" && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 rounded-br-lg font-bold">
                    FLASH SALE
                  </div>
                )}

                {previewBanner.position === "home-top" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 text-white p-6 rounded-lg max-w-md text-center">
                      <h2 className="text-2xl font-bold mb-2">{previewBanner.title}</h2>
                      <p className="mb-4">{previewBanner.description}</p>
                      {previewBanner.linkUrl && (
                        <Button variant="outline" className="bg-white/20 hover:bg-white/30 border-white">
                          Shop Now
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {previewBanner.position === "sidebar" && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
                    <h3 className="font-bold">{previewBanner.title}</h3>
                    <p className="text-sm">{previewBanner.description}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-medium mb-2">Banner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {getBannerTypeLabel(previewBanner.type)}
                  </div>
                  <div>
                    <span className="font-medium">Position:</span> {getBannerPositionLabel(previewBanner.position)}
                  </div>
                  <div>
                    <span className="font-medium">Active Period:</span> {previewBanner.startDate} to{" "}
                    {previewBanner.endDate}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {previewBanner.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 flex justify-end">
            <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

