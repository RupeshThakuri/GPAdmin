import * as z from "zod"

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  unitId: z.string().min(1, "Unit is required"),
  brandId: z.string().min(1, "Brand is required"),
  taxId: z.string().min(1, "Tax is required"),
  currencyId: z.string().min(1, "Currency is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  cost: z.number().min(0, "Cost must be greater than or equal to 0"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
