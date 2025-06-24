const INVENTORY_API_URL = process.env.NEXT_PUBLIC_INVENTORY_API_URL || "http://localhost:8001/api/inventory"

// Create a proper fetch wrapper for inventory service
const inventoryRequest = async (url: string, options: RequestInit = {}) => {
  const fullUrl = url.startsWith("http") ? url : `${INVENTORY_API_URL}${url}`

  try {
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
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

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    } else {
      throw new Error("Response is not JSON")
    }
  } catch (error) {
    console.error("Inventory API Request failed:", error)
    throw error
  }
}

export interface InventoryData {
  id: string
  product_id: string
  quantity: number
  track_inventory: boolean
  allow_backorders: boolean
  low_stock_threshold: number
  created_at: string
  updated_at: string
}

export interface UpdateInventoryData {
  quantity?: number
  track_inventory?: boolean
  allow_backorders?: boolean
  low_stock_threshold?: number
}

// Mock data for better fallback
const mockInventoryData: InventoryData[] = [
  {
    id: "1",
    product_id: "1",
    quantity: 45,
    track_inventory: true,
    allow_backorders: false,
    low_stock_threshold: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const inventoryService = {
  getInventoryByProductId: async (productId: string): Promise<InventoryData> => {
    try {
      const response = await inventoryRequest(`/products/${productId}/`)
      return response
    } catch (error) {
      console.error("Error fetching inventory, using mock data:", error)
      return mockInventoryData.find((inv) => inv.product_id === productId) || mockInventoryData[0]
    }
  },

  updateInventory: async (productId: string, data: UpdateInventoryData): Promise<InventoryData> => {
    try {
      const response = await inventoryRequest(`/products/${productId}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return response
    } catch (error) {
      console.error("Error updating inventory:", error)
      throw error
    }
  },

  adjustStock: async (productId: string, adjustment: number, reason?: string): Promise<InventoryData> => {
    try {
      const response = await inventoryRequest(`/products/${productId}/adjust/`, {
        method: "POST",
        body: JSON.stringify({
          adjustment,
          reason,
        }),
      })
      return response
    } catch (error) {
      console.error("Error adjusting stock:", error)
      throw error
    }
  },

  getBatchInventory: async (productIds: string[]): Promise<InventoryData[]> => {
    try {
      const response = await inventoryRequest("/batch/", {
        method: "POST",
        body: JSON.stringify({
          product_ids: productIds,
        }),
      })
      return response
    } catch (error) {
      console.error("Error fetching batch inventory:", error)
      return productIds.map((id) => ({
        ...mockInventoryData[0],
        id,
        product_id: id,
      }))
    }
  },

  getInventoryHistory: async (productId: string): Promise<any[]> => {
    try {
      const response = await inventoryRequest(`/products/${productId}/history/`)
      return response
    } catch (error) {
      console.error("Error fetching inventory history:", error)
      return []
    }
  },

  getLowStockProducts: async (): Promise<InventoryData[]> => {
    try {
      const response = await inventoryRequest("/low-stock/")
      return response
    } catch (error) {
      console.error("Error fetching low stock products:", error)
      return []
    }
  },
}
