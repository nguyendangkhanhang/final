import React from 'react';
import { useGetUserCouponsQuery } from '../../redux/api/userCouponApiSlice';
import { FaGift } from 'react-icons/fa';

const MyCoupon = () => {
  const { data: userCouponsData, isLoading, error } = useGetUserCouponsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Filter out coupons with null discountCode
  const validCoupons = userCouponsData?.data?.filter(coupon => coupon.discountCode) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Mã Giảm Giá Của Tôi</h1>
            <p className="text-sm text-gray-600 mt-1">
              Danh sách mã giảm giá bạn đã lưu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {validCoupons.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Bạn chưa có mã giảm giá nào</p>
              </div>
            ) : (
              validCoupons.map((userCoupon) => (
                <div
                  key={userCoupon._id}
                  className={`rounded-lg p-6 text-white relative overflow-hidden ${
                    userCoupon.isUsed
                      ? 'bg-gray-400'
                      : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                >
                  <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-24 h-24 bg-white/10 rounded-full"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">
                        {userCoupon.discountCode?.code || 'Mã không hợp lệ'}
                      </h3>
                      <FaGift className="w-6 h-6" />
                    </div>

                    <p className="text-sm mb-2">
                      Giảm {userCoupon.discountCode?.discountPercentage || 0}% cho đơn hàng
                    </p>
                    <p className="text-xs mb-4">
                      Áp dụng từ{' '}
                      {userCoupon.discountCode?.startDate
                        ? new Date(userCoupon.discountCode.startDate).toLocaleDateString()
                        : 'N/A'}{' '}
                      đến{' '}
                      {userCoupon.discountCode?.endDate
                        ? new Date(userCoupon.discountCode.endDate).toLocaleDateString()
                        : 'N/A'}
                    </p>

                    {userCoupon.isUsed && (
                      <div className="text-sm text-white/80">
                        Đã sử dụng vào {new Date(userCoupon.usedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoupon;