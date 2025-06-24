import { Vendor } from "@/types/vendor";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface VendorActionMenuProps {
  vendor: Vendor;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function VendorActionMenu({ vendor, onEdit, onDelete, onToggleStatus }: VendorActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit vendor</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={vendor.status === "active"}
              onCheckedChange={onToggleStatus}
            />
            <span>Active Status</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete vendor</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}