import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useMarkCouponAsUsedMutation } from "../../redux/api/userCouponApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { FaBox, FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";
import {
  formatPrice,
  calculateDiscount,
} from "../../Utils/cartUtils";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [markCouponAsUsed] = useMarkCouponAsUsedMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

  // 🧠 Tính toán lại để hiển thị đúng
  const subtotal = cart.itemsPrice;
  const discountAmount = calculateDiscount(subtotal, cart.discount);
  const shipping = cart.shippingPrice;
  const finalTotal = subtotal - discountAmount + shipping;

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map((item) => ({
          ...item,
          image: Array.isArray(item.image) ? item.image[0] : item.image,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: Number(subtotal),
        shippingPrice: Number(shipping),
        taxPrice: Number(cart.taxPrice),
        totalPrice: Number(finalTotal),
        couponId: cart.discount?.couponId,
        discountPercentage: cart.discount?.discountPercentage || 0,
      }).unwrap();

      // Nếu có sử dụng mã giảm giá, đánh dấu là đã sử dụng
      if (cart.discount?.couponId) {
        try {
          await markCouponAsUsed(cart.discount.couponId).unwrap();
        } catch (error) {
          console.error('Lỗi khi đánh dấu mã giảm giá:', error);
        }
      }

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProgressSteps step1 step2 step3 />

        {cart.cartItems.length === 0 ? (
          <div className="mt-8">
            <Message>Your cart is empty</Message>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Quantity</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cart.cartItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="ml-4">
                                <Link
                                  to={`/product/${item.product}`}
                                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                  {item.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.qty}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatPrice(item.qty * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Price Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">{formatPrice(shipping)}</span>
                    </div>
                    {cart.discount && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({cart.discount.discountPercentage}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-base font-semibold text-gray-900">
                          {formatPrice(finalTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2" />
                      <h3 className="font-medium">Shipping Address</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                      {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FaCreditCard className="mr-2" />
                      <h3 className="font-medium">Payment Method</h3>
                    </div>
                    <p className="text-sm text-gray-600">{cart.paymentMethod}</p>
                  </div>

                  {error && (
                    <div className="mt-4">
                      <Message variant="danger">{error.data.message}</Message>
                    </div>
                  )}

                  <button
                    type="button"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={cart.cartItems.length === 0}
                    onClick={placeOrderHandler}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FaBox className="mr-2" />
                        Place Order
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
