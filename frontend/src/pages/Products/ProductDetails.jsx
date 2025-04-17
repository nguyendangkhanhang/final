import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useGetTopProductsQuery,
  useCreateReviewMutation,
  useUpdateProductQuantityMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Ratings from "./Rating";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import SmallProduct from "./SmallProduct";
import Title from "../../components/Title";
import { formatPrice } from "../../Utils/cartUtils";

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
  } = useGetProductDetailsQuery(productId, {
    pollingInterval: 3000,
  });

  const [updateProductQuantity] = useUpdateProductQuantityMutation();
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

    if (product.quantity === 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (qty > product.quantity) {
      toast.error(`Only ${product.quantity} item(s) left in stock`);
      return;
    }

    // Only add to cart, don't update product quantity
    dispatch(addToCart({ ...product, qty, selectedSize }));
    navigate("/cart");
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.message}</Message>
  ) : (
    <div className="pt-20 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="w-full sm:w-[70%] mx-auto ml-[10rem]">
            <img className="w-full h-auto" src={product.image} alt={product.name} />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{product.name}</h1>
          <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
          <p className="mt-5 text-3xl font-medium">{formatPrice(product.price)}</p>

          {/* Stock info */}
          {product.quantity > 0 ? (
            <p className="mt-2 text-green-600">In stock: {product.quantity}</p>
          ) : (
            <p className="mt-2 text-red-500 font-semibold">Out of stock</p>
          )}

          <p className="mt-5 text-gray-500 md:w-4/5">{product.description}</p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {product.size?.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    size === selectedSize ? "border-orange-500" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={addToCartHandler}
            disabled={product.quantity === 0}
            className={`px-8 py-3 text-sm mt-4 ${
              product.quantity === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white active:bg-gray-700"
            }`}
          >
            {product.quantity === 0 ? "Out of stock" : "ADD TO CART"}
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Product Tabs (review) */}
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

      <div className="text-center text-3xl py-2 mt-[5rem]">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="ml-[12rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mr-[12rem]">
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