import { useGetDiscountCodesQuery } from '../redux/api/discountApiSlice';
import { useSaveUserCouponMutation } from '../redux/api/userCouponApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import CouponCard from '../components/CouponCard';
import Title from '../components/Title'
import ScrollAnimator from '../components/ScrollAnimator';
import { useGetUserCouponsQuery } from '../redux/api/userCouponApiSlice';

const bannerBgStyle = {
  backgroundColor: '#efe9e0',
  backgroundImage: 'radial-gradient(#dcd6cf 1px, transparent 1px)',
  backgroundSize: '10px 10px',
};

const gridBgStyle = {
  backgroundColor: '#f9fafb', 
};

const Coupon = () => {
  const { data: discountData, isLoading: discountLoading } = useGetDiscountCodesQuery();
  const [saveUserCoupon] = useSaveUserCouponMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: userCouponsData } = useGetUserCouponsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Kiểm tra coupon có hợp lệ không (chưa hết hạn và chưa hết lượt sử dụng)
  const isCouponValid = (coupon) => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    return endDate > now && (
      coupon.usageLimit === 0 || 
      (coupon.usageLimit > 0 && coupon.usedCount < coupon.usageLimit)
    );
  };

  // Lấy danh sách coupon đã lưu, còn hiệu lực và chưa sử dụng
  const savedCouponIds = userCouponsData?.data
    ?.filter(coupon => 
      coupon.discountCode && 
      isCouponValid(coupon.discountCode) && 
      !coupon.isUsed
    )
    ?.map(c => c.discountCode?._id) || [];

  const handleSaveCoupon = async (discountCodeId) => {
    if (!userInfo) {
      toast.error('Please login to save discount code');
      return;
    }

    // Tìm coupon cần lưu
    const couponToSave = discountData?.data?.find(discount => discount._id === discountCodeId);
    
    if (!couponToSave) {
      toast.error('Coupon not found');
      return;
    }

    // Kiểm tra coupon có hết hạn hoặc hết lượt sử dụng không
    if (!isCouponValid(couponToSave)) {
      toast.error('This coupon has expired or reached its usage limit');
      return;
    }

    // Kiểm tra coupon đã được sử dụng chưa
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
        <div 
        className="relative h-64 md:h-80 flex items-center justify-center text-black bg-[#efe9e0] overflow-hidden"
        >
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

      <ScrollAnimator 
        className="py-16 px-4 mt-[-4rem] relative z-10"
        style={gridBgStyle}
      >
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