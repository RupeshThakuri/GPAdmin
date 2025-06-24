"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { productService } from "../../services/api-service"
import { useToast } from "@/components/ui/use-toast"

interface DeleteConfirmationDialogProps {
  id: string
  productName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
}

export function DeleteConfirmationDialog({
  id,
  productName,
  open,
  onOpenChange,
  onConfirm,
  title = "Confirm Deletion",
  description,
}: Readonly<DeleteConfirmationDialogProps>) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const defaultDescription = productName
    ? `Are you sure you want to delete "${productName}"? This action cannot be undone.`
    : "Are you sure you want to delete this item? This action cannot be undone."

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      // Call the API to delete the product
      await productService.deleteProduct(id)

      // Call the parent's onConfirm to update the UI
      await onConfirm()

      // Close the dialog
      onOpenChange(false)

      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
      })
    } catch (error: any) {
      console.error("Deletion failed:", error)

      // Even if the API call fails with 404 (already deleted), update the UI
      if (error.message?.includes("404") || error.status === 404) {
        await onConfirm() // Still update UI if product was already deleted
        onOpenChange(false)
        toast({
          title: "Product Deleted",
          description: "The product has been removed.",
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to delete product.",
          variant: "destructive",
        })
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description || defaultDescription}</DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
          <p className="font-medium">Warning:</p>
          <p>This action cannot be undone. This will permanently delete the product and all associated data.</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
