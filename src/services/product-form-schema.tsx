import { z } from "zod"

const inventorySchema = z.object({
  trackInventory: z.boolean().default(true),
  quantity: z.number().min(0).default(0),
  allowBackorders: z.boolean().default(false),
  lowStockThreshold: z.number().min(0).optional(),
})

const dimensionsSchema = z.object({
  length: z.number().min(0).optional().nullable(),
  width: z.number().min(0).optional().nullable(),
  height: z.number().min(0).optional().nullable(),
  unit: z.enum(["cm", "m", "in", "ft"]).default("cm"),
})

const shippingSchema = z.object({
  weight: z.number().min(0).optional().nullable(),
  weightUnit: z.enum(["kg", "g", "lb", "oz"]).default("kg"),
  dimensions: dimensionsSchema,
  shippingClass: z.string().optional(),
  freeShipping: z.boolean().default(false),
  shippingNote: z.string().optional(),
})

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
  is_primary: z.boolean().optional(),
})

const variantOptionSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  values: z.array(z.string().min(1, "Value cannot be empty")),
  unit: z.string().optional(),
})

const variantSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  quantity: z.number().min(0).default(0),
  image: z.string().optional(),
  unit: z.string().optional(),
  attributes: z.record(z.any()).optional(),
})

const specificationSchema = z.object({
  name: z.string().min(1, "Specification name is required"),
  value: z.string().min(1, "Specification value is required"),
})

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  vendor: z.string().min(1, "Vendor is required"),
  brand: z.string().min(1, "Brand is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  features: z.array(z.string()).optional(),
  specifications: z.array(specificationSchema).optional(),
  price: z.number().min(0, "Price must be positive"),
  compareAtPrice: z.number().min(0).optional().nullable(),
  discount: z.number().min(0).max(100).optional().nullable(),
  taxable: z.boolean().default(true),
  taxCode: z.string().optional(),
  inventory: inventorySchema,
  images: z.array(imageSchema).optional(),
  primaryImageIndex: z.number().optional(),
  hasVariants: z.boolean().default(false),
  variantOptions: z.array(variantOptionSchema).optional(),
  variants: z.array(variantSchema).optional(),
  shipping: shippingSchema,
  status: z.enum(["draft", "published", "scheduled"]).default("published"),
  visibility: z.enum(["visible", "hidden", "featured"]).default("visible"),
  publishDate: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
