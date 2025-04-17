import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
    setCategories,
    setProducts,
    setChecked,
} from "../redux/features/shop/shopSlice";

import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import Title from '../components/Title';
import ScrollAnimator from '../components/ScrollAnimator';
import Pagination from '../components/Pagination';


const Shop = () => {
    const dispatch = useDispatch();
    const { categories, products, checked, radio } = useSelector(
        (state) => state.shop
    );
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const categoriesQuery = useFetchCategoriesQuery();
    const [priceFilter, setPriceFilter] = useState("");

    const filteredProductsQuery = useGetFilteredProductsQuery({
        checked,
        radio,
    });

    useEffect(() => {
        if (!categoriesQuery.isLoading) {
            dispatch(setCategories(categoriesQuery.data));
        }
    }, [categoriesQuery.data, dispatch]);

    useEffect(() => {
        if (!checked.length || !radio.length) {
            if (!filteredProductsQuery.isLoading) {
                const filteredProducts = filteredProductsQuery.data.filter(
                    (product) => {
                        return (
                            product.price.toString().includes(priceFilter) ||
                            product.price === parseInt(priceFilter, 10)
                        );
                    }
                );

                dispatch(setProducts(filteredProducts));
            }
        }
    }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

    const handleBrandClick = (brand) => {
        const productsByBrand = filteredProductsQuery.data?.filter(
            (product) => product.brand === brand
        );
        dispatch(setProducts(productsByBrand));
    };

    const handleCheck = (value, id) => {
        const updatedChecked = value
            ? [...checked, id]
            : checked.filter((c) => c !== id);
        dispatch(setChecked(updatedChecked));
    };

    // Thêm key duy nhất cho danh sách Brands
    const uniqueBrands = [
        ...Array.from(
            new Set(
                filteredProductsQuery.data
                    ?.map((product) => product.brand)
                    .filter((brand) => brand !== undefined)
            )
        ),
    ];

    const handlePriceChange = (e) => {
        setPriceFilter(e.target.value);
    };

    // Tính toán số trang
    const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 1;

    // Lấy dữ liệu cho trang hiện tại
    const currentProducts = products
        ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : [];

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <ScrollAnimator className="mt-10"> 
            <div className="container mx-auto">
                <div className="flex md:flex-row">
                    {/* Sidebar */}
                    <div className="w-[250px] p-4 flex-shrink-0">
                        {/* Tiêu đề "FILTERS" */}
                        <h2 className="mb-4 mt-5 text-xl flex items-center gap-2">FILTERS</h2>
                        {/* Filter theo Categories */}
                        <div className="border border-gray-300 p-4 mb-4 w-full">
                            <h3 className="text-md font-medium mb-2">CATEGORIES</h3>
                            {categories?.map((c) => (
                                <div key={c._id} className="flex items-center mb-2 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        id={`category-${c._id}`}
                                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                                        className="w-3 h-3 text-gray-900 border-gray-300 focus:ring-gray-500"
                                    />
                                    <label htmlFor={`category-${c._id}`} className="ml-2 text-sm text-gray-700">
                                        {c.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Filter theo Brand */}
                        <div className="border border-gray-300 p-4 mb-4 w-full">
                            <h3 className="text-md font-medium mb-2">BRAND</h3>
                            {uniqueBrands?.map((brand, index) => (
                                <div key={index} className="flex items-center mb-2 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        id={`brand-${index}`}
                                        name="brand"
                                        onChange={() => handleBrandClick(brand)}
                                        className="w-3 h-3 text-gray-900 border-gray-300 focus:ring-gray-500"
                                    />
                                    <label htmlFor={`brand-${index}`} className="ml-2 text-sm text-gray-700">
                                        {brand}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Filter theo Price */}
                        <div className="border border-gray-300 p-4 w-full">
                            <h3 className="text-md font-medium mb-2">PRICE</h3>
                            <input
                                type="text"
                                placeholder="Enter Price"
                                value={priceFilter}
                                onChange={handlePriceChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-gray-300"
                            />
                        </div>

                        <div className="p-4">
                            <button
                                className="w-full block border py-1 bg-gray-200 hover:bg-gray-300 transition"
                                onClick={() => window.location.reload()}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Product Display */}
                    <div className="flex-1 p-3">
                        <div className='flex justify-between text-base sm:text-4xl mb-1'>
                            <Title text1={'ALL'} text2={'COLLECTIONS'} />
                        </div>
                        <h2 className="h4 mb-2">{products?.length} Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.length === 0 ? (
                                <Loader />
                            ) : (
                                currentProducts?.map((p) => (
                                    <div key={p._id}>
                                        <ProductCard p={p} />
                                    </div>
                                ))
                            )}
                        </div>

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
        </ScrollAnimator>
    );
};

export default Shop;
