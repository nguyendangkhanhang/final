import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Rating";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";

const ProductTabs = ({
    loadingProductReview,
    userInfo,
    submitHandler,
    rating,
    setRating,
    comment,
    setComment,
    product,
}) => {
    const { data, isLoading } = useGetTopProductsQuery();
    const [activeTab, setActiveTab] = useState(1);

    if (isLoading) return <Loader />;

    return (
        <div className="border rounded-lg shadow-md bg-white p-6">
            {/* Tabs Header */}
            <div className="border-b flex">
                <div
                    className={`py-3 px-6 cursor-pointer text-lg transition-all duration-300 ${
                        activeTab === 1 ? "font-bold border-b-2 border-#5b3f15 text-[#5b3f15]" : "text-gray-500 hover:text-[#5b3f15]"
                    }`}
                    onClick={() => setActiveTab(1)}
                >
                    Write Your Review
                </div>
                <div
                    className={`py-3 px-6 cursor-pointer text-lg transition-all duration-300 ${
                        activeTab === 2 ? "font-bold border-b-2 border-#5b3f15 text-[#5b3f15]" : "text-gray-500 hover:text-[#5b3f15]"
                    }`}
                    onClick={() => setActiveTab(2)}
                >
                    All Reviews ({product.reviews.length})
                </div>
            </div>

            {/* Tabs Content */}
            <div className="p-6">
                {activeTab === 1 && (
                    <div className="mt-4">
                        {userInfo ? (
                            <form onSubmit={submitHandler} className="space-y-4">
                                <div className="my-2">
                                    <label htmlFor="rating" className="block text-lg font-medium text-[#5b3f15]">
                                        Rating
                                    </label>
                                    <select
                                        id="rating"
                                        required
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                        className="p-2 border rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-[#bd8837]"
                                    >
                                        <option value="">Select</option>
                                        <option value="1">Inferior</option>
                                        <option value="2">Decent</option>
                                        <option value="3">Great</option>
                                        <option value="4">Excellent</option>
                                        <option value="5">Exceptional</option>
                                    </select>
                                </div>

                                <div className="my-2">
                                    <label htmlFor="comment" className="block text-lg font-medium text-[#5b3f15]">
                                        Comment
                                    </label>
                                    <textarea
                                        id="comment"
                                        rows="4"
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="p-2 border rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-[#bd8837]"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingProductReview}
                                    className="bg-[#5b3f15] text-white py-2 px-4 border border-[#5b3f15] rounded-lg hover:bg-white hover:text-[#5b3f15] transition-all duration-300"
                                >
                                    Submit
                                </button>
                            </form>
                        ) : (
                            <p>
                                Please <Link to="/login" className="text-[#5b3f15] hover:underline">sign in</Link> to write a review.
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 2 && (
                    <div className="mt-4">
                        {product.reviews.length === 0 ? (
                            <p className="text-gray-500">No Reviews</p>
                        ) : (
                            product.reviews.map((review) => (
                                <div key={review._id} className="border p-4 rounded-lg my-4 shadow-sm bg-[#efe9e0]">
                                    <div className="flex justify-between items-center">
                                        <strong className="text-[#5b3f15]">{review.name}</strong>
                                        <p className="text-[#bd8837] text-sm">
                                            {review.createdAt.substring(0, 10)}
                                        </p>
                                    </div>
                                    <p className="my-2">{review.comment}</p>
                                    <Ratings value={review.rating} />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTabs;
