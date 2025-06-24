"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  [key: string]: any
}

interface SectionUpdateDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SectionData {
  id?: string
  product_id: string
  hot_deals: boolean
  flash_sales: boolean
  huge_discounts: boolean
  limited_offers: boolean
  daily_deals: boolean
  clearance: boolean
}

const SECTION_OPTIONS = [
  { key: "hot_deals", label: "Hot Deals", icon: "🔥" },
  { key: "flash_sales", label: "Flash Sales", icon: "⚡" },
  { key: "huge_discounts", label: "Huge Discounts", icon: "💰" },
  { key: "limited_offers", label: "Limited Offers", icon: "⏰" },
  { key: "daily_deals", label: "Daily Deals", icon: "🌟" },
  { key: "clearance", label: "Clearance", icon: "🎯" },
]

export function SectionUpdateDialog({ product, open, onOpenChange }: SectionUpdateDialogProps) {
  const [sectionData, setSectionData] = useState<SectionData>({
    product_id: "",
    hot_deals: false,
    flash_sales: false,
    huge_discounts: false,
    limited_offers: false,
    daily_deals: false,
    clearance: false,
  })
  const [loading, setLoading] = useState(false)
  const [existingSection, setExistingSection] = useState<SectionData | null>(null)
  const { toast } = useToast()

  // Fetch existing sections when dialog opens
  useEffect(() => {
    if (open && product) {
      fetchExistingSection()
    }
  }, [open, product])

  const fetchExistingSection = async () => {
    if (!product) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/sections/?product_id=${product.id}`)
      const data = await response.json()

      if (data && data.length > 0) {
        const section = data[0]
        setExistingSection(section)
        setSectionData({
          id: section.id,
          product_id: product.id,
          hot_deals: section.hot_deals || false,
          flash_sales: section.flash_sales || false,
          huge_discounts: section.huge_discounts || false,
          limited_offers: section.limited_offers || false,
          daily_deals: section.daily_deals || false,
          clearance: section.clearance || false,
        })
      } else {
        setExistingSection(null)
        setSectionData({
          product_id: product.id,
          hot_deals: false,
          flash_sales: false,
          huge_discounts: false,
          limited_offers: false,
          daily_deals: false,
          clearance: false,
        })
      }
    } catch (error) {
      console.error("Error fetching section:", error)
      toast({
        title: "Error",
        description: "Failed to load section data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSectionToggle = (key: keyof SectionData) => {
    if (key === "id" || key === "product_id") return

    setSectionData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    if (!product) return

    setLoading(true)
    try {
      let response

      // Prepare the data payload
      const payload = {
        product_id: product.id,
        hot_deals: sectionData.hot_deals,
        flash_sales: sectionData.flash_sales,
        huge_discounts: sectionData.huge_discounts,
        limited_offers: sectionData.limited_offers,
        daily_deals: sectionData.daily_deals,
        clearance: sectionData.clearance,
      }

      console.log("Sending payload:", payload) // Debug log

      if (existingSection) {
        // Update existing section
        response = await fetch(`http://localhost:8000/api/sections/${existingSection.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      } else {
        // Create new section
        response = await fetch("http://localhost:8000/api/sections/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error:", errorData) // Debug log
        throw new Error(`Failed to save section data: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Save successful:", result) // Debug log

      toast({
        title: "Success",
        description: "Section updated successfully",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error saving section:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save section data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Sections for {product?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              <Label>Select Sections</Label>
              <div className="grid gap-3">
                {SECTION_OPTIONS.map((option) => (
                  <div key={option.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={option.key}
                      checked={sectionData[option.key as keyof SectionData] as boolean}
                      onCheckedChange={() => handleSectionToggle(option.key as keyof SectionData)}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-lg">{option.icon}</span>
                      <Label htmlFor={option.key} className="cursor-pointer font-medium">
                        {option.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
