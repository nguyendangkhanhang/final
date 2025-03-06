import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Rating";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
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
                    className={`py-3 px-6 cursor-pointer text-lg ${
                        activeTab === 1 ? "font-bold border-b-2 border-black" : ""
                    }`}
                    onClick={() => setActiveTab(1)}
                >
                    Write Your Review
                </div>
                <div
                    className={`py-3 px-6 cursor-pointer text-lg ${
                        activeTab === 2 ? "font-bold border-b-2 border-black" : ""
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
                            <form onSubmit={submitHandler}>
                                <div className="my-2">
                                    <label htmlFor="rating" className="block text-lg font-medium">
                                        Rating
                                    </label>
                                    <select
                                        id="rating"
                                        required
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                        className="p-2 border rounded-lg w-full text-black"
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
                                    <label htmlFor="comment" className="block text-lg font-medium">
                                        Comment
                                    </label>
                                    <textarea
                                        id="comment"
                                        rows="4"
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="p-2 border rounded-lg w-full text-black"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingProductReview}
                                    className="bg-pink-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Submit
                                </button>
                            </form>
                        ) : (
                            <p>
                                Please <Link to="/login" className="text-blue-500">sign in</Link> to write a review.
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
                                <div key={review._id} className="border p-4 rounded-lg my-4 shadow-sm bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <strong className="text-gray-700">{review.name}</strong>
                                        <p className="text-gray-500 text-sm">
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
