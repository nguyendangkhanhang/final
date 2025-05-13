import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal", discount: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Lấy tất cả thông tin sản phẩm từ action.payload trừ các trường không cần thiết
      const { user, rating, numReviews, reviews, ...item } = action.payload;
    
      // Đảm bảo _id và product đều có
      const itemWithProduct = {
        ...item,
        _id: item._id || item.product,
        product: item._id || item.product,
      };

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existItem = state.cartItems.find(
        (x) => x._id === itemWithProduct._id && x.selectedSize === itemWithProduct.selectedSize
      );
    
      if (existItem) {
        // Cộng dồn số lượng nếu sản phẩm đã có trong giỏ hàng
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id && x.selectedSize === existItem.selectedSize
            ? { ...itemWithProduct, countInStock: x.countInStock }
            : x
        );
      } else {
        // Thêm mới vào giỏ hàng nếu sản phẩm chưa có
        state.cartItems = [...state.cartItems, { ...itemWithProduct, countInStock: item.quantity }];
      }
    
      // Cập nhật lại giỏ hàng
      return updateCart(state, itemWithProduct);
    },

    removeFromCart: (state, action) => {
      const { id, selectedSize } = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== id || x.selectedSize !== selectedSize
      );
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => (state = initialState),

    setDiscount: (state, action) => {
      state.discount = action.payload;
      return updateCart(state);
    },

    clearDiscount: (state) => {
      state.discount = null;
      return updateCart(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.discount = null;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
  setDiscount,
  clearDiscount,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;