import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart, FaGift } from "react-icons/fa";
import { addToCart, removeFromCart, setDiscount, clearDiscount } from "../redux/features/cart/cartSlice";
import { updateCart, formatPrice, calculateSubtotal, calculateDiscount, calculateTotal } from "../Utils/cartUtils";
import { useGetUserCouponsQuery } from '../redux/api/userCouponApiSlice';
import { toast } from "react-toastify";
import Title from '../components/Title';
import ScrollAnimator from '../components/ScrollAnimator';
import { useUpdateProductQuantityMutation } from "../redux/api/productApiSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateProductQuantity] = useUpdateProductQuantityMutation();

  const cart = useSelector((state) => state.cart);
  const { cartItems, discount } = cart;

  const { data: userCouponsData } = useGetUserCouponsQuery();
  const [showCouponModal, setShowCouponModal] = useState(false);

  useEffect(() => {
    dispatch(clearDiscount());
  }, [dispatch]);

  const addToCartHandler = (item, qty) => {
    // Only update cart, don't update product quantity
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    // Only remove from cart, don't update product quantity
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollAnimator>
        <div className="relative h-64 md:h-80 flex items-center justify-center text-black bg-[#efe9e0] overflow-hidden">
          <div className="relative z-10 text-center px-4">
            <div className="text-7xl text-center">
              <Title text1={'SHOPPING'} text2={'CART'} />
            </div>
            <p className="mt-2 text-lg md:text-xl text-gray-700">Review and manage your shopping cart</p>
          </div>
        </div>
        <div className="bg-[#efe9e0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="block" fill="#f9fafb">
            <path d="M1440,50 C1200,100 900,0 720,0 C540,0 240,100 0,50 L0,100 L1440,100 Z"></path>
          </svg>
        </div>
      </ScrollAnimator>

      <div className="max-w-9xl mx-auto">
        {cartItems.length === 0 ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <FaShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#5b3f15] hover:bg-[#bd8837] transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="p-6 border-b border-gray-200">
                  <p className="text-base text-gray-600 mt-1">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)} items in your cart
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="ml-4">
                                <Link 
                                  to={`/product/${item._id}`}
                                  className="text-base font-medium text-gray-900 hover:text-blue-600"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-sm text-gray-500">{item.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-base text-gray-500">
                            {item.selectedSize}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-500">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-6 py-4">
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
                            <p className="text-xs text-gray-500 mt-1">Max: {item.countInStock}</p>
                          </td>
                          <td className="px-6 py-4 text-base font-medium text-gray-900">
                            {formatPrice(item.qty * item.price)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => removeFromCartHandler(item._id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                              title="Remove item"
                            >
                              <FaTrash className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowCouponModal(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white border border-transparent py-2 px-4 rounded-md font-medium hover:bg-white hover:text-red-500 hover:border-red-500 transition-colors duration-300"
                      >
                        <FaGift className="w-5 h-5" />
                        {discount ? `Discount ${discount.discountPercentage}%` : 'Apply Coupon'}
                      </button>
                      {discount && (
                        <button
                          onClick={handleRemoveDiscount}
                          className="border border-red-600 text-red-600 py-2 px-4 rounded-md font-medium hover:bg-red-700 hover:text-white transition-colors duration-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
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
                        <span className="text-gray-900 font-medium">{formatPrice(totalAfterDiscount)}</span>
                      </div>
                    </div>

                    <button
                      onClick={checkoutHandler}
                      className="w-full mt-6 py-3 px-4 rounded-lg font-semibold bg-black text-white border border-transparent hover:bg-white hover:text-black hover:border-black transition-colors duration-300"
                    >
                      Proceed to Checkout
                    </button>

                    <div className="text-center">
                      <Link
                        to="/shop"
                        className="inline-block text-black text-base py-2 transition-all duration-300 hover:border-b hover:border-black hover:font-semibold"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-7xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-700">Your Coupon</h3>
            </div>

            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCouponsData?.data?.filter(c => !c.isUsed && c.discountCode).map((coupon) => (
                  <div
                    key={coupon._id}
                    className="relative bg-white border border-gray-300 rounded-xl w-full mx-auto overflow-hidden shadow-sm"
                  >
                    <div className="flex justify-between items-center px-6 py-4">
                      <div className="text-[#bd8837] font-bold text-[2.5rem] leading-none">
                        <div>{coupon.discountCode?.discountPercentage || 0}%</div>
                        <div className="text-[1.5rem]">OFF</div>
                      </div>
                      <div className="text-[#bd8837] text-right text-[1.5rem] font-semibold leading-tight tracking-wide">
                        <div>DISCOUNT</div>
                        <div>COUPON</div>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-400 mx-4" />

                    <div className="flex justify-between items-center px-6 py-3 flex-wrap gap-2">
                      <div className="text-lg font-semibold tracking-wider text-gray-800">
                        {coupon.discountCode?.code}
                        <div className="text-xs text-gray-600 font-normal mt-1">
                          Valid from{" "}
                          <span className="font-semibold">
                            {new Date(coupon.discountCode?.startDate).toLocaleDateString("en-US", {
                              month: "long", day: "numeric",
                            })}
                          </span>{" "}
                          to{" "}
                          <span className="font-semibold">
                            {new Date(coupon.discountCode?.endDate).toLocaleDateString("en-US", {
                              month: "long", day: "numeric", year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectCoupon(coupon)}
                        className="bg-[#bd8837] text-white px-6 py-2 rounded-sm font-semibold hover:opacity-90"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
                {userCouponsData?.data?.filter(c => !c.isUsed && c.discountCode).length === 0 && (
                  <div className="col-span-3 text-center text-gray-500">
                    You don't have any coupon
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCouponModal(false)}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
