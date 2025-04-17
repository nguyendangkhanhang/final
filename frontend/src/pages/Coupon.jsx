import { useGetDiscountCodesQuery } from '../redux/api/discountApiSlice';
import { useSaveUserCouponMutation } from '../redux/api/userCouponApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import CouponCard from '../components/CouponCard';
import Title from '../components/Title'
import ScrollAnimator from '../components/ScrollAnimator';
import { assets } from '../assets/assets';
import { FaTags } from 'react-icons/fa';

// Define background patterns/textures if needed globally or inline
const bannerBgStyle = {
  backgroundColor: '#efe9e0',
  backgroundImage: 'radial-gradient(#dcd6cf 1px, transparent 1px)',
  backgroundSize: '10px 10px',
};

const gridBgStyle = {
  backgroundColor: '#f9fafb', // bg-gray-50
  // Example noise texture (adjust as needed)
  // backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23cccccc' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")',
};

const Coupon = () => {
  const { data: discountData, isLoading: discountLoading } = useGetDiscountCodesQuery();
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
            discountData?.data?.map((discount) => (
              <CouponCard 
                key={discount._id} 
                discount={discount} 
                onSave={handleSaveCoupon}
              />
            ))
          )}
        </div>
      </ScrollAnimator>
    </div>
  );
};

export default Coupon;