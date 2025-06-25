export interface Product {
  id: string
  name: string
  categoryId: string
  unitId: string
  brandId: string
  taxId: string
  currencyId: string
  price: number
  cost: number
  stock: number
  sku: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Add this ProductFormValues type
export interface ProductFormValues {
  name: string
  categoryId: string
  unitId: string
  brandId: string
  taxId: string
  currencyId: string
  price: number
  cost: number
  stock: number
  sku: string
  description?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  createdAt: string
  updatedAt: string
}

export interface Unit {
  id: string
  name: string
  symbol: string
  type: "weight" | "volume" | "length" | "piece"
  createdAt: string
  updatedAt: string
}

export interface Brand {
  id: string
  name: string
  description?: string
  logo?: string
  website?: string
  createdAt: string
  updatedAt: string
}

export interface Tax {
  id: string
  name: string
  rate: number
  type: "percentage" | "fixed"
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Currency {
  id: string
  name: string
  code: string
  symbol: string
  exchangeRate: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Query parameters
export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}
