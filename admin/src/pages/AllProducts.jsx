import { Link } from "react-router-dom"; 
import moment from "moment";
import { useAllProductsQuery } from "@frontend/redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../components/Loader";

const AllProducts = () => {
    const { data: products, isLoading, isError } = useAllProductsQuery();

    if (isLoading) {
        return <Loader />;
    }
  
    if (isError) {
        return <div>Error loading products</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <AdminMenu />

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    All Products ({products.length})
                                </h1>
                                <Link
                                    to="/admin/productlist"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add New Product
                                </Link>
                            </div>

                            <div className="grid gap-6">
                                {products.map((product) => {
                                    const imageUrl = product.image.startsWith("/uploads") 
                                        ? `http://localhost:5000${product.image.replace(/\\/g, "/")}`
                                        : product.image;

                                    return (
                                        <div 
                                            key={product._id} 
                                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                {/* Product Image */}
                                                <div className="md:w-48 h-48">
                                                    <img 
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 p-4">
                                                    <div className="flex flex-col h-full">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h2 className="text-xl font-semibold text-gray-800">
                                                                {product.name}
                                                            </h2>
                                                            <span className="text-lg font-bold text-blue-600">
                                                                ${product.price}
                                                            </span>
                                                        </div>

                                                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                                                            {product.description?.substring(0, 150)}...
                                                        </p>

                                                        <div className="flex justify-between items-center mt-auto">
                                                            <div className="flex items-center space-x-4">
                                                                <span className="text-sm text-gray-500">
                                                                    Created: {moment(product.createdAt).format("MMM D, YYYY")}
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    Stock: {product.quantity}
                                                                </span>
                                                            </div>

                                                            <Link
                                                                to={`/admin/product/update/${product._id}`}
                                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                                            >
                                                                Edit
                                                                <svg
                                                                    className="w-4 h-4 ml-2"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                    />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
