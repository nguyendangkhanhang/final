import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import Hero from '../components/Hero'
import {assets} from '../assets/assets'

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      <Hero />
      <div className="flex justify-center gap-8 mt-[-3rem]">
        <img src={assets.home_banner_1} alt="Promotion 1" className="w-[40%]"/>
        <img src={assets.home_banner_2} alt="Promotion 2" className="w-[40%]"/>
      </div>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.error || "Error"}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-gray-800 ml-[20rem] mt-[10rem] text-[3rem]">
              🔥NEW ARRIVALS🔥
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop Now
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-[3rem] px-[5rem] grid grid-cols-3 gap-6 items-start">
          {/* Cột đầu tiên: Tiêu đề + Hình ảnh nhỏ */}
          <div className="flex flex-col w-full ml-[7rem]">
            {/* Tiêu đề nằm trên ảnh */}
            <h2 className="text-3xl font-bold uppercase tracking-wide text-gray-700 mb-2">
              New <br /> Collections
            </h2>
            <div className="w-[412.4px] h-[1px] bg-gray-700 mb-7"></div> 
            
            {/* Ảnh nhỏ hơn */}
            <img
              src={assets.block_home_category1}
              alt="Collection 1"
              className="w-[412.4px] h-[618px] object-cover"
            />
          </div>

          {/* Hai ảnh lớn hơn */}
          <div className="col-span-2 grid grid-cols-2 gap-6 ml-[2rem] mr-[3rem]">
            <img src={assets.block_home_category2} alt="Collection 2" className="w-[600px] h-[780px] object-cover " />
            <img src={assets.block_home_category3} alt="Collection 3" className="w-[600px] h-[780px] object-cover" />
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default Home;