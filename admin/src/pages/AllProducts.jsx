import { Link } from "react-router-dom"; 
import moment from "moment";
import { useAllProductsQuery } from "@frontend/redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../components/Loader";
import Pagination from '@frontend/components/Pagination';
import { useState } from "react";
import { formatPrice } from "@frontend/Utils/cartUtils";
const AllProducts = () => {
    const { data: products, isLoading, isError } = useAllProductsQuery();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    if (isLoading) {
        return <Loader />;
    }
  
    if (isError) {
        return <div>Error loading products</div>;
    }

    const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 1;

    const currentProducts = products
        ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : []; 

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center ">
                    <div>
                        <h1 className="text-3xl uppercase font-bold text-[#5b3f15]">All Products</h1>
                        <p className="text-gray-400 mt-1">Manage your product inventory</p>
                    </div>
                    <Link
                        to="/admin/productlist"
                        className="rounded-md bg-[#5b3f15] border border-[#5b3f15] text-white px-6 py-3 hover:bg-white hover:text-[#5b3f15] transition-colors duration-200 shadow-lg"
                    >
                        Add New Product
                    </Link>
                </div>

                <div className="grid">
                    {currentProducts.map((product) => {
                        const imageUrl = product.image.startsWith("/uploads") 
                            ? `http://localhost:5000${product.image.replace(/\\/g, "/")}`
                            : product.image;

                        return (
                            <div 
                                key={product._id} 
                                className="bg-white border border-gray-300 rounded-md w-full mx-auto overflow-hidden shadow-sm mt-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-yellow-500"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-48 h-48">
                                        <img 
                                            src={imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                                        />
                                    </div>

                                    <div className="flex-1 p-4">
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-2xl font-bold uppercase text-[#5b3f15]">
                                                    {product.name}
                                                </h2>
                                                <span className="text-lg font-bold text-[#bd8837]">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>

                                            <p className="text-[#5b3f15] text-sm mb-4 flex-grow">
                                                {product.description?.substring(0, 150)}...
                                            </p>

                                            <div className="flex justify-between items-center mt-auto">
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-base font-semibold text-[#bd8837]">
                                                        Stock: {product.quantity} 
                                                    </span> 
                                                    <span className="text-base font-semibold text-[#bd8837]">
                                                        Created: {moment(product.createdAt).format("MMM D, YYYY")}
                                                    </span>
                                                </div>

                                                <Link
                                                    to={`/admin/product/update/${product._id}`}
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#bd8837] rounded-lg hover:bg-[#5b3f15] transition-colors duration-200"
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

                <div className="flex justify-center mt-6">
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
