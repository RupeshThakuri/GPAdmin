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
import {
  AlertCircle,
  Edit,
  Eye,
  FileText,
  Grid,
  Info,
  LayoutGrid,
  Mail,
  Plus,
  Trash2,
  Upload,
  Users,
} from "lucide-react"
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

interface PageSection {
  id: string
  title: string
  description: string
  imageUrl: string
  content: string
  pageType: "category" | "contact" | "vacancy" | "about" | "faq"
  isActive: boolean
  lastUpdated: string
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  imageUrl: z.string().min(5, { message: "Image URL is required." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  pageType: z.enum(["category", "contact", "vacancy", "about", "faq"]),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const initialPageSections: PageSection[] = [
  {
    id: "P001",
    title: "Men's Clothing",
    description: "Explore our collection of men's clothing",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Men's+Clothing",
    content:
      "Browse our extensive collection of men's clothing, featuring the latest trends and timeless classics. From casual wear to formal attire, we have everything you need to upgrade your wardrobe.",
    pageType: "category",
    isActive: true,
    lastUpdated: "2023-05-15",
  },
  {
    id: "P002",
    title: "Women's Clothing",
    description: "Discover our women's fashion collection",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Women's+Clothing",
    content:
      "Discover our curated selection of women's clothing, designed to make you look and feel your best. From everyday essentials to statement pieces, find your perfect style with us.",
    pageType: "category",
    isActive: true,
    lastUpdated: "2023-05-14",
  },
  {
    id: "P003",
    title: "Contact Us",
    description: "Get in touch with our customer service team",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Contact+Us",
    content:
      "We're here to help! Reach out to our customer service team for any questions, concerns, or feedback. You can contact us via email, phone, or by filling out the form below.",
    pageType: "contact",
    isActive: true,
    lastUpdated: "2023-05-10",
  },
  {
    id: "P004",
    title: "Career Opportunities",
    description: "Join our growing team",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Careers",
    content:
      "Looking for a rewarding career? Join our team of passionate professionals dedicated to providing exceptional products and services. Check out our current openings and apply today!",
    pageType: "vacancy",
    isActive: true,
    lastUpdated: "2023-05-05",
  },
  {
    id: "P005",
    title: "About Our Company",
    description: "Learn about our mission and values",
    imageUrl: "/placeholder.svg?height=300&width=600&text=About+Us",
    content:
      "Founded in 2010, our company has grown from a small startup to a leading provider in the industry. Our mission is to deliver high-quality products while maintaining our commitment to sustainability and ethical practices.",
    pageType: "about",
    isActive: true,
    lastUpdated: "2023-04-28",
  },
  {
    id: "P006",
    title: "Frequently Asked Questions",
    description: "Find answers to common questions",
    imageUrl: "/placeholder.svg?height=300&width=600&text=FAQs",
    content:
      "Find answers to our most frequently asked questions about orders, shipping, returns, and more. If you can't find what you're looking for, don't hesitate to contact our customer service team.",
    pageType: "faq",
    isActive: true,
    lastUpdated: "2023-04-20",
  },
]

export function PageContentManager() {
  const [pageSections, setPageSections] = useState<PageSection[]>(initialPageSections)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingSection, setDeletingSection] = useState<PageSection | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewSection, setPreviewSection] = useState<PageSection | null>(null)
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
      content: "",
      pageType: "category",
      isActive: true,
    },
  })

  const filteredSections =
    activeTab === "all" ? pageSections : pageSections.filter((section) => section.pageType === activeTab)

  const handleCreateSection = () => {
    setEditingSection(null)
    form.reset({
      title: "",
      description: "",
      imageUrl: "/placeholder.svg?height=300&width=600", // Default placeholder
      content: "",
      pageType: "category",
      isActive: true,
    })
    setDialogOpen(true)
  }

  const handleEditSection = (section: PageSection) => {
    setEditingSection(section)
    form.reset({
      title: section.title,
      description: section.description,
      imageUrl: section.imageUrl,
      content: section.content,
      pageType: section.pageType,
      isActive: section.isActive,
    })
    setDialogOpen(true)
  }

  const handleDeleteSection = (section: PageSection) => {
    setDeletingSection(section)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingSection) {
      setPageSections(pageSections.filter((s) => s.id !== deletingSection.id))
      toast({
        title: "Section deleted",
        description: "The page section has been successfully deleted.",
      })
      setDeleteDialogOpen(false)
    }
  }

  const toggleSectionStatus = (id: string) => {
    setPageSections(
      pageSections.map((section) => (section.id === id ? { ...section, isActive: !section.isActive } : section)),
    )
  }

  const handlePreview = (section: PageSection) => {
    setPreviewSection(section)
    setPreviewOpen(true)
  }

  const onSubmit = (values: FormValues) => {
    const currentDate = new Date().toISOString().split("T")[0]

    if (editingSection) {
      // Update existing section
      setPageSections(
        pageSections.map((section) =>
          section.id === editingSection.id
            ? {
                ...section,
                ...values,
                lastUpdated: currentDate,
              }
            : section,
        ),
      )
      toast({
        title: "Section updated",
        description: "The page section has been successfully updated.",
      })
    } else {
      // Create new section
      const newSection: PageSection = {
        id: `P${String(pageSections.length + 1).padStart(3, "0")}`,
        ...values,
        lastUpdated: currentDate,
      }
      setPageSections([...pageSections, newSection])
      toast({
        title: "Section created",
        description: "The page section has been successfully created.",
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
    form.setValue("imageUrl", `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(file.name)}`)
    toast({
      title: "Image selected",
      description: "In a real app, this would upload to your server.",
    })
  }

  const getPageTypeIcon = (type: PageSection["pageType"]) => {
    switch (type) {
      case "category":
        return <LayoutGrid className="h-5 w-5" />
      case "contact":
        return <Mail className="h-5 w-5" />
      case "vacancy":
        return <Users className="h-5 w-5" />
      case "about":
        return <Info className="h-5 w-5" />
      case "faq":
        return <FileText className="h-5 w-5" />
    }
  }

  const getPageTypeLabel = (type: PageSection["pageType"]) => {
    switch (type) {
      case "category":
        return "Category Page"
      case "contact":
        return "Contact Page"
      case "vacancy":
        return "Careers Page"
      case "about":
        return "About Us Page"
      case "faq":
        return "FAQ Page"
    }
  }

  const getPageTypeColor = (type: PageSection["pageType"]) => {
    switch (type) {
      case "category":
        return "bg-blue-100 text-blue-800"
      case "contact":
        return "bg-green-100 text-green-800"
      case "vacancy":
        return "bg-purple-100 text-purple-800"
      case "about":
        return "bg-yellow-100 text-yellow-800"
      case "faq":
        return "bg-orange-100 text-orange-800"
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>Manage content sections across your store pages</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateSection}>
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="category">Categories</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="vacancy">Careers</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {filteredSections.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No page sections found. Add your first section!</p>
              </div>
            ) : (
              filteredSections.map((section) => (
                <div
                  key={section.id}
                  className={cn("flex flex-col gap-4 p-4 border rounded-lg", !section.isActive && "bg-muted/40")}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-48 h-32 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={section.imageUrl || "/placeholder.svg"}
                        alt={section.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg">{section.title}</h3>
                        <Badge variant="outline" className={getPageTypeColor(section.pageType)}>
                          {getPageTypeLabel(section.pageType)}
                        </Badge>
                        {!section.isActive && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                      <p className="text-sm line-clamp-2">{section.content}</p>
                      <div className="text-xs text-muted-foreground mt-2">Last updated: {section.lastUpdated}</div>
                    </div>
                    <div className="flex md:flex-col items-center gap-2 md:ml-auto">
                      <Switch
                        checked={section.isActive}
                        onCheckedChange={() => toggleSectionStatus(section.id)}
                        aria-label={`Toggle ${section.title}`}
                      />
                      <Button variant="outline" size="icon" onClick={() => handlePreview(section)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEditSection(section)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteSection(section)}>
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
          <div className="text-sm text-muted-foreground">Displaying {filteredSections.length} page sections</div>
        </CardFooter>
      </Card>

      {/* Create/Edit Section Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingSection ? "Edit Page Section" : "Add Page Section"}</DialogTitle>
            <DialogDescription>
              {editingSection
                ? "Update the page section details below."
                : "Add a new content section to your store pages."}
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
                      <Input placeholder="Section title" {...field} />
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
                      <Input placeholder="Brief description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select page type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="category">Category Page</SelectItem>
                        <SelectItem value="contact">Contact Page</SelectItem>
                        <SelectItem value="vacancy">Careers Page</SelectItem>
                        <SelectItem value="about">About Us Page</SelectItem>
                        <SelectItem value="faq">FAQ Page</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Image</FormLabel>
                    <div className="flex flex-col gap-4">
                      {field.value && (
                        <div className="relative w-full h-40 rounded-md overflow-hidden">
                          <Image
                            src={field.value || "/placeholder.svg"}
                            alt="Section preview"
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
                    <FormDescription>Recommended size: 600×300 pixels, max 5MB</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Main content for this section" className="resize-none h-32" {...field} />
                    </FormControl>
                    <FormDescription>This will be displayed as the main content for this section</FormDescription>
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
                      <FormDescription>Display this section on your store</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingSection ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Page Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this page section? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-4 py-2">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{deletingSection?.title}</p>
              <p className="text-muted-foreground mt-1">{deletingSection?.description}</p>
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
            <DialogTitle>Page Section Preview</DialogTitle>
            <DialogDescription>Preview how this section will appear on your website</DialogDescription>
          </DialogHeader>
          {previewSection && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {getPageTypeIcon(previewSection.pageType)}
                <Badge variant="outline" className={getPageTypeColor(previewSection.pageType)}>
                  {getPageTypeLabel(previewSection.pageType)}
                </Badge>
              </div>

              {previewSection.pageType === "category" && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="relative w-full h-64">
                    <Image
                      src={previewSection.imageUrl || "/placeholder.svg"}
                      alt={previewSection.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
                      <div className="p-6 text-white">
                        <h1 className="text-3xl font-bold mb-2">{previewSection.title}</h1>
                        <p className="text-lg">{previewSection.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-6">{previewSection.content}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border rounded-md p-4 text-center">
                          <div className="bg-muted h-32 mb-2 rounded flex items-center justify-center">
                            <Grid className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="font-medium">Product {i}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {previewSection.pageType === "contact" && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={previewSection.imageUrl || "/placeholder.svg"}
                      alt={previewSection.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <h1 className="text-3xl font-bold text-white">{previewSection.title}</h1>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-6">{previewSection.content}</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contact Form</h3>
                        <div className="space-y-2">
                          <Input placeholder="Your Name" disabled />
                          <Input placeholder="Your Email" disabled />
                          <Textarea placeholder="Your Message" className="h-32" disabled />
                          <Button disabled>Send Message</Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <div className="space-y-2">
                          <p>
                            <strong>Email:</strong> contact@example.com
                          </p>
                          <p>
                            <strong>Phone:</strong> +1 (555) 123-4567
                          </p>
                          <p>
                            <strong>Address:</strong> 123 Commerce St, Business City, 90210
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewSection.pageType === "vacancy" && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={previewSection.imageUrl || "/placeholder.svg"}
                      alt={previewSection.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <h1 className="text-3xl font-bold text-white">{previewSection.title}</h1>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-6">{previewSection.content}</p>
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">Open Positions</h3>
                      <div className="space-y-4">
                        {["Marketing Manager", "Web Developer", "Customer Service Representative"].map((position) => (
                          <div key={position} className="border rounded-md p-4">
                            <h4 className="font-medium">{position}</h4>
                            <p className="text-sm text-muted-foreground mb-2">Full-time · Remote</p>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(previewSection.pageType === "about" || previewSection.pageType === "faq") && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={previewSection.imageUrl || "/placeholder.svg"}
                      alt={previewSection.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <h1 className="text-3xl font-bold text-white">{previewSection.title}</h1>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-6">{previewSection.content}</p>
                    {previewSection.pageType === "about" && (
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        {["Our Mission", "Our Team", "Our History"].map((item) => (
                          <div key={item} className="border rounded-md p-4 text-center">
                            <h3 className="font-medium mb-2">{item}</h3>
                            <p className="text-sm text-muted-foreground">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
                              ut labore.
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {previewSection.pageType === "faq" && (
                      <div className="space-y-4 mt-6">
                        {["How do I place an order?", "What is your return policy?", "How can I track my order?"].map(
                          (question) => (
                            <div key={question} className="border rounded-md p-4">
                              <h3 className="font-medium mb-2">{question}</h3>
                              <p className="text-sm text-muted-foreground">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
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

