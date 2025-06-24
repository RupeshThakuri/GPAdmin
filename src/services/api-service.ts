const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

// Create a proper fetch wrapper that handles errors correctly
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`

  try {
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    // Check if response is ok
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.error || errorMessage
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    } else {
      throw new Error("Response is not JSON")
    }
  } catch (error) {
    console.error("API Request failed:", error)
    throw error
  }
}

// Transform form data to match backend API format
const transformFormDataToApiFormat = (formData: any) => {
  return {
    name: formData.name,
    sku: formData.sku,
    vendor: Number(formData.vendor),
    brand: formData.brand,
    categories: formData.categories.map((cat: any) => Number(cat)),
    tags: formData.tags || [],
    short_description: formData.shortDescription || "",
    full_description: formData.fullDescription || "",
    features: formData.features || [],
    specifications: formData.specifications || [],
    price: Number(formData.price),
    compare_at_price: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
    discount: formData.discount ? Number(formData.discount) : null,
    taxable: formData.taxable || false,
    tax_code: formData.taxCode || "",
    has_variants: formData.hasVariants || false,
    variant_options: formData.variantOptions || [],
    // Handle inventory as nested object for your backend
    inventory: {
      quantity: formData.inventory?.quantity || 0,
      trackInventory: formData.inventory?.trackInventory || true,
      allowBackorders: formData.inventory?.allowBackorders || false,
      lowStockThreshold: formData.inventory?.lowStockThreshold || 5,
    },
    // Handle shipping fields - properly handle undefined values
    weight: formData.shipping?.weight !== undefined ? Number(formData.shipping.weight) : undefined,
    weight_unit: formData.shipping?.weightUnit || "kg",
    length:
      formData.shipping?.dimensions?.length !== undefined ? Number(formData.shipping.dimensions.length) : undefined,
    width: formData.shipping?.dimensions?.width !== undefined ? Number(formData.shipping.dimensions.width) : undefined,
    height:
      formData.shipping?.dimensions?.height !== undefined ? Number(formData.shipping.dimensions.height) : undefined,
    dimensions_unit: formData.shipping?.dimensions?.unit || "cm",
    shipping_class: formData.shipping?.shippingClass || "",
    free_shipping: formData.shipping?.freeShipping || false,
    shipping_note: formData.shipping?.shippingNote || "",
    status: formData.status || "draft",
    visibility: formData.visibility || "visible",
    primaryImageIndex: formData.primaryImageIndex,
    // Include existing images for updates
    existingImages: formData.existingImages || [],
    variants:
      formData.hasVariants && formData.variants
        ? formData.variants.map((variant: any) => ({
          name: variant.name,
          sku: variant.sku,
          price: Number(variant.price),
          compare_at_price: variant.compareAtPrice ? Number(variant.compareAtPrice) : null,
          unit: variant.unit || "",
          attributes: variant.attributes || {},
        }))
        : [],
  }
}

// Mock data for fallback
const mockProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    sku: "WH-1000",
    price: 299.99,
    stock: 45,
    status: "published",
    categories: ["Electronics", "Audio"],
    vendor: "TechGear",
    images: [{ url: "/placeholder.svg?height=200&width=200" }],
  },
  {
    id: "2",
    name: "Ultra HD Smart TV",
    sku: "TV-4K-55",
    price: 899.99,
    stock: 12,
    status: "published",
    categories: ["Electronics", "TVs"],
    vendor: "ElectroTech",
    images: [{ url: "/placeholder.svg?height=200&width=200" }],
  },
]

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await apiRequest("/products/")
      return response
    } catch (error) {
      console.error("Error fetching products, using mock data:", error)
      return mockProducts
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await apiRequest(`/products/${id}/`)
      return response
    } catch (error) {
      console.error("Error fetching product, using mock data:", error)
      return mockProducts.find((p) => p.id === id)
    }
  },

  createProduct: async (productData: any, imageFiles: File[]) => {
    try {
      // Transform the data to match backend format
      const transformedData = transformFormDataToApiFormat(productData)

      // Create FormData for file uploads
      const formData = new FormData()

      // Add product data as JSON string
      formData.append("data", JSON.stringify(transformedData))

      // Add image files
      imageFiles.forEach((file) => {
        formData.append("images", file)
      })

      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorData.error || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  },

  updateProduct: async (id: string, productData: any, imageFiles: File[] = [], deleteImageIds: string[] = []) => {
    console.log("product update call")
    try {
      // Transform the data to match backend format
      const transformedData = transformFormDataToApiFormat(productData)

      // If no images are being modified, send a regular JSON request
      const imagesModified = imageFiles.length > 0 || deleteImageIds.length > 0

      if (!imagesModified) {
        // Send as JSON when no images are involved
        const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        })

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`
          try {
            const errorData = await response.json()
            console.log("Update error response:", errorData)
            errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData) || errorMessage
          } catch {
            errorMessage = response.statusText || errorMessage
          }
          throw new Error(errorMessage)
        }

        const result = await response.json()
        console.log("Product updated successfully:", result)
        return result
      } else {
        // Use FormData when images are involved
        const formData = new FormData()

        // Add product data as JSON string
        formData.append("data", JSON.stringify(transformedData))
        formData.append("existing_images", JSON.stringify(productData.existingImages));

        // Add new image files
        imageFiles.forEach((file) => {
          formData.append("images", file)
        })

        // Add image IDs to delete
        deleteImageIds.forEach((imageId) => {
          formData.append("delete_images", imageId)
        })

        const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
          method: "PATCH",
          body: formData,
        })

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`
          try {
            const errorData = await response.json()
            console.log("Update error response:", errorData)
            errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData) || errorMessage
          } catch {
            errorMessage = response.statusText || errorMessage
          }
          throw new Error(errorMessage)
        }

        const result = await response.json()
        console.log("Product updated successfully:", result)
        return result
      }
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
      }

      // For successful deletion (204 No Content), don't try to parse JSON
      if (response.status === 204) {
        return { success: true, message: "Product deleted successfully" }
      }

      // Only try to parse JSON if there's content
      try {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          return await response.json()
        }
        return { success: true, message: "Product deleted successfully" }
      } catch (parseError) {
        // If parsing fails, still return success since the deletion worked
        return { success: true, message: "Product deleted successfully" }
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
  },

  updateStock: async (
    id: string,
    stockData: { quantity: number; trackInventory?: boolean; allowBackorders?: boolean; lowStockThreshold?: number },
  ) => {
    try {
      const response = await apiRequest(`/products/${id}/update_stock/`, {
        method: "POST",
        body: JSON.stringify(stockData),
      })
      return response
    } catch (error) {
      console.error("Error updating stock:", error)
      throw error
    }
  },
}

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await apiRequest("/categories/")
      return response
    } catch (error) {
      console.error("Error fetching categories:", error)
      return [
        { id: 1, category_name: "Electronics" },
        { id: 2, category_name: "Clothing" },
        { id: 3, category_name: "Home & Garden" },
      ]
    }
  },

  createCategory: async (categoryData: any) => {
    console.log("Creating category with data:", categoryData)

    const formData = new FormData()
    formData.append("category_name", categoryData.name) // Map 'name' to 'category_name'

    if (categoryData.parent_category) {
      formData.append("parent_category", categoryData.parent_category.toString())
    }

    // Ensure user_id is sent as "user" field
    if (categoryData.user_id) {
      formData.append("user", categoryData.user_id.toString())
      console.log("Added user ID:", categoryData.user_id.toString())
    } else {
      console.error("No user_id provided in categoryData")
    }

    // Only append image if it exists and is a File object
    if (categoryData.image && categoryData.image instanceof File) {
      formData.append("image", categoryData.image)
    }

    try {
      console.log("FormData contents:")
      for (const [key, value] of formData.entries()) {
        console.log(key, value)
      }

      const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header when sending FormData
        // The browser will automatically set the correct multipart/form-data with boundary
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          console.log("Error response:", errorData)
          errorMessage = errorData.detail || errorData.error || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error creating category:", error)
      throw error
    }
  },
}

export const vendorService = {
  getAllVendors: async () => {
    try {
      const response = await apiRequest("/vendors/")
      return response
    } catch (error) {
      console.error("Error fetching vendors:", error)
      return [
        { id: 1, name: "Default Vendor" },
        { id: 2, name: "TechGear" },
        { id: 3, name: "ElectroTech" },
      ]
    }
  },
}
