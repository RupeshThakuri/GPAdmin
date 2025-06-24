"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { productService } from "../../services/api-service"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  inventory: {
    quantity: number
    trackInventory: boolean
    allowBackorders: boolean
    lowStockThreshold: number
  }
}

interface UpdateStockDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedProduct: Product) => void
}

export function UpdateStockDialog({ product, open, onOpenChange, onUpdate }: UpdateStockDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    quantity: product.inventory.quantity,
    trackInventory: product.inventory.trackInventory,
    allowBackorders: product.inventory.allowBackorders,
    lowStockThreshold: product.inventory.lowStockThreshold,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // Use the dedicated stock update endpoint
      const response = await productService.updateStock(product.id, {
        quantity: formData.quantity,
        trackInventory: formData.trackInventory,
        allowBackorders: formData.allowBackorders,
        lowStockThreshold: formData.lowStockThreshold,
      })

      // Update the product in the parent component
      onUpdate({
        ...product,
        inventory: {
          quantity: response.new_quantity || formData.quantity,
          trackInventory: response.trackInventory || formData.trackInventory,
          allowBackorders: response.allowBackorders || formData.allowBackorders,
          lowStockThreshold: response.lowStockThreshold || formData.lowStockThreshold,
        },
      })

      toast({
        title: "Stock Updated",
        description: "Product inventory has been successfully updated.",
      })

      onOpenChange(false)
    } catch (error: any) {
      console.error("Error updating stock:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update stock. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReset = () => {
    setFormData({
      quantity: product.inventory.quantity,
      trackInventory: product.inventory.trackInventory,
      allowBackorders: product.inventory.allowBackorders,
      lowStockThreshold: product.inventory.lowStockThreshold,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Update Stock
          </DialogTitle>
          <DialogDescription>Update inventory settings for "{product.name}"</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Current Stock Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
              placeholder="Enter stock quantity"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              min="0"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData((prev) => ({ ...prev, lowStockThreshold: Number(e.target.value) }))}
              placeholder="Enter low stock threshold"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trackInventory"
                checked={formData.trackInventory}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, trackInventory: !!checked }))}
              />
              <Label htmlFor="trackInventory" className="text-sm font-normal">
                Track inventory for this product
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowBackorders"
                checked={formData.allowBackorders}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allowBackorders: !!checked }))}
              />
              <Label htmlFor="allowBackorders" className="text-sm font-normal">
                Allow backorders when out of stock
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isUpdating}>
              Reset
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Stock"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
