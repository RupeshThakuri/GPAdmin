"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Tags,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { productService } from "../../services/api-service"

import ProductForm from "./product-form"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { ProductDetailsDialog } from "./product-details-dialog"
import { UpdateStockDialog } from "./update-stock-dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { ProductFormValues } from "../../services/product-form-schema"
import { SectionUpdateDialog } from "./section-update-dialog"

type ProductStatus = "draft" | "published" | "scheduled"

interface Product extends ProductFormValues {
  id: string
  vendor_name?: string
  created_at?: string
  updated_at?: string
  stock?: number // For backward compatibility
}

const getStatusClass = (status: ProductStatus) => {
  switch (status) {
    case "draft":
      return "bg-yellow-100 text-yellow-800"
    case "published":
      return "bg-green-100 text-green-800"
    case "scheduled":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStockStatus = (quantity: number, lowThreshold = 10) => {
  if (quantity === 0) return { status: "out-of-stock", label: "Out of Stock", color: "bg-red-100 text-red-800" }
  if (quantity <= lowThreshold)
    return { status: "low-stock", label: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
  return { status: "in-stock", label: "In Stock", color: "bg-green-100 text-green-800" }
}

export default function ProductsTable() {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const { toast } = useToast()

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [updateStockDialogOpen, setUpdateStockDialogOpen] = useState(false)
  const [sectionUpdateDialogOpen, setSectionUpdateDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [addProduct, setAddProduct] = useState(false)
  const [formKey, setFormKey] = useState(0) // Key to force re-render of form

  // for fetching product image
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Function to get the full image URL
  const getFullImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg?height=40&width=40"

    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl
    }

    // If it's a relative URL starting with /media, prepend the API base URL
    if (imageUrl.startsWith("/media/")) {
      return `${API_BASE_URL}${imageUrl}`
    }

    // If it's just a filename or relative path, construct the full URL
    if (imageUrl.startsWith("media/")) {
      return `${API_BASE_URL}/${imageUrl}`
    }

    // Default fallback
    return imageUrl
  }

  // Extract unique categories from products
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>()
    data.forEach((product) => {
      product.categories?.forEach((category) => {
        categories.add(category)
      })
    })
    return Array.from(categories)
  }, [data])

  //for fetching the whole product
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const products = await productService.getAllProducts()

      // Ensure products is an array
      if (!Array.isArray(products)) {
        console.warn("API returned non-array data:", products)
        setData([])
        return
      }

      const formattedProducts: Product[] = products.map((product: any) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        vendor: product.vendor?.toString() || "",
        vendor_name: product.vendor_name,
        brand: product.brand,
        categories: product.categories || [],
        tags: product.tags || [],
        shortDescription: product.short_description,
        fullDescription: product.full_description,
        features: product.features || [],
        specifications: product.specifications || [],
        price: Number(product.price),
        compareAtPrice: product.compare_at_price ? Number(product.compare_at_price) : undefined,
        discount: product.discount ? Number(product.discount) : undefined,
        taxable: product.taxable || false,
        taxCode: product.tax_code || "",
        inventory: {
          quantity: product.inventory?.quantity || 0,
          trackInventory: product.inventory?.trackInventory ?? true,
          allowBackorders: product.inventory?.allowBackorders ?? false,
          lowStockThreshold: product.inventory?.lowStockThreshold || 5,
        },
        hasVariants: product.has_variants || false,
        variantOptions: product.variant_options || [],
        variants: product.variants || [],
        shipping: {
          weight: product.weight,
          weightUnit: product.weight_unit || "kg",
          dimensions: {
            length: product.length,
            width: product.width,
            height: product.height,
            unit: product.dimensions_unit || "cm",
          },
          shippingClass: product.shipping_class || "",
          freeShipping: product.free_shipping || false,
          shippingNote: product.shipping_note || "",
        },
        status: (product.status as ProductStatus) || "draft",
        visibility: product.visibility || "visible",
        images: product.images || [],
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Backward compatibility
        stock: product.inventory?.quantity || 0,
      }))

      setData(formattedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Warning",
        description: "Failed to load products. Please check your connection.",
        variant: "destructive",
      })
      // Don't clear existing data on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setViewDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setAddProduct(true)
  }

  const handleUpdateStock = (product: Product) => {
    setSelectedProduct(product)
    setUpdateStockDialogOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSuccess = async () => {
    if (selectedProduct) {
      // Optimistically update the UI
      setData((prevData) => prevData.filter((item) => item.id !== selectedProduct.id))
      setSelectedRows((prevSelected) => prevSelected.filter((id) => id !== selectedProduct.id))
      setSelectedProduct(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleFormClose = (newProduct?: Product) => {
    setAddProduct(false)
    setSelectedProduct(null)

    // If a new product was added or an existing one was updated, refresh the product list
    if (newProduct) {
      fetchProducts()
      toast({
        title: "Success",
        description: selectedProduct ? "Product updated successfully!" : "Product added successfully!",
      })
    }
  }

  const handleStockUpdate = (updatedProduct: Product) => {
    // Update the product in the local state
    setData((prevData) =>
      prevData.map((item) =>
        item.id === updatedProduct.id
          ? {
              ...item,
              inventory: updatedProduct.inventory,
              stock: updatedProduct.inventory?.quantity || 0,
            }
          : item,
      ),
    )
    setUpdateStockDialogOpen(false)
    setSelectedProduct(null)
  }

  const handleSectionUpdate = (product: Product) => {
    setSelectedProduct(product)
    setSectionUpdateDialogOpen(true)
  }

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return

    try {
      setLoading(true)

      // Delete each selected product
      const deletePromises = selectedRows.map(async (id) => {
        try {
          await productService.deleteProduct(id)
          return { id, success: true }
        } catch (error) {
          console.error(`Failed to delete product ${id}:`, error)
          return { id, success: false, error }
        }
      })

      const results = await Promise.all(deletePromises)
      const successfulDeletes = results.filter((result) => result.success).map((result) => result.id)
      const failedDeletes = results.filter((result) => !result.success)

      // Update the UI with successfully deleted products
      if (successfulDeletes.length > 0) {
        setData((prevData) => prevData.filter((item) => !successfulDeletes.includes(item.id)))
        setSelectedRows([])
      }

      // Show appropriate toast messages
      if (failedDeletes.length === 0) {
        toast({
          title: "Success",
          description: `${successfulDeletes.length} products deleted successfully`,
        })
      } else if (successfulDeletes.length === 0) {
        toast({
          title: "Error",
          description: "Failed to delete products. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Partial Success",
          description: `${successfulDeletes.length} products deleted, ${failedDeletes.length} failed`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in bulk delete:", error)
      toast({
        title: "Error",
        description: "Failed to delete products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    // Get the data to export (either selected rows or all filtered data)
    const exportData =
      selectedRows.length > 0
        ? data.filter((item) => selectedRows.includes(item.id))
        : table.getFilteredRowModel().rows.map((row) => row.original)

    // Convert to CSV
    const headers = ["ID", "Name", "SKU", "Price", "Stock", "Status", "Categories", "Vendor"]
    const csvContent = [
      headers.join(","),
      ...exportData.map((item) =>
        [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
          `"${item.sku}"`,
          item.price,
          item.inventory?.quantity || 0,
          item.status,
          `"${item.categories?.join(", ") || ""}"`,
          `"${item.vendor_name || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `products_export_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: `${exportData.length} products exported to CSV`,
    })
  }

  // Define a global filter function that searches across multiple fields
  const globalFilterFn = useCallback((row: any, columnId: string, filterValue: string) => {
    const searchValue = filterValue.toLowerCase()

    // Search in name
    if (row.getValue("name").toString().toLowerCase().includes(searchValue)) {
      return true
    }

    // Search in SKU
    if (row.getValue("sku").toString().toLowerCase().includes(searchValue)) {
      return true
    }

    // Search in categories
    const categories: string[] = row.getValue("categories") || []
    if (categories.some((category) => category.toLowerCase().includes(searchValue))) {
      return true
    }

    // Search in vendor name
    const vendorName = row.getValue("vendor_name")
    if (vendorName && vendorName.toString().toLowerCase().includes(searchValue)) {
      return true
    }

    return false
  }, [])

  // Define columns
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getFilteredRowModel().rows.length > 0 &&
            table.getFilteredRowModel().rows.every((row) => selectedRows.includes(row.original.id))
          }
          onCheckedChange={(value) => {
            if (value) {
              setSelectedRows(table.getFilteredRowModel().rows.map((row) => row.original.id))
            } else {
              setSelectedRows([])
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRows.includes(row.original.id)}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedRows([...selectedRows, row.original.id])
            } else {
              setSelectedRows(selectedRows.filter((id) => id !== row.original.id))
            }
          }}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original
        // Find primary image or first image
        const primaryImage = product.images?.find((img) => img.isPrimary)
        const imageUrl = primaryImage?.url || product.images?.[0]?.url

        return (
          <div className="w-10 h-10 rounded-md overflow-hidden">
            {imageUrl ? (
              <img
                src={getFullImageUrl(imageUrl) || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=40&width=40"
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Package className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-[200px] truncate" title={row.getValue("name")}>
            {row.getValue("name")}
          </div>
        )
      },
    },
    {
      accessorKey: "sku",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            SKU
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="max-w-[100px] truncate" title={row.getValue("sku")}>
            {row.getValue("sku")}
          </div>
        )
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Price
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price)
        return <div>{formatted}</div>
      },
    },
    {
      accessorKey: "inventory.quantity",
      id: "stock",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Stock
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const product = row.original
        const stock = product.inventory?.quantity || 0
        const lowThreshold = product.inventory?.lowStockThreshold || 10
        const stockStatus = getStockStatus(stock, lowThreshold)

        return (
          <div className="flex items-center gap-2">
            <span>{stock}</span>
            <Badge variant="outline" className={`${stockStatus.color} text-xs`}>
              {stockStatus.label}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Status
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as ProductStatus
        return (
          <div className={`capitalize px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(status)}`}>
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) => {
        const categories: string[] = row.getValue("categories") || []
        return (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {categories.slice(0, 2).map((category) => (
              <span key={category} className="text-xs bg-gray-100 px-2 py-1 rounded truncate">
                {category}
              </span>
            ))}
            {categories.length > 2 && <span className="text-xs text-gray-500">+{categories.length - 2} more</span>}
          </div>
        )
      },
    },
    {
      accessorKey: "vendor_name",
      header: "Vendor",
      cell: ({ row }) => {
        return (
          <div className="max-w-[120px] truncate" title={row.getValue("vendor_name")}>
            {row.getValue("vendor_name") || "N/A"}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleView(product)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(product)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStock(product)}>
                <Package className="mr-2 h-4 w-4" />
                Update Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSectionUpdate(product)}>
                <Tags className="mr-2 h-4 w-4" />
                Section Update
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(product)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Update the table data source to use data directly instead of filteredData
  const table = useReactTable({
    data, // Use data directly instead of filteredData
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  })

  return (
    <>
      {addProduct ? (
        <ProductForm key={formKey} initialData={selectedProduct || undefined} setIsAddOpen={handleFormClose} />
      ) : (
        <div className="w-full">
          {/* Search and action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Search by name, SKU, category, or vendor..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="w-full pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={loading}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedRows.length})
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={loading || data.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

              <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <Button
                onClick={() => {
                  setSelectedProduct(null)
                  setFormKey((prev) => prev + 1)
                  setAddProduct(true)
                }}
                className="whitespace-nowrap"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden relative">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="min-w-full">
                <Table>
                  {/* Table header */}
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="whitespace-nowrap">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                            Loading products...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-2">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No products found.</p>
                            {globalFilter && (
                              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-white to-transparent w-8 pointer-events-none opacity-0 sm:opacity-100"></div>
            <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-white to-transparent w-8 pointer-events-none opacity-0 sm:opacity-100"></div>
          </div>

          {/* Pagination table footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} product(s) total
              {selectedRows.length > 0 && ` • ${selectedRows.length} selected`}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Dialogs */}
          {selectedProduct && (
            <>
              <ProductDetailsDialog
                product={selectedProduct}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
                onEdit={() => {
                  setViewDialogOpen(false)
                  handleEdit(selectedProduct)
                }}
              />
              <DeleteConfirmationDialog
                id={selectedProduct.id}
                productName={selectedProduct.name}
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                  setDeleteDialogOpen(open)
                  if (!open) {
                    setSelectedProduct(null)
                  }
                }}
                onConfirm={handleDeleteSuccess}
              />
              <UpdateStockDialog
                product={selectedProduct}
                open={updateStockDialogOpen}
                onOpenChange={(open) => {
                  setUpdateStockDialogOpen(open)
                  if (!open) {
                    setSelectedProduct(null)
                  }
                }}
                onUpdate={handleStockUpdate}
              />
              <SectionUpdateDialog
                product={selectedProduct}
                open={sectionUpdateDialogOpen}
                onOpenChange={(open) => {
                  setSectionUpdateDialogOpen(open)
                  if (!open) {
                    setSelectedProduct(null)
                  }
                }}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
