// Định dạng giá VND
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Tính tổng phụ (giá * số lượng)
export const calculateSubtotal = (cartItems) => {
  return cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
};

// Tính số tiền giảm giá theo phần trăm
export const calculateDiscount = (subtotal, discount) => {
  if (!discount) return 0;
  return (subtotal * discount.discountPercentage) / 100;
};

// Tính tổng sau khi giảm giá (chưa tính phí vận chuyển)
export const calculateTotal = (subtotal, discountAmount) => {
  return subtotal - discountAmount;
};

// Tính phí vận chuyển (30.000 nếu tổng sau giảm < 1tr)
export const calculateShipping = (totalAfterDiscount) => {
  return totalAfterDiscount >= 1000000 ? 0 : 30000;
};

// Cập nhật toàn bộ giá trị giỏ hàng vào Redux + localStorage
export const updateCart = (state) => {
  const subtotal = calculateSubtotal(state.cartItems);
  const discountAmount = calculateDiscount(subtotal, state.discount);
  const totalAfterDiscount = calculateTotal(subtotal, discountAmount);
  const shippingPrice = calculateShipping(totalAfterDiscount);

  state.itemsPrice = subtotal;
  state.shippingPrice = shippingPrice;
  state.totalPrice = totalAfterDiscount + shippingPrice;

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
