module.exports = {

"[project]/src/services/api-service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "categoryService": (()=>categoryService),
    "productService": (()=>productService),
    "vendorService": (()=>vendorService)
});
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
// Create a proper fetch wrapper that handles errors correctly
const apiRequest = async (url, options = {})=>{
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    try {
        const response = await fetch(fullUrl, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            ...options
        });
        // Check if response is ok
        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorData.error || errorMessage;
            } catch  {
                // If response is not JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            throw new Error("Response is not JSON");
        }
    } catch (error) {
        console.error("API Request failed:", error);
        throw error;
    }
};
// Transform form data to match backend API format
const transformFormDataToApiFormat = (formData)=>{
    return {
        name: formData.name,
        sku: formData.sku,
        vendor: Number(formData.vendor),
        brand: formData.brand,
        categories: formData.categories.map((cat)=>Number(cat)),
        tags: formData.tags || [],
        short_description: formData.shortDescription || "",
        full_description: formData.fullDescription || "",
        features: formData.features || [],
        specifications: formData.specifications || [],
        price: Number(formData.price),
        compare_at_price: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        discount: formData.discount ? Number(formData.discount) : null,
        taxable: formData.taxable || false,
        tax_code: formData.taxCode || "",
        has_variants: formData.hasVariants || false,
        variant_options: formData.variantOptions || [],
        // Handle inventory as nested object for your backend
        inventory: {
            quantity: formData.inventory?.quantity || 0,
            trackInventory: formData.inventory?.trackInventory || true,
            allowBackorders: formData.inventory?.allowBackorders || false,
            lowStockThreshold: formData.inventory?.lowStockThreshold || 5
        },
        // Handle shipping as individual fields to match your model
        weight: formData.shipping?.weight || null,
        weight_unit: formData.shipping?.weightUnit || "kg",
        length: formData.shipping?.dimensions?.length || null,
        width: formData.shipping?.dimensions?.width || null,
        height: formData.shipping?.dimensions?.height || null,
        dimensions_unit: formData.shipping?.dimensions?.unit || "cm",
        shipping_class: formData.shipping?.shippingClass || "",
        free_shipping: formData.shipping?.freeShipping || false,
        shipping_note: formData.shipping?.shippingNote || "",
        status: formData.status || "draft",
        visibility: formData.visibility || "visible",
        primaryImageIndex: formData.primaryImageIndex,
        variants: formData.hasVariants && formData.variants ? formData.variants.map((variant)=>({
                name: variant.name,
                sku: variant.sku,
                price: Number(variant.price),
                compare_at_price: variant.compareAtPrice ? Number(variant.compareAtPrice) : null,
                unit: variant.unit || "",
                attributes: variant.attributes || {}
            })) : []
    };
};
// Mock data for fallback
const mockProducts = [
    {
        id: "1",
        name: "Premium Wireless Headphones",
        sku: "WH-1000",
        price: 299.99,
        stock: 45,
        status: "published",
        categories: [
            "Electronics",
            "Audio"
        ],
        vendor: "TechGear",
        images: [
            {
                url: "/placeholder.svg?height=200&width=200"
            }
        ]
    },
    {
        id: "2",
        name: "Ultra HD Smart TV",
        sku: "TV-4K-55",
        price: 899.99,
        stock: 12,
        status: "published",
        categories: [
            "Electronics",
            "TVs"
        ],
        vendor: "ElectroTech",
        images: [
            {
                url: "/placeholder.svg?height=200&width=200"
            }
        ]
    }
];
const productService = {
    getAllProducts: async ()=>{
        try {
            const response = await apiRequest("/products/");
            return response;
        } catch (error) {
            console.error("Error fetching products, using mock data:", error);
            return mockProducts;
        }
    },
    getProductById: async (id)=>{
        try {
            const response = await apiRequest(`/products/${id}/`);
            return response;
        } catch (error) {
            console.error("Error fetching product, using mock data:", error);
            return mockProducts.find((p)=>p.id === id);
        }
    },
    createProduct: async (productData, imageFiles)=>{
        try {
            // Transform the data to match backend format
            const transformedData = transformFormDataToApiFormat(productData);
            // Create FormData for file uploads
            const formData = new FormData();
            // Add product data as JSON string
            formData.append("data", JSON.stringify(transformedData));
            // Add image files
            imageFiles.forEach((file)=>{
                formData.append("images", file);
            });
            const response = await fetch(`${API_BASE_URL}/products/`, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.error || errorMessage;
                } catch  {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },
    updateProduct: async (id, productData, imageFiles = [], deleteImageIds = [])=>{
        console.log("product update call");
        try {
            // Transform the data to match backend format
            const transformedData = transformFormDataToApiFormat(productData);
            // Create FormData for file uploads
            const formData = new FormData();
            // Add product data as JSON string
            formData.append("data", JSON.stringify(transformedData));
            // Add new image files
            imageFiles.forEach((file)=>{
                formData.append("images", file);
            });
            // Add image IDs to delete
            deleteImageIds.forEach((imageId)=>{
                formData.append("delete_images", imageId);
            });
            console.log("Updating product with ID:", id);
            console.log("Transformed data:", transformedData);
            console.log("Image files:", imageFiles.length);
            console.log("Delete image IDs:", deleteImageIds);
            const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
                method: "PATCH",
                body: formData
            });
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.log("Update error response:", errorData);
                    errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData) || errorMessage;
                } catch  {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            const result = await response.json();
            console.log("Product updated successfully:", result);
            return result;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },
    deleteProduct: async (id)=>{
        try {
            const response = await apiRequest(`/products/${id}/`, {
                method: "DELETE"
            });
            // Django DELETE typically returns 204 No Content on success
            return {
                success: true,
                message: "Product deleted successfully"
            };
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },
    updateStock: async (id, stockData)=>{
        try {
            const response = await apiRequest(`/products/${id}/update_stock/`, {
                method: "POST",
                body: JSON.stringify(stockData)
            });
            return response;
        } catch (error) {
            console.error("Error updating stock:", error);
            throw error;
        }
    }
};
const categoryService = {
    getAllCategories: async ()=>{
        try {
            const response = await apiRequest("/categories/");
            return response;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [
                {
                    id: 1,
                    category_name: "Electronics"
                },
                {
                    id: 2,
                    category_name: "Clothing"
                },
                {
                    id: 3,
                    category_name: "Home & Garden"
                }
            ];
        }
    },
    createCategory: async (categoryData)=>{
        console.log("Creating category with data:", categoryData);
        const formData = new FormData();
        formData.append("category_name", categoryData.name) // Map 'name' to 'category_name'
        ;
        if (categoryData.parent_category) {
            formData.append("parent_category", categoryData.parent_category.toString());
        }
        // Ensure user_id is sent as "user" field
        if (categoryData.user_id) {
            formData.append("user", categoryData.user_id.toString());
            console.log("Added user ID:", categoryData.user_id.toString());
        } else {
            console.error("No user_id provided in categoryData");
        }
        // Only append image if it exists and is a File object
        if (categoryData.image && categoryData.image instanceof File) {
            formData.append("image", categoryData.image);
        }
        try {
            console.log("FormData contents:");
            for (const [key, value] of formData.entries()){
                console.log(key, value);
            }
            const response = await fetch(`${API_BASE_URL}/categories/`, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.log("Error response:", errorData);
                    errorMessage = errorData.detail || errorData.error || errorMessage;
                } catch  {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    }
};
const vendorService = {
    getAllVendors: async ()=>{
        try {
            const response = await apiRequest("/vendors/");
            return response;
        } catch (error) {
            console.error("Error fetching vendors:", error);
            return [
                {
                    id: 1,
                    name: "Default Vendor"
                },
                {
                    id: 2,
                    name: "TechGear"
                },
                {
                    id: 3,
                    name: "ElectroTech"
                }
            ];
        }
    }
};
}}),
"[project]/src/services/product-form-schema.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "productFormSchema": (()=>productFormSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/dist/esm/index.js [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/dist/esm/v3/types.js [app-ssr] (ecmascript)");
;
const productFormSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["object"])({
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().min(1, "Name is required"),
    slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
    sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().min(1, "SKU is required"),
    vendor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().min(1, "Vendor is required"),
    brand: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().min(1, "Brand is required"),
    categories: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])()).min(1, "At least one category is required"),
    tags: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])()).optional().default([]),
    shortDescription: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
    fullDescription: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
    features: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])()).optional().default([]),
    specifications: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["object"])({
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])()
    })).optional().default([]),
    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().min(0, "Price must be greater than or equal to 0"),
    compareAtPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().optional(),
    discount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().min(0).max(100).optional(),
    taxable: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boolean"])().default(false),
    taxCode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
    inventory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["object"])({
        trackInventory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boolean"])().default(true),
        quantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().min(0).default(0),
        allowBackorders: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boolean"])().default(false),
        lowStockThreshold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().min(0).default(5)
    }),
    hasVariants: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boolean"])().default(false),
    variantOptions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["object"])({
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
        values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])()),
        unit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional()
    })).optional().default([]),
    variants: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["object"])({
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
        sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
        price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])(),
        compareAtPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().optional(),
        quantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])(),
        image: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
        unit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
        attributes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["record"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["any"])()).optional()
    })).optional().default([]),
    shipping: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["object"])({
        weight: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().optional(),
        weightUnit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enum"])([
            "kg",
            "g",
            "lb",
            "oz"
        ]).default("kg"),
        dimensions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["object"])({
            length: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().optional(),
            width: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().optional(),
            height: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().optional(),
            unit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enum"])([
                "cm",
                "m",
                "in",
                "ft"
            ]).default("cm")
        }),
        shippingClass: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
        freeShipping: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boolean"])().default(false),
        shippingNote: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional()
    }),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enum"])([
        "draft",
        "published",
        "scheduled"
    ]).default("draft"),
    visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enum"])([
        "visible",
        "hidden",
        "featured"
    ]).default("visible"),
    publishDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
    images: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["object"])({
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
        url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
        alt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])().optional(),
        isPrimary: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boolean"])().default(false),
        order: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().default(0)
    })).optional().default([]),
    primaryImageIndex: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])().optional()
});
}}),
"[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "reducer": (()=>reducer),
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
;
}}),
"[project]/src/app/products/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProductsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2f$dashboard$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Dashboard/dashboard-header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2f$dashboard$2d$shell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Dashboard/dashboard-shell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$product$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Products/product-table.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ProductsPage() {
    // const { user, loading } = useUser();
    // const router = useRouter();
    // useEffect(() => {
    //   if (!loading && user?.role !== 'admin') {
    //     router.push('/admin/login');
    //   }
    // }, [loading, user, router]);
    // if (loading || user?.role !== 'admin') {
    //   return <p>Loading...</p>; // or a spinner
    // }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2f$dashboard$2d$shell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardShell"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2f$dashboard$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardHeader"], {
                heading: "Products",
                text: "Manage your product inventory"
            }, void 0, false, {
                fileName: "[project]/src/app/products/page.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$product$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/products/page.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/products/page.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_2fed912d._.js.map