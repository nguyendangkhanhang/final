import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useGetTopProductsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Ratings from "./Rating";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import SmallProduct from "./SmallProduct";
import Title from '../../components/Title';

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data } = useGetTopProductsQuery();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    dispatch(addToCart({ ...product, qty, selectedSize }));
    navigate("/cart");
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.message}</Message>
  ) : (
    <div className='pt-20 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='w-full sm:w-[70%] mx-auto ml-[10rem]'>
            <img className='w-full h-auto' src={product.image} alt={product.name} />
          </div>
        </div>
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{product.name}</h1>
          <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
          <p className='mt-5 text-3xl font-medium'>$ {product.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{product.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {product.size?.map((size, index) => (
                <button 
                  key={index} 
                  onClick={() => setSelectedSize(size)} 
                  className={`border py-2 px-4 bg-gray-100 ${size === selectedSize ? 'border-orange-500' : ''}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button onClick={addToCartHandler} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-4'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-[5rem]">
        <ProductTabs
          loadingProductReview={loadingProductReview}
          userInfo={userInfo}
          submitHandler={submitHandler}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          product={product}
        />
      </div>

      <div className=' text-center text-3xl py-2 mt-[5rem]'>
        <Title text1={'RELATED'} text2={"PRODUCTS"} />
      </div>
      <div className="ml-[20rem] flex flex-wrap">
        {!data ? (
          <Loader />
          ) : (
            data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
                </div>
            ))
        )}
      </div>

    </div>
  );
};

export default ProductDetails;
