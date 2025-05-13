// Import thư viện & component
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetDiscountCodesQuery } from '../redux/api/discountApiSlice';
import { useSaveUserCouponMutation, useGetUserCouponsQuery } from '../redux/api/userCouponApiSlice';
import Loader from '../components/Loader';
import CouponCard from '../components/CouponCard';
import Title from '../components/Title';
import ScrollAnimator from '../components/ScrollAnimator';

// Style constants
const gridBgStyle = { backgroundColor: '#f9fafb' };

const Coupon = () => {
  // Lấy userInfo từ Redux Store
  const { userInfo } = useSelector((state) => state.auth);

  // Gọi API lấy danh sách discount codes & user coupons
  const { data: discountData, isLoading: discountLoading } = useGetDiscountCodesQuery();
  const { data: userCouponsData } = useGetUserCouponsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [saveUserCoupon] = useSaveUserCouponMutation();

  // kiểm tra coupon còn hiệu lực không
  const isCouponValid = (coupon) => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    return endDate > now && (
      coupon.usageLimit === 0 || 
      (coupon.usageLimit > 0 && coupon.usedCount < coupon.usageLimit)
    );
  };

  // Danh sách coupon user đã lưu & còn hiệu lực (SAVED)
  const savedCouponIds = userCouponsData?.data
    ?.filter(coupon => 
      coupon.discountCode && 
      isCouponValid(coupon.discountCode) && 
      !coupon.isUsed
    )
    ?.map(c => c.discountCode?._id) || [];

  // xử lý khi user click Save Coupon
  const handleSaveCoupon = async (discountCodeId) => {
    if (!userInfo) {
      toast.error('Please login to save discount code');
      return;
    }

    const couponToSave = discountData?.data?.find(discount => discount._id === discountCodeId);
    if (!couponToSave) {
      toast.error('Coupon not found');
      return;
    }

    if (!isCouponValid(couponToSave)) {
      toast.error('This coupon has expired or reached its usage limit');
      return;
    }

    const existingCoupon = userCouponsData?.data?.find(
      c => c.discountCode?._id === discountCodeId
    );
    if (existingCoupon?.isUsed) {
      toast.error('This coupon has already been used');
      return;
    }

    try {
      await saveUserCoupon(discountCodeId).unwrap();
      toast.success('Save discount code successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'An error occurred');
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollAnimator>
        <div className="relative h-64 md:h-80 flex items-center justify-center text-black bg-[#efe9e0] overflow-hidden">
          <div className='relative z-10 text-center px-4'>
            <div className='text-7xl text-center'>
              <Title text1={'DISCOUNT'} text2={'COUPONS'} />
            </div>
            <p className="mt-2 text-lg md:text-xl text-gray-700">Exclusive discount coupons for our fashion collection</p>
          </div>
        </div>
        <div className="bg-[#efe9e0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="block" fill="#f9fafb">
            <path d="M1440,50 C1200,100 900,0 720,0 C540,0 240,100 0,50 L0,100 L1440,100 Z"></path>
          </svg>
        </div>
      </ScrollAnimator>

      <ScrollAnimator className="py-16 px-4 mt-[-4rem] relative z-10" style={gridBgStyle}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {discountLoading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
              <Loader />
            </div>
          ) : discountData?.data?.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 text-gray-500">
              No coupons available at the moment.
            </div>
          ) : (
            discountData?.data?.map((discount) => {
              const isExpired = !isCouponValid(discount);
              const existingCoupon = userCouponsData?.data?.find(
                c => c.discountCode?._id === discount._id
              );
              const isUsed = existingCoupon?.isUsed;
              const isSaved = savedCouponIds.includes(discount._id);

              return (
                <CouponCard
                  key={discount._id}
                  discount={discount}
                  onSave={handleSaveCoupon}
                  isSaved={isSaved}
                  isExpired={isExpired}
                  isUsed={isUsed}
                />
              );
            })
          )}
        </div>
      </ScrollAnimator>
    </div>
  );
};

export default Coupon;
