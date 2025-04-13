import { apiSlice } from "./apiSlice";
import { DISCOUNT_URL, BACKEND_URL } from "../constants";

export const discountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDiscountCodes: builder.query({
      query: () => ({
        url: DISCOUNT_URL,
        credentials: "include",
      }),
      providesTags: ["Discount"],
    }),

    createDiscountCode: builder.mutation({
      query: (discountData) => ({
        url: DISCOUNT_URL,
        method: "POST",
        body: discountData,
        credentials: "include",
      }),
      invalidatesTags: ["Discount"],
    }),

    updateDiscountCode: builder.mutation({
      query: ({ id, discountData }) => ({
        url: `${DISCOUNT_URL}/${id}`,
        method: "PUT",
        body: discountData,
        credentials: "include",
      }),
      invalidatesTags: ["Discount"],
    }),

    deleteDiscountCode: builder.mutation({
      query: (id) => ({
        url: `${DISCOUNT_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Discount"],
    }),

    applyDiscountCode: builder.mutation({
      query: ({ code, items }) => {
        const token = localStorage.getItem("token");
        return {
          url: `${BACKEND_URL}${DISCOUNT_URL}/apply`,
          method: "POST",
          body: { code, items },
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useGetDiscountCodesQuery,
  useCreateDiscountCodeMutation,
  useUpdateDiscountCodeMutation,
  useDeleteDiscountCodeMutation,
  useApplyDiscountCodeMutation,
} = discountApiSlice; 