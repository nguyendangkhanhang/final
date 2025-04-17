import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { useGetDiscountCodesQuery } from "../redux/api/discountApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import Hero from "../components/Hero";
import { assets } from "../assets/assets";
import {
  FaBolt,
  FaTruck,
  FaUndo,
  FaHeadset,
  FaUserFriends,
} from "react-icons/fa";
import { useSaveUserCouponMutation } from '../redux/api/userCouponApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import NewsletterBox from '../components/NewsletterBox'
import ScrollAnimator from '../components/ScrollAnimator';
import Title from '../components/Title'

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
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
    <>
      {/* Animated Banner */}
      <div className="bg-gray-100 overflow-hidden pt-2 h-[48px] relative">
        <div className="flex absolute whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4">
              <span className="text-sm md:text-base font-medium">
                Free shipping on all orders over 1.000.000
              </span>
              <FaBolt className="text-yellow-500 animate-pulse" />
              <span className="text-sm md:text-base font-medium">
                Returns are free within 14 days
              </span>
              <FaBolt className="text-yellow-500 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <Hero />

      {/* Banners */}
      <ScrollAnimator className="flex justify-center gap-8 mt-[-3rem]">
        <img src={assets.home_banner_1} alt="Promotion 1" className="w-[40%] transition-transform duration-300 hover:scale-105" />
        <img src={assets.home_banner_2} alt="Promotion 2" className="w-[40%] transition-transform duration-300 hover:scale-105" />
      </ScrollAnimator>

      {/* Coupon Section */}
      <ScrollAnimator className="py-20 mb-[-50px]">
        <div className='text-5xl text-center '>
            <Title text1={'DISCOUNT'} text2={'COUPONS'} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {discountLoading ? (
            <div className="col-span-3 text-center">
              <Loader />
            </div>
          ) : (
            discountData?.data?.slice(0, 3).map((discount) => {
              const start = new Date(discount.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              });
              const end = new Date(discount.endDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={discount._id}
                  className="relative bg-white border border-gray-300 rounded-xl w-full mx-auto overflow-hidden shadow-sm mt-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-yellow-500"
                >
                  {/* Top content */}
                  <div className="flex justify-between items-center px-8 py-6">
                    <div className="text-[#bd8837] font-bold text-[3.5rem] leading-none ml-[10px]">
                      <div>{discount.discountPercentage}%</div>
                      <div className="text-[2rem]">OFF</div>
                    </div>
                    <div className="text-[#bd8837] text-right text-[2rem] font-semibold leading-tight tracking-wide mr-[20px]">
                        <div>DISCOUNT</div>
                        <div>COUPON</div>
                    </div>
                  </div>

                  {/* Dotted line divider */}
                  <div className="border-t border-dashed border-gray-400 mx-0 " />

                  {/* Bottom content */}
                  <div className="flex justify-between items-center px-8 py-4 flex-wrap gap-4">
                    <div className="text-xl font-semibold tracking-wider text-gray-800">
                        {discount.code}
                      <div className="text-xs text-gray-600 font-normal mt-1">
                        Valid from{" "}
                        <span className="font-semibold">{start}</span> to{" "}
                        <span className="font-semibold">{end}</span>
                      </div>
                    </div>
                    <button 
                    onClick={() => handleSaveCoupon(discount._id)}
                    className="bg-[#bd8837] text-white px-6 py-2 rounded-sm font-semibold hover:opacity-90">
                      SAVE
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex justify-center mt-10">
            <Link
                to="/coupon"
                className="border border-black text-black text-[1.2rem] py-2 px-10 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              All Coupons
            </Link>
          </div>
      </ScrollAnimator>

      {!keyword ? <Header /> : null}

      {/* Product list */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.error || "Error"}
        </Message>
      ) : (
        <ScrollAnimator>
          <div className='text-5xl text-center pt-10'>
              <Title text1={'PRODUCTS'} text2={'LIST'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-4 mt-[2rem] px-8 max-w-[1200px] mx-auto ">
            {data.products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-5 mb-7">
            <Link
                to="/shop"
                className="border border-black text-black text-[1.2rem] py-2 px-10 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Shop Now
            </Link>
          </div>

          {/* Features Section */}
          <ScrollAnimator className="py-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { icon: FaUndo, title: "14-Day Returns", desc: "Risk-free shopping with easy returns." },
                  { icon: FaTruck, title: "Free Shipping", desc: "No extra costs, just the price you see." },
                  { icon: FaHeadset, title: "24/7 Support", desc: "24/7 support, always here just for you." },
                  { icon: FaUserFriends, title: "Member Discounts", desc: "Special prices for our loyal customers." },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="text-center p-6 hover:bg-white rounded-lg transition-all duration-300 group hover:-translate-y-2">
                    <Icon className="text-4xl text-black mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    <h3 className="text-2xl mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimator>

          {/* Collection */}
          <ScrollAnimator className="mt-[3rem] px-[5rem] grid grid-cols-3 gap-6 items-start">
            <div className="flex flex-col w-full ml-[7rem]">
              <h2 className="text-4xl font-semibold uppercase tracking-wide text-gray-700 mb-2">
                New <br /> Collections
              </h2>
              <div className="w-[412.4px] h-[1px] bg-gray-700 mb-7"></div>
              <img
                src={assets.block_home_category1}
                alt="Collection 1"
                className="w-[412.4px] h-[618px] object-cover transition-all duration-300 hover:scale-105 hover:brightness-110"
              />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-6 ml-[2rem] mr-[3rem]">
              <img
                src={assets.block_home_category2}
                alt="Collection 2"
                className="w-[600px] h-[780px] object-cover transition-all duration-300 hover:scale-105 hover:brightness-110"
              />
              <img
                src={assets.block_home_category3}
                alt="Collection 3"
                className="w-[600px] h-[780px] object-cover transition-all duration-300 hover:scale-105 hover:brightness-110"
              />
            </div>
          </ScrollAnimator>
        </ScrollAnimator>
      )}
      <ScrollAnimator className="mt-10">
        <NewsletterBox/>
      </ScrollAnimator>
    </>
  );
};

export default Home;
