import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  
  prepareHeaders: (headers) => {
    const isAdminPage = window.location.pathname.startsWith("/admin");
    const token = isAdminPage
      ? localStorage.getItem("adminToken") 
      : localStorage.getItem("token"); 

    // if token is found, set it to the Authorization header
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category", "Discount", "UserCoupon"],
  endpoints: () => ({}),
});
