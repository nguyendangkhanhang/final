import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";

import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import Title from '../components/Title';
import ScrollAnimator from '../components/ScrollAnimator';
import Pagination from '../components/Pagination';

const Shop = () => {
    const dispatch = useDispatch();
  
    // Redux state
    const { categories, products, checked, radio } = useSelector(state => state.shop);
  
    // Local state
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceFilter, setPriceFilter] = useState("");
    const [sortPrice, setSortPrice] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
  
    const itemsPerPage = 20;

    // Fetch categories
    const categoriesQuery = useFetchCategoriesQuery();

    // Fetch filtered products (checked categories, price range radio)
    const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

    // Fetch categories
    useEffect(() => {
        if (categoriesQuery.data && !categoriesQuery.isLoading) {
          dispatch(setCategories(categoriesQuery.data));
        }
    }, [categoriesQuery.data, dispatch]);

    // Fetch filtered products
    useEffect(() => {
        if (filteredProductsQuery.data && !filteredProductsQuery.isLoading) {
          let filtered = filteredProductsQuery.data;
    
          // Filter by selected categories
          if (checked.length > 0) {
            filtered = filtered.filter(p => checked.includes(p.category));
          }
    
          // Filter by selected brands
          if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brand));
          }
    
          // Filter by price input
          if (priceFilter) {
            filtered = filtered.filter(p => p.price.toString().startsWith(priceFilter));
          }
    
          // Sort by price
          if (sortPrice === "high-to-low") {
            filtered.sort((a, b) => b.price - a.price);
          } else if (sortPrice === "low-to-high") {
            filtered.sort((a, b) => a.price - b.price);
          }
    
          // Update Redux state
          dispatch(setProducts(filtered));
        }
    }, [checked, selectedBrands, priceFilter, sortPrice, filteredProductsQuery.data, dispatch]);

    const handleCheck = (isChecked, id) => {
        const updatedChecked = isChecked
          ? [...checked, id]
          : checked.filter(c => c !== id);
        dispatch(setChecked(updatedChecked));
    };
    
    const handleBrandClick = (brand, isChecked) => {
        setSelectedBrands(isChecked
          ? [...selectedBrands, brand]
          : selectedBrands.filter(b => b !== brand));
    };
    
    const handlePriceChange = (e) => {
        setPriceFilter(e.target.value.replace(/[^0-9]/g, ''));
    };
    
    const handleSortPrice = (e) => {
        setSortPrice(e.target.value);
    };
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 1;
    const currentProducts = products
      ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : [];

    const uniqueBrands = [
        ...new Set(
          filteredProductsQuery.data
            ?.map(p => p.brand)
            .filter(brand => brand !== undefined)
        )
    ];

    return (
        <ScrollAnimator className="mt-10"> 
            <div className="container mx-auto">
                <div className="flex md:flex-row">
                    {/* Sidebar */}
                    <div className="w-[250px] p-4 flex-shrink-0">
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
                                        onChange={(e) => handleBrandClick(brand, e.target.checked)}
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
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter Price"
                                    value={priceFilter}
                                    onChange={handlePriceChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-gray-300"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={sortPrice}
                                    onChange={handleSortPrice}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-gray-300"
                                >
                                    <option value="">Sort by Price</option>
                                    <option value="high-to-low">Price: High to Low</option>
                                    <option value="low-to-high">Price: Low to High</option>
                                </select>
                            </div>
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
