import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // 🔥 Cho phép gửi cookie trong request
  prepareHeaders: (headers) => {
    // ✅ Kiểm tra trang hiện tại là Admin hay User
    const isAdminPage = window.location.pathname.startsWith("/admin");
    const token = isAdminPage
      ? localStorage.getItem("adminToken") // 🔥 Admin lấy token từ `adminToken`
      : localStorage.getItem("token"); // 🔥 User lấy token từ `token`

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});
