// Backend integration utilities for Django REST API
const DJANGO_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

export interface DjangoErrorResponse {
  detail?: string
  error?: string
  [key: string]: any
}

export interface DjangoSuccessResponse {
  status: string
  message?: string
  [key: string]: any
}

// Handle Django REST Framework error responses
export const handleDjangoError = (error: any): string => {
  if (error.response?.data) {
    const data = error.response.data as DjangoErrorResponse

    // Handle field-specific errors
    if (typeof data === "object" && !data.detail && !data.error) {
      const fieldErrors = Object.entries(data)
        .map(([field, errors]) => {
          if (Array.isArray(errors)) {
            return `${field}: ${errors.join(", ")}`
          }
          return `${field}: ${errors}`
        })
        .join("; ")

      return fieldErrors || "Validation error occurred"
    }

    return data.detail || data.error || "An error occurred"
  }

  return error.message || "Network error occurred"
}

// Transform frontend product data to Django backend format
export const transformToBackendFormat = (frontendData: any) => {
  return {
    name: frontendData.name,
    sku: frontendData.sku,
    vendor: Number(frontendData.vendor), // Ensure vendor is a number
    brand: frontendData.brand,
    categories:
      frontendData.categories?.map((cat: any) =>
        typeof cat === "string" && !isNaN(Number(cat)) ? Number(cat) : cat,
      ) || [],
    tags: frontendData.tags || [],
    short_description: frontendData.shortDescription || "",
    full_description: frontendData.fullDescription || "",
    features: frontendData.features || [],
    specifications: frontendData.specifications || [],
    price: Number(frontendData.price),
    compare_at_price: frontendData.compareAtPrice ? Number(frontendData.compareAtPrice) : null,
    discount: frontendData.discount ? Number(frontendData.discount) : null,
    taxable: frontendData.taxable || false,
    tax_code: frontendData.taxCode || "",
    inventory: {
      quantity: frontendData.inventory?.quantity || 0,
      trackInventory: frontendData.inventory?.trackInventory ?? true,
      allowBackorders: frontendData.inventory?.allowBackorders ?? false,
      lowStockThreshold: frontendData.inventory?.lowStockThreshold || 5,
    },
    has_variants: frontendData.hasVariants || false,
    variant_options: frontendData.variantOptions || [],
    weight: frontendData.shipping?.weight || null,
    weight_unit: frontendData.shipping?.weightUnit || "kg",
    length: frontendData.shipping?.dimensions?.length || null,
    width: frontendData.shipping?.dimensions?.width || null,
    height: frontendData.shipping?.dimensions?.height || null,
    dimensions_unit: frontendData.shipping?.dimensions?.unit || "cm",
    shipping_class: frontendData.shipping?.shippingClass || "",
    free_shipping: frontendData.shipping?.freeShipping || false,
    shipping_note: frontendData.shipping?.shippingNote || "",
    status: frontendData.status || "draft",
    visibility: frontendData.visibility || "visible",
    variants:
      frontendData.hasVariants && frontendData.variants
        ? frontendData.variants.map((variant: any) => ({
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

// Transform Django backend data to frontend format
export const transformFromBackendFormat = (backendData: any) => {
  return {
    id: backendData.id,
    name: backendData.name,
    slug: backendData.slug,
    sku: backendData.sku,
    vendor: backendData.vendor?.toString() || "",
    vendor_name: backendData.vendor_name,
    brand: backendData.brand,
    categories: backendData.categories || [],
    tags: backendData.tags || [],
    shortDescription: backendData.short_description,
    fullDescription: backendData.full_description,
    features: backendData.features || [],
    specifications: backendData.specifications || [],
    price: Number(backendData.price),
    compareAtPrice: backendData.compare_at_price ? Number(backendData.compare_at_price) : undefined,
    discount: backendData.discount ? Number(backendData.discount) : undefined,
    taxable: backendData.taxable,
    taxCode: backendData.tax_code,
    inventory: {
      quantity: backendData.inventory?.quantity || 0,
      trackInventory: backendData.inventory?.trackInventory ?? true,
      allowBackorders: backendData.inventory?.allowBackorders ?? false,
      lowStockThreshold: backendData.inventory?.lowStockThreshold || 5,
    },
    hasVariants: backendData.has_variants,
    variantOptions: backendData.variant_options || [],
    variants: backendData.variants || [],
    shipping: {
      weight: backendData.weight,
      weightUnit: backendData.weight_unit || "kg",
      dimensions: {
        length: backendData.length,
        width: backendData.width,
        height: backendData.height,
        unit: backendData.dimensions_unit || "cm",
      },
      shippingClass: backendData.shipping_class,
      freeShipping: backendData.free_shipping,
      shippingNote: backendData.shipping_note,
    },
    status: backendData.status,
    visibility: backendData.visibility,
    images: backendData.images || [],
    created_at: backendData.created_at,
    updated_at: backendData.updated_at,
  }
}

// Validate required fields before sending to backend
export const validateProductData = (data: any): string[] => {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push("Product name is required")
  }

  if (!data.sku?.trim()) {
    errors.push("SKU is required")
  }

  if (!data.vendor) {
    errors.push("Vendor is required")
  }

  if (!data.brand?.trim()) {
    errors.push("Brand is required")
  }

  if (!data.categories || data.categories.length === 0) {
    errors.push("At least one category is required")
  }

  if (!data.price || data.price <= 0) {
    errors.push("Price must be greater than 0")
  }

  return errors
}
