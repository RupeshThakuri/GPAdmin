import { api } from "./api"
import type { Unit, ApiResponse, PaginatedResponse, QueryParams } from "../types"

export const unitApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUnits: builder.query<PaginatedResponse<Unit>, QueryParams>({
      query: (params = {}) => ({
        url: "/units",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      }),
      providesTags: ["Unit"],
    }),
    getUnitById: builder.query<ApiResponse<Unit>, string>({
      query: (id) => `/units/${id}`,
      providesTags: (result, error, id) => [{ type: "Unit", id }],
    }),
    createUnit: builder.mutation<ApiResponse<Unit>, Partial<Unit>>({
      query: (unit) => ({
        url: "/units",
        method: "POST",
        body: unit,
      }),
      invalidatesTags: ["Unit"],
    }),
    updateUnit: builder.mutation<ApiResponse<Unit>, { id: string; data: Partial<Unit> }>({
      query: ({ id, data }) => ({
        url: `/units/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Unit", id }],
    }),
    deleteUnit: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Unit"],
    }),
  }),
})

export const {
  useGetUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi
