import { create } from 'zustand';
import { Vendor } from '@/types/vendor';

interface VendorState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  fetchVendors: () => Promise<void>;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (vendor: Vendor) => void;
  removeVendor: (id: string) => void;
  toggleVendorStatus: (id: string) => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  vendors: [],
  loading: false,
  error: null,
  
  fetchVendors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://127.0.0.1:8000/api/vendors/");
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      const data = await response.json();
      set({ vendors: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false 
      });
    }
  },
  
  addVendor: (vendor) => 
    set((state) => ({ 
      vendors: [...state.vendors, vendor] 
    })),
  
  updateVendor: (updatedVendor) => 
    set((state) => ({ 
      vendors: state.vendors.map(
        vendor => vendor.id === updatedVendor.id ? updatedVendor : vendor
      ) 
    })),
  
  removeVendor: (id) => 
    set((state) => ({ 
      vendors: state.vendors.filter(vendor => vendor.id !== id) 
    })),
  
  toggleVendorStatus: (id) => 
    set((state) => ({ 
      vendors: state.vendors.map(vendor => 
        vendor.id === id 
          ? { 
              ...vendor, 
              status: vendor.status === "active" ? "inactive" : "active"
            } 
          : vendor
      ) 
    })),
}));
