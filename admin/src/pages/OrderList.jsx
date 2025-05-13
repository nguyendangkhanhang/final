import { useState } from "react";
import Message from "@frontend/components/Message";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "@frontend/redux/api/orderApiSlice";
import Pagination from '@frontend/components/Pagination';
import { formatPrice } from "@frontend/Utils/cartUtils";
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [updateOrderStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    setSelectedOrder(orderId);

    try {
      const response = await updateOrderStatus({ orderId, status: newStatus }).unwrap();

      if (response.success) {
        refetch();
      } else {
        alert("❌ Cannot update order status: " + response.message);
      }
    } catch (error) {
      alert("⚠️ Error: Cannot update order status!");
    } finally {
      setSelectedOrder(null);
    }
  };

  const totalPages = orders ? Math.ceil(orders.length / itemsPerPage) : 1;
  const currentOrders = orders
    ? orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl uppercase font-bold text-[#5b3f15]">Orders</h1>
            <p className="text-gray-400 mt-1">Manage your orders and track their status</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-[#5b3f15]">Loading...</div>
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <>
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#5b3f15] text-white">
                      <th className="px-6 py-4 text-center text-base font-semibold uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-center text-base font-semibold uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-center text-base font-semibold uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-center text-base font-semibold uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-8 py-4 text-left text-base font-semibold uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-center text-base font-semibold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-base font-semibold uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentOrders.map((order) => {
                      const imageUrl = order.orderItems[0].image.startsWith("/uploads")
                        ? `http://localhost:5000${order.orderItems[0].image.replace(/\\/g, "/")}`
                        : order.orderItems[0].image;

                      return (
                        <tr key={order._id} className="hover:bg-[#efe9e0] transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img src={imageUrl} alt={order._id} className="w-16 h-16 object-cover rounded-lg" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[#5b3f15]">
                            {order._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[#5b3f15]">
                            {order.user ? order.user.username : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[#5b3f15]">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[#5b3f15] font-medium">
                            {formatPrice(order.totalPrice)}
                          </td>
                          <td className="text-center whitespace-nowrap">
                            {order.isPaid ? (
                              <div className="flex flex-col">
                                <span className="text-green-600 font-medium">Paid</span>
                                <span className="text-sm text-[#bd8837]">{order.paymentMethod}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-red-600 font-medium">Unpaid</span>
                                <span className="text-sm text-[#bd8837]">{order.paymentMethod}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              onChange={(event) => statusHandler(event, order._id)}
                              value={order.status}
                              className="p-2 border rounded-lg bg-[#efe9e0] text-[#5b3f15] font-semibold focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                              disabled={updatingStatus && selectedOrder === order._id}
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Packing">Packing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for delivery">Out for delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/admin/order/${order._id}`}>
                              <button className="flex items-center gap-2 text-[#bd8837] hover:text-[#5b3f15] transition-colors duration-200">
                                <PencilSquareIcon className="w-5 h-5" />
                                <span>Details</span>
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        )}
      </div>
  );
};

export default OrderList;