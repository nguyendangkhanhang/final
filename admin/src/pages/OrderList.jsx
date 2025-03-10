import { useState } from "react";
import Message from "@frontend/components/Message";
import Loader from "@frontend/components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "@frontend/redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [updateOrderStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null); // Để hiển thị trạng thái loading riêng từng đơn hàng

  // Xử lý thay đổi trạng thái đơn hàng
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    setSelectedOrder(orderId); // Bắt đầu loading cho đơn hàng đang cập nhật

    console.log("🔄 Updating order status...");
    console.log("Order ID:", orderId);
    console.log("New Status:", newStatus);

    try {
      const response = await updateOrderStatus({ orderId, status: newStatus }).unwrap();

      if (response.success) {
        console.log("✅ Order status updated successfully:", response.order);
        refetch(); // Fetch lại danh sách đơn hàng mới nhất
      } else {
        console.error("⚠️ Server error:", response.message);
        alert("❌ Không thể cập nhật trạng thái đơn hàng: " + response.message);
      }
    } catch (error) {
      console.error("❌ Failed to update order status:", error);
      alert("⚠️ Lỗi: Không thể cập nhật trạng thái đơn hàng!");
    } finally {
      setSelectedOrder(null); // Dừng loading sau khi hoàn tất
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <AdminMenu />
          <table className="container mx-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ITEMS</th>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">USER</th>
                <th className="p-2 border">DATE</th>
                <th className="p-2 border">TOTAL</th>
                <th className="p-2 border">PAID</th>
                <th className="p-2 border">STATUS</th>
                <th className="p-2 border">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const imageUrl = order.orderItems[0].image.startsWith("/uploads")
                  ? `http://localhost:5000${order.orderItems[0].image.replace(/\\/g, "/")}`
                  : order.orderItems[0].image;

                return (
                  <tr key={order._id} className="border">
                    <td className="p-2 border">
                      <img src={imageUrl} alt={order._id} className="w-16 h-16 object-cover" />
                    </td>
                    <td className="p-2 border">{order._id}</td>
                    <td className="p-2 border">{order.user ? order.user.username : "N/A"}</td>
                    <td className="p-2 border">{order.createdAt.substring(0, 10)}</td>
                    <td className="p-2 border">${order.totalPrice}</td>
                    <td className="p-2 border">
                      {order.isPaid ? (
                        <p className="p-1 text-center bg-green-400 w-24 rounded-full text-white">
                          Completed
                        </p>
                      ) : (
                        <p className="p-1 text-center bg-red-400 w-24 rounded-full text-white">
                          Pending
                        </p>
                      )}
                    </td>
                    <td className="p-2 border">
                      <select
                        onChange={(event) => statusHandler(event, order._id)}
                        value={order.status}
                        className="p-2 border rounded bg-gray-50 text-gray-700 font-semibold"
                        disabled={updatingStatus && selectedOrder === order._id} // Ngăn chỉnh sửa khi đang cập nhật
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <Link to={`/admin/order/${order._id}`}>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                          More
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default OrderList;
