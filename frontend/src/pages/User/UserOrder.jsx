import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { apiSlice } from "../../redux/api/apiSlice";

const UserOrder = () => {
  const dispatch = useDispatch();
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Cập nhật dữ liệu từ server mỗi 10 giây
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">IMAGE</th>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">DATE</th>
              <th className="p-2 border">TOTAL</th>
              <th className="p-2 border">PAID</th>
              <th className="p-2 border">STATUS</th>
              <th className="p-2 border">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border">
                <td className="p-2 border">
                  <img
                    src={order.orderItems[0]?.image || "/default-image.jpg"}
                    alt="Order"
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="p-2 border">{order._id}</td>
                <td className="p-2 border">{order.createdAt.substring(0, 10)}</td>
                <td className="p-2 border">$ {order.totalPrice}</td>

                <td className="p-2 border">
                  {order.isPaid ? (
                    <p className="p-1 text-center">Completed</p>
                  ) : (
                    <p className="p-1 text-center">Pending</p>
                  )}
                </td>

                {/* Hiển thị trạng thái đơn hàng + Nút Track Order */}
                <td className="p-2 border">
                  <div className="flex justify-between items-center">
                    <p className="text-sm md:text-base">{order.status}</p>
                    <Link to={`/order/${order._id}/track?status=${order.status}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 text-sm font-medium rounded hover:bg-blue-600">
                        Track Order
                      </button>
                    </Link>
                  </div>
                </td>

                <td className="p-2 border">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-500 text-white py-2 px-3 rounded hover:bg-pink-600">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;
