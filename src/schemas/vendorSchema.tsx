import { z } from "zod";

export const vendorFormSchema = z.object({
  name: z.string().min(2, { message: "Vendor name must be at least 2 characters." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  contact_person: z.string().min(2, { message: "Contact person name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Phone number is required." }),
  address: z.string().min(5, { message: "Address is required." }),
  created_at: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  commission: z.coerce.number().min(0).max(100),
  permissions: z.object({
    dashboard: z.object({
      view: z.boolean().default(false),
      analytics: z.boolean().default(false),
      reports: z.boolean().default(false),
      notifications: z.boolean().default(false),
      settings: z.boolean().default(false),
    }),
    products: z.object({
      view: z.boolean().default(false),
      add: z.boolean().default(false),
      edit: z.boolean().default(false),
      delete: z.boolean().default(false),
    }),
    orders: z.object({
      view: z.boolean().default(false),
      process: z.boolean().default(false),
      cancel: z.boolean().default(false),
    }),
    customers: z.object({
      view: z.boolean().default(false),
      contact: z.boolean().default(false),
    }),
    cms: z.object({
      view: z.boolean().default(false),
      edit: z.boolean().default(false),
    }),
  }),
});