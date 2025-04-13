import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart, FaGift } from "react-icons/fa";
import { addToCart, removeFromCart, setDiscount, clearDiscount } from "../redux/features/cart/cartSlice";
import { updateCart, formatPrice, calculateSubtotal, calculateDiscount, calculateTotal } from "../Utils/cartUtils";
import { useGetUserCouponsQuery } from '../redux/api/userCouponApiSlice';
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, discount } = cart;

  const { data: userCouponsData, refetch: refetchUserCoupons } = useGetUserCouponsQuery();
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Reset discount when component mounts
  useEffect(() => {
    dispatch(clearDiscount());
  }, [dispatch]);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const handleSelectCoupon = (coupon) => {
    if (coupon.isUsed) {
      toast.error('Mã giảm giá đã được sử dụng');
      return;
    }
    
    dispatch(setDiscount({
      code: coupon.discountCode.code,
      discountPercentage: coupon.discountCode.discountPercentage,
      couponId: coupon._id
    }));
    setShowCouponModal(false);
    toast.success('Áp dụng mã giảm giá thành công');
  };

  const handleRemoveDiscount = () => {
    dispatch(clearDiscount());
    toast.success('Đã xóa mã giảm giá');
  };

  const subtotal = calculateSubtotal(cartItems);
  const discountAmount = calculateDiscount(subtotal, discount);
  const totalAfterDiscount = calculateTotal(subtotal, discountAmount);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
            <FaShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)} items in your cart
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item._id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                      <div className="mt-2 text-lg font-semibold text-gray-900">
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <select
                        className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={item.qty}
                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => removeFromCartHandler(item._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        title="Remove item"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCouponModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaGift className="w-5 h-5" />
                    {discount ? `Mã giảm ${discount.discountPercentage}%` : 'Chọn Mã Giảm Giá'}
                  </button>
                  {discount && (
                    <button
                      onClick={handleRemoveDiscount}
                      className="bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 transition-colors duration-200"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discount.discountPercentage}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">Calculated at next step</span>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-gray-900 font-medium">
                      {formatPrice(totalAfterDiscount)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={checkoutHandler}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Proceed to Checkout
                </button>

                <Link 
                  to="/shop"
                  className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Selection Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chọn Mã Giảm Giá</h3>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {userCouponsData?.data?.filter(coupon => !coupon.isUsed && coupon.discountCode).map((coupon) => (
                <div
                  key={coupon._id}
                  className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white mb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{coupon.discountCode?.code || 'Mã không hợp lệ'}</h4>
                    <span>Giảm {coupon.discountCode?.discountPercentage || 0}%</span>
                  </div>
                  <p className="text-sm mb-4">
                    Áp dụng từ {new Date(coupon.discountCode?.startDate).toLocaleDateString()} đến{' '}
                    {new Date(coupon.discountCode?.endDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleSelectCoupon(coupon)}
                    className="w-full bg-white text-green-600 py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    Chọn
                  </button>
                </div>
              ))}
              {userCouponsData?.data?.filter(coupon => !coupon.isUsed && coupon.discountCode).length === 0 && (
                <p className="text-center text-gray-500">Bạn chưa có mã giảm giá nào</p>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCouponModal(false)}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;