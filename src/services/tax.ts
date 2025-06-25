import { api } from "./api"
import type { Tax, ApiResponse, PaginatedResponse, QueryParams } from "../types"

export const taxApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTaxes: builder.query<PaginatedResponse<Tax>, QueryParams>({
      query: (params = {}) => ({
        url: "/taxes",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      }),
      providesTags: ["Tax"],
    }),
    getTaxById: builder.query<ApiResponse<Tax>, string>({
      query: (id) => `/taxes/${id}`,
      providesTags: (result, error, id) => [{ type: "Tax", id }],
    }),
    createTax: builder.mutation<ApiResponse<Tax>, Partial<Tax>>({
      query: (tax) => ({
        url: "/taxes",
        method: "POST",
        body: tax,
      }),
      invalidatesTags: ["Tax"],
    }),
    updateTax: builder.mutation<ApiResponse<Tax>, { id: string; data: Partial<Tax> }>({
      query: ({ id, data }) => ({
        url: `/taxes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Tax", id }],
    }),
    deleteTax: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/taxes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tax"],
    }),
  }),
})

export const {
  useGetTaxesQuery,
  useGetTaxByIdQuery,
  useCreateTaxMutation,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} = taxApi
