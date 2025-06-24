import { Vendor } from "@/types/vendor";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
  onDelete: () => void;
}

export function DeleteVendorDialog({ open, onOpenChange, vendor, onDelete }: DeleteVendorDialogProps) {
  if (!vendor) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Vendor</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this vendor? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-4 py-2">
          <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
          <div className="text-sm">
            <p className="font-medium">{vendor.name}</p>
            <p className="text-muted-foreground mt-1">{vendor.email}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}