import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Title from '../../components/Title';
import ScrollAnimator from '../../components/ScrollAnimator';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { formatPrice } from "../../Utils/cartUtils";

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid && !window.paypal) {
        loadingPayPalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order?.totalPrice || 0 } }],
      })
      .then((orderID) => orderID);
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  // Tính toán giá trị
  const subtotal = order?.itemsPrice || 0;
  const shipping = order?.shippingPrice || 0;
  const discountAmount = order?.discountAmount || 0;
  const discountPercentage = order?.discountPercentage || 0;
  const finalTotal = order?.totalPrice || 0;

  console.log('Order data:', {
    subtotal,
    shipping,
    discountAmount,
    discountPercentage,
    finalTotal,
    order
  });

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data?.message || error.message}</Message>
  ) : (
    <div className="bg-gray-50 min-h-screen">
      <ScrollAnimator>
        <div 
          className="relative h-64 md:h-80 flex items-center justify-center text-black bg-[#efe9e0] overflow-hidden"
        >
          <div className='relative z-10 text-center px-4'>
            <div className='text-7xl text-center'>
              <Title text1={'ORDER'} text2={'DETAILS'} />
            </div>
            <p className="mt-2 text-lg md:text-xl text-gray-700">Review your order information</p>
          </div>
        </div>
        <div className="bg-[#efe9e0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="block" fill="#f9fafb">
            <path d="M1440,50 C1200,100 900,0 720,0 C540,0 240,100 0,50 L0,100 L1440,100 Z"></path>
          </svg>
        </div>
      </ScrollAnimator>

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900">Order Items</h2>
                <p className="mt-2 text-sm text-gray-600">Order ID: {order?._id}</p>
              </div>
              
              {order?.orderItems?.length === 0 ? (
                <div className="p-6">
                  <Message>Order is empty</Message>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-base text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-center text-base text-gray-500 uppercase">Size</th>
                        <th className="px-6 py-3 text-center text-base text-gray-500 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-center text-base text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-center text-base text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.orderItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={item.image?.startsWith("/uploads")
                                  ? `http://localhost:5000${item.image}`
                                  : item.image}
                                alt={item.name}
                                className="h-16 w-16 object-cover rounded"
                              />
                              <div className="ml-4">
                                <Link to={`/product/${item.product}`} className="text-base font-medium text-gray-900 hover:text-blue-600">
                                  {item.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-base text-gray-500">
                            {item.selectedSize}
                          </td>
                          <td className="px-6 py-4 text-center text-base text-gray-500">{item.qty}</td>
                          <td className="px-6 py-4 text-center text-base text-gray-500">{formatPrice(item.qty * item.price)}</td>
                          <td className="px-6 py-4 text-center text-base font-medium text-gray-900">
                            {formatPrice(item.qty * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900">Shipping Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Shipping Address</h3>
                  <p className="mt-2 text-base text-gray-900">
                    {order?.shippingAddress?.address}<br />
                    {order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}<br />
                    {order?.shippingAddress?.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Customer Details</h3>
                  <p className="mt-2 text-base text-gray-900">
                    {order?.user?.username}<br />
                    {order?.user?.email}<br />
                    {order?.shippingAddress?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Items Subtotal</span>
                  <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {shipping === 0 ? 'Free Shipping' : formatPrice(shipping)}
                  </span>
                </div>
                {order?.couponId && (
                  <div className="flex justify-between text-base text-green-600">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-2xl font-medium text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mt-6 space-y-4">
                  <div className="rounded-md bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-900">Payment Status</span>
                      {order?.isPaid ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Paid on {new Date(order.paidAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          Not Paid
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PayPal + Admin Deliver */}
                  {!order?.isPaid && order?.paymentMethod !== "Cash on Delivery" && (
                    <div className="space-y-4">
                      {loadingPay && <Loader />}
                      {isPending ? (
                        <Loader />
                      ) : (
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      )}
                    </div>
                  )}

                  {loadingDeliver && <Loader />}
                  {userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && (
                    <button
                      type="button"
                      className="w-full py-3 px-6 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
