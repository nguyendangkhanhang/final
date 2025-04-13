import React from 'react';
import { useGetDiscountCodesQuery } from '../redux/api/discountApiSlice';
import { useSaveUserCouponMutation } from '../redux/api/userCouponApiSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaGift } from 'react-icons/fa';

const Coupon = () => {
  const { data: discountData, isLoading, error } = useGetDiscountCodesQuery();
  const [saveUserCoupon] = useSaveUserCouponMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleSaveCoupon = async (discountCodeId) => {
    if (!userInfo) {
      toast.error('Vui lòng đăng nhập để lưu mã giảm giá');
      return;
    }

    try {
      await saveUserCoupon(discountCodeId).unwrap();
      toast.success('Lưu mã giảm giá thành công');
    } catch (error) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Mã Giảm Giá</h1>
            <p className="text-sm text-gray-600 mt-1">
              Lưu mã giảm giá để sử dụng khi thanh toán
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {discountData?.data?.map((discount) => (
              <div
                key={discount._id}
                className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-24 bg-white/10 rounded-full"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{discount.code}</h3>
                    <FaGift className="w-6 h-6" />
                  </div>

                  <p className="text-sm mb-2">
                    Giảm {discount.discountPercentage}% cho đơn hàng
                  </p>
                  <p className="text-xs mb-4">
                    Áp dụng từ {new Date(discount.startDate).toLocaleDateString()} đến{' '}
                    {new Date(discount.endDate).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => handleSaveCoupon(discount._id)}
                    className="w-full bg-white text-blue-600 py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    Lưu Mã
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupon;