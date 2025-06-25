import { api } from "./api"
import type { Currency, ApiResponse, PaginatedResponse, QueryParams } from "../types"

export const currencyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<PaginatedResponse<Currency>, QueryParams>({
      query: (params = {}) => ({
        url: "/currencies",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      }),
      providesTags: ["Currency"],
    }),
    getCurrencyById: builder.query<ApiResponse<Currency>, string>({
      query: (id) => `/currencies/${id}`,
      providesTags: (result, error, id) => [{ type: "Currency", id }],
    }),
    createCurrency: builder.mutation<ApiResponse<Currency>, Partial<Currency>>({
      query: (currency) => ({
        url: "/currencies",
        method: "POST",
        body: currency,
      }),
      invalidatesTags: ["Currency"],
    }),
    updateCurrency: builder.mutation<ApiResponse<Currency>, { id: string; data: Partial<Currency> }>({
      query: ({ id, data }) => ({
        url: `/currencies/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Currency", id }],
    }),
    deleteCurrency: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/currencies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Currency"],
    }),
  }),
})

export const {
  useGetCurrenciesQuery,
  useGetCurrencyByIdQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
} = currencyApi
