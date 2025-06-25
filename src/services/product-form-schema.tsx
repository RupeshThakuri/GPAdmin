import * as z from "zod"

export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  vendor: z.string().min(1, "Vendor is required"),
  brand: z.string().min(1, "Brand is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional().default([]),

  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  specifications: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    )
    .optional()
    .default([]),

  price: z.number().min(0, "Price must be greater than or equal to 0"),
  compareAtPrice: z.number().optional(),
  discount: z.number().min(0).max(100).optional(),
  taxable: z.boolean().default(false),
  taxCode: z.string().optional(),

  inventory: z.object({
    trackInventory: z.boolean().default(true),
    quantity: z.number().min(0).default(0),
    allowBackorders: z.boolean().default(false),
    lowStockThreshold: z.number().min(0).default(5),
  }),

  hasVariants: z.boolean().default(false),
  variantOptions: z
    .array(
      z.object({
        name: z.string(),
        values: z.array(z.string()),
        unit: z.string().optional(),
      }),
    )
    .optional()
    .default([]),

  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        sku: z.string(),
        price: z.number(),
        compareAtPrice: z.number().optional(),
        quantity: z.number(),
        image: z.string().optional(),
        unit: z.string().optional(),
        attributes: z.record(z.any()).optional(),
      }),
    )
    .optional()
    .default([]),

  shipping: z.object({
    weight: z.number().optional(),
    weightUnit: z.enum(["kg", "g", "lb", "oz"]).default("kg"),
    dimensions: z.object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      unit: z.enum(["cm", "m", "in", "ft"]).default("cm"),
    }),
    shippingClass: z.string().optional(),
    freeShipping: z.boolean().default(false),
    shippingNote: z.string().optional(),
  }),

  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  visibility: z.enum(["visible", "hidden", "featured"]).default("visible"),
  publishDate: z.string().optional(),

  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string(),
        alt: z.string().optional(),
        isPrimary: z.boolean().default(false),
        order: z.number().default(0),
      }),
    )
    .optional()
    .default([]),
  primaryImageIndex: z.number().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
