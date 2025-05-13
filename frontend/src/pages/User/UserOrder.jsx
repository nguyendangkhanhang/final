import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Title from '../../components/Title';
import ScrollAnimator from '../../components/ScrollAnimator';
import { FaShoppingBag, FaCheckCircle, FaClock, FaTruck, FaEye } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import { formatPrice } from "../../Utils/cartUtils";

const UserOrder = () => {
  const dispatch = useDispatch();
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Tính toán số trang
  const totalPages = orders ? Math.ceil(orders.length / itemsPerPage) : 1;

  // Lấy dữ liệu cho trang hiện tại
  const currentOrders = orders
    ? orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle className="text-[#5b3f15]" />;
      case 'processing':
        return <FaClock className="text-[#bd8837]" />;
      case 'shipped':
        return <FaTruck className="text-[#bd8837]" />;
      default:
        return <FaShoppingBag className="text-[#bd8837]" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-[#efe9e0] text-[#5b3f15]';
      case 'processing':
        return 'bg-[#efe9e0] text-[#bd8837]';
      case 'shipped':
        return 'bg-[#efe9e0] text-[#bd8837]';
      default:
        return 'bg-[#efe9e0] text-[#bd8837]';
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen">
      <ScrollAnimator>
        <div 
          className="relative h-64 md:h-80 flex items-center justify-center text-black bg-[#efe9e0] overflow-hidden"
        >
          <div className='relative z-10 text-center px-4'>
            <div className='text-7xl text-center'>
              <Title text1={'MY'} text2={'ORDERS'} />
            </div>
            <p className="mt-2 text-lg md:text-xl text-[#5b3f15]">View your order history</p>
          </div>
        </div>
        <div className="bg-[#efe9e0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="block" fill="white">
            <path d="M1440,50 C1200,100 900,0 720,0 C540,0 240,100 0,50 L0,100 L1440,100 Z"></path>
          </svg>
        </div>
      </ScrollAnimator>

      <div className="max-w-[1600px] mx-auto pb-10">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">{error?.data?.error || error.error}</Message>
        ) : (
          <>
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#5b3f15]">
                      <th className="px-8 py-6 text-center text-xl font-medium text-[#5b3f15] uppercase tracking-wider">Order Details</th>
                      <th className="px-8 py-6 text-center text-xl font-medium text-[#5b3f15] uppercase tracking-wider">Date</th>
                      <th className="px-8 py-6 text-center text-xl font-medium text-[#5b3f15] uppercase tracking-wider">Total</th>
                      <th className="px-8 py-6 text-center text-xl font-medium text-[#5b3f15] uppercase tracking-wider">Paid</th>
                      <th className="px-8 py-6 text-center text-xl font-medium text-[#5b3f15] uppercase tracking-wider">Status</th>
                      <th className="px-8 py-6 text-center text-xl font-medium text-[#5b3f15] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#efe9e0]">
                    {currentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-[#efe9e0]/50 transition-colors duration-200">
                        <td className="px-8 py-4">
                          <div className="flex items-center justify-center space-x-6">
                            <div className="flex-shrink-0 h-20 w-20">
                              <img
                                src={order.orderItems[0]?.image || "/default-image.jpg"}
                                alt="Order"
                                className="h-20 w-20 object-cover rounded-lg"
                              />
                            </div>
                            <div>
                              <div className="text-base font-medium text-[#5b3f15]">
                                Order #{order._id}
                              </div>
                              <div className="text-base text-[#bd8837]">
                                {order.orderItems.length} items
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="text-center">
                            <div className="text-base text-[#5b3f15]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-base text-[#bd8837]">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="text-center">
                            <div className="text-base font-medium text-[#5b3f15]">
                              {formatPrice(order.totalPrice.toFixed(2))}
                            </div>
                            <div className="text-base text-[#bd8837]">
                              {order.paymentMethod}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            {order.isPaid ? (
                              <span className="px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : (
                              <span className="px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <Link to={`/order/${order._id}/track?status=${order.status}`}>
                            <div className="flex items-center justify-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex justify-center space-x-4">
                            <Link to={`/order/${order._id}`}>
                              <button className="bg-[#efe9e0] text-[#5b3f15] px-6 py-3 rounded-lg hover:bg-[#bd8837] hover:text-white transition-colors duration-300 flex items-center space-x-2">
                                <FaEye className="text-base" />
                                <span className="text-base">Details</span>
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
