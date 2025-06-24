export interface Vendor {
  id?: string | number
  name: string
  email: string
  phone: string
  address: string
  contact_person: string
  status: "active" | "inactive" | "pending"
  commission: number
  role?: "admin" | "vendor"
  created_at: string
  updated_at?: string
  password?: string
  permissions: {
    dashboard: {
      view: boolean
      analytics: boolean
      reports: boolean
      notifications: boolean
      settings: boolean
    }
    products: {
      view: boolean
      add: boolean
      edit: boolean
      delete: boolean
    }
    orders: {
      view: boolean
      process: boolean
      cancel: boolean
    }
    customers: {
      view: boolean
      contact: boolean
    }
    cms: {
      view: boolean
      edit: boolean
    }
  }
}
