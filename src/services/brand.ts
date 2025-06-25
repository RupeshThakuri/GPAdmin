import { api } from "./api"
import type { Brand, ApiResponse, PaginatedResponse, QueryParams } from "@/types"

export const brandApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<PaginatedResponse<Brand>, QueryParams>({
      query: (params = {}) => ({
        url: "/brands",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      }),
      providesTags: ["Brand"],
    }),
    getBrandById: builder.query<ApiResponse<Brand>, string>({
      query: (id) => `/brands/${id}`,
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),
    createBrand: builder.mutation<ApiResponse<Brand>, Partial<Brand>>({
      query: (brand) => ({
        url: "/brands",
        method: "POST",
        body: brand,
      }),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation<ApiResponse<Brand>, { id: string; data: Partial<Brand> }>({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Brand", id }],
    }),
    deleteBrand: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
})

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi
