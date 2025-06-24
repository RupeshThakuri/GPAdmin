"use client"

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
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  Plus,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const useToast = () => {
  const showToast = (toast: { title: string; description: string; variant?: string }) => {
    console.log(`Toast: ${toast.title} - ${toast.description}`)
  }
  return { toast: showToast }
}

interface SliderImage {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  order: number
  isActive: boolean
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  imageUrl: z.string().min(5, { message: "Image URL is required." }),
  linkUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const initialSliderImages: SliderImage[] = [
  {
    id: "S001",
    title: "Summer Collection",
    description: "Discover our latest summer styles with up to 30% off",
    imageUrl: "/placeholder.svg?height=400&width=1200",
    linkUrl: "https://example.com/summer",
    order: 1,
    isActive: true,
  },
  {
    id: "S002",
    title: "New Arrivals",
    description: "Check out our newest products",
    imageUrl: "/placeholder.svg?height=400&width=1200",
    linkUrl: "https://example.com/new",
    order: 2,
    isActive: true,
  },
  {
    id: "S003",
    title: "Limited Time Offer",
    description: "Special deals this weekend only",
    imageUrl: "/placeholder.svg?height=400&width=1200",
    linkUrl: "https://example.com/special",
    order: 3,
    isActive: false,
  },
]

export function HeroSliderManager() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>(initialSliderImages)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingImage, setDeletingImage] = useState<SliderImage | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)
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
      isActive: true,
    },
  })

  const handleCreateImage = () => {
    setEditingImage(null)
    form.reset({
      title: "",
      description: "",
      imageUrl: "/placeholder.svg?height=400&width=1200",
      linkUrl: "",
      isActive: true,
    })
    setDialogOpen(true)
  }

  const handleEditImage = (image: SliderImage) => {
    setEditingImage(image)
    form.reset({
      title: image.title,
      description: image.description || "",
      imageUrl: image.imageUrl,
      linkUrl: image.linkUrl || "",
      isActive: image.isActive,
    })
    setDialogOpen(true)
  }

  const handleDeleteImage = (image: SliderImage) => {
    setDeletingImage(image)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingImage) {
      setSliderImages(sliderImages.filter((img) => img.id !== deletingImage.id))
      toast({
        title: "Slider image deleted",
        description: "The slider image has been successfully deleted.",
      })
      setDeleteDialogOpen(false)
    }
  }

  const toggleImageStatus = (id: string) => {
    setSliderImages(sliderImages.map((image) => 
      image.id === id ? { ...image, isActive: !image.isActive } : image
    ))
  }

  const moveImageUp = (id: string) => {
    const imageIndex = sliderImages.findIndex((img) => img.id === id)
    if (imageIndex <= 0) return

    const newImages = [...sliderImages]
    // Swap the orders
    const tempOrder = newImages[imageIndex].order
    newImages[imageIndex].order = newImages[imageIndex - 1].order
    newImages[imageIndex - 1].order = tempOrder
    // Swap the positions
    const temp = newImages[imageIndex]
    newImages[imageIndex] = newImages[imageIndex - 1]
    newImages[imageIndex - 1] = temp

    setSliderImages(newImages)
    toast({
      title: "Image moved up",
      description: `"${newImages[imageIndex - 1].title}" has been moved up in the order.`,
    })
  }

  const moveImageDown = (id: string) => {
    const imageIndex = sliderImages.findIndex((img) => img.id === id)
    if (imageIndex >= sliderImages.length - 1) return

    const newImages = [...sliderImages]
    // Swap the orders
    const tempOrder = newImages[imageIndex].order
    newImages[imageIndex].order = newImages[imageIndex + 1].order
    newImages[imageIndex + 1].order = tempOrder
    // Swap the positions
    const temp = newImages[imageIndex]
    newImages[imageIndex] = newImages[imageIndex + 1]
    newImages[imageIndex + 1] = temp

    setSliderImages(newImages)
    toast({
      title: "Image moved down",
      description: `"${newImages[imageIndex + 1].title}" has been moved down in the order.`,
    })
  }

  const onSubmit = (values: FormValues) => {
    if (editingImage) {
      setSliderImages(
        sliderImages.map((image) =>
          image.id === editingImage.id ? { ...image, ...values } : image
        )
      )
      toast({
        title: "Slider image updated",
        description: "The slider image has been successfully updated.",
      })
    } else {
      const newImage: SliderImage = {
        id: `S${String(sliderImages.length + 1).padStart(3, "0")}`,
        ...values,
        order: sliderImages.length + 1,
        description: values.description || "",
        linkUrl: values.linkUrl || "",
      }
      setSliderImages([...sliderImages, newImage])
      toast({
        title: "Slider image created",
        description: "The slider image has been successfully created.",
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

    form.setValue("imageUrl", `/placeholder.svg?height=400&width=1200&text=${encodeURIComponent(file.name)}`)
    toast({
      title: "Image selected",
      description: "In a real app, this would upload to your server.",
    })
  }

  const handlePreview = () => {
    const activeImages = sliderImages.filter((img) => img.isActive)
    if (activeImages.length === 0) {
      toast({
        title: "No active images",
        description: "There are no active images to preview.",
        variant: "destructive",
      })
      return
    }
    setActivePreviewIndex(0)
    setPreviewOpen(true)
  }

  const activeImages = sliderImages.filter((image) => image.isActive)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Hero Slider Images</CardTitle>
              <CardDescription>Manage the images displayed in your homepage slider</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleCreateImage}>
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sliderImages.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No slider images yet. Add your first image!</p>
              </div>
            ) : (
              sliderImages.map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    "flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg",
                    !image.isActive && "bg-muted/40",
                  )}
                >
                  <div className="relative w-full md:w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={image.imageUrl} alt={image.title} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{image.title}</h3>
                      {!image.isActive && (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{image.description}</p>
                    {image.linkUrl && <p className="text-xs text-primary mt-1 truncate">{image.linkUrl}</p>}
                  </div>
                  <div className="flex flex-row md:flex-col items-center gap-2 ml-auto">
                    <Button variant="outline" size="icon" onClick={() => moveImageUp(image.id)} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveImageDown(image.id)}
                      disabled={index === sliderImages.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={image.isActive}
                      onCheckedChange={() => toggleImageStatus(image.id)}
                      aria-label={`Toggle ${image.title}`}
                    />
                    <Button variant="outline" size="icon" onClick={() => handleEditImage(image)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteImage(image)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Displaying {sliderImages.length} slider images ({activeImages.length} active)
          </div>
        </CardFooter>
      </Card>

      {/* Create/Edit Image Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Edit Slider Image" : "Add Slider Image"}</DialogTitle>
            <DialogDescription>
              {editingImage ? "Update the slider image details below." : "Add a new image to your homepage slider."}
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
                      <Input placeholder="Slider title" {...field} />
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
                        placeholder="Slider description"
                        className="resize-none h-20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <div className="flex flex-col gap-4">
                      {field.value && (
                        <div className="relative w-full h-40 rounded-md overflow-hidden">
                          <Image
                            src={field.value}
                            alt="Slider preview"
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
                    <FormDescription>Recommended size: 1200×400 pixels, max 5MB</FormDescription>
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
                    <FormDescription>Where users will go when they click this slide</FormDescription>
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
                      <FormDescription>Display this image in the slider</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingImage ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Slider Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this slider image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-4 py-2">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{deletingImage?.title}</p>
              <p className="text-muted-foreground mt-1">{deletingImage?.description}</p>
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
        <DialogContent className="sm:max-w-[80vw] max-h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="p-6">
            <DialogTitle>Hero Slider Preview</DialogTitle>
            <DialogDescription>Preview how your hero slider will appear on your website</DialogDescription>
          </DialogHeader>
          <div className="relative w-full aspect-[3/1] overflow-hidden">
            {activeImages.length > 0 ? (
              <>
                <Image
                  src={activeImages[activePreviewIndex].imageUrl}
                  alt={activeImages[activePreviewIndex].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-8">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{activeImages[activePreviewIndex].title}</h2>
                    <p className="text-lg mt-2">{activeImages[activePreviewIndex].description}</p>
                    {activeImages[activePreviewIndex].linkUrl && (
                      <Button className="mt-4" variant="outline">
                        Shop Now
                      </Button>
                    )}
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {activeImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${index === activePreviewIndex ? "bg-white" : "bg-white/50"}`}
                      onClick={() => setActivePreviewIndex(index)}
                    />
                  ))}
                </div>

                {/* Navigation arrows */}
                {activeImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
                      onClick={() => setActivePreviewIndex((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1))}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
                      onClick={() => setActivePreviewIndex((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1))}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <p className="text-muted-foreground">No active images to preview</p>
              </div>
            )}
          </div>
          <div className="p-4 flex justify-end">
            <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}