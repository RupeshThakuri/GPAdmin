import { z } from "zod";

// Helper schema for positive numbers (including optional/nullable)
const positiveNumber = z.number().min(0);

const inventorySchema = z.object({
  trackInventory: z.boolean().default(true),
  quantity: positiveNumber.default(0),
  allowBackorders: z.boolean().default(false),
  lowStockThreshold: positiveNumber.optional(),
});

const dimensionsSchema = z.object({
  length: positiveNumber.optional().nullable(),
  width: positiveNumber.optional().nullable(),
  height: positiveNumber.optional().nullable(),
  unit: z.enum(["cm", "m", "in", "ft"]).default("cm"),
});

const shippingSchema = z.object({
  weight: positiveNumber.optional().nullable(),
  weightUnit: z.enum(["kg", "g", "lb", "oz"]).default("kg"),
  dimensions: dimensionsSchema,
  shippingClass: z.string().optional(),
  freeShipping: z.boolean().default(false),
  shippingNote: z.string().optional(),
});

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "Image URL is required"),
  alt: z.string().default(""),
  isPrimary: z.boolean().default(false),
});

const variantOptionSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  values: z.array(z.string().min(1, "Value cannot be empty")).min(1, "At least one value is required"),
  unit: z.string().default(""),
});

const variantSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  price: positiveNumber,
  compareAtPrice: positiveNumber.optional(),
  quantity: positiveNumber.default(0),
  image: z.string().default(""),
  unit: z.string().default(""),
  attributes: z.record(z.string()).default({}),
});

const specificationSchema = z.object({
  name: z.string().min(1, "Specification name is required"),
  value: z.string().min(1, "Specification value is required"),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  vendor: z.string().min(1, "Vendor is required"),
  brand: z.string().min(1, "Brand is required"),
  categories: z.array(z.string().min(1)).min(1, "At least one category is required"),
  tags: z.array(z.string()).default([]),
  shortDescription: z.string().default(""),
  fullDescription: z.string().default(""),
  features: z.array(z.string()).default([]),
  specifications: z.array(specificationSchema).default([]),
  price: positiveNumber,
  compareAtPrice: positiveNumber.optional().nullable(),
  discount: z.number().min(0).max(100).optional().nullable(),
  taxable: z.boolean().default(true),
  taxCode: z.string().default(""),
  inventory: inventorySchema,
  images: z.array(imageSchema).default([]),
  primaryImageIndex: z.number().optional().nullable(),
  hasVariants: z.boolean().default(false),
  variantOptions: z.array(variantOptionSchema).default([]),
  variants: z.array(variantSchema).default([]),
  shipping: shippingSchema,
  status: z.enum(["draft", "published", "scheduled"]).default("published"),
  visibility: z.enum(["visible", "hidden", "featured"]).default("visible"),
  publishDate: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;