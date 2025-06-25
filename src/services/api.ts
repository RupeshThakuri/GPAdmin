import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add authentication token if available
      const token = localStorage.getItem("authToken")
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      headers.set("content-type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Product", "Category", "Unit", "Brand", "Tax", "Currency"],
  endpoints: () => ({}),
})
