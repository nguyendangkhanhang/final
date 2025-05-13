import { apiSlice } from "./apiSlice";
import { USER_COUPON_URL } from "../constants";

export const userCouponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveUserCoupon: builder.mutation({
      query: (discountCodeId) => ({
        url: `${USER_COUPON_URL}`,
        method: "POST",
        body: { discountCodeId },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["UserCoupon"],
    }),

    getUserCoupons: builder.query({
      query: () => ({
        url: `${USER_COUPON_URL}`,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["UserCoupon"],
    }),

    markCouponAsUsed: builder.mutation({
      query: (couponId) => ({
        url: `${USER_COUPON_URL}/${couponId}/use`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["UserCoupon", "Discount"],
    }),    
  }),
});

export const {
  useSaveUserCouponMutation,
  useGetUserCouponsQuery,
  useMarkCouponAsUsedMutation,
} = userCouponApiSlice; 