import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "@frontend/redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@frontend/redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const ProductList = () => {
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      image1 && productData.append("image1", image1);
      image2 && productData.append("image2", image2);
      image3 && productData.append("image3", image3);
      image4 && productData.append("image4", image4);

      const { data } = await createProduct(productData);
      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-3 p-6">
      {/* Upload Image Section */}
      <div>
        <p className="mb-2 text-lg font-semibold">Upload Images</p>
        <div className="flex gap-4">
          {[setImage1, setImage2, setImage3, setImage4].map((setImage, index) => (
            <label key={index} className="cursor-pointer">
              <img className="w-20 rounded-md shadow-lg border" 
                   src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} 
                   alt={`Upload ${index + 1}`} />
              <input onChange={(e) => setImage(e.target.files[0])} type="file" hidden />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2 text-lg font-semibold">Product Name</p>
        <input 
          onChange={(e) => setName(e.target.value)}
          value={name} 
          className="w-full max-w-[500px] p-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          type="text" 
          placeholder="Enter product name" 
          required 
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2 text-lg font-semibold">Product Description</p>
        <textarea 
          onChange={(e) => setDescription(e.target.value)}
          value={description} 
          className="w-full max-w-[500px] p-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Enter product description" 
          required 
        />
      </div>

      {/* Category, Price, Quantity */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Category */}
        <div>
          <p className="mb-2 text-lg font-semibold">Category</p>
          <select 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {categories?.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <p className="mb-2 text-lg font-semibold">Price ($)</p>
          <input 
            onChange={(e) => setPrice(e.target.value)}
            value={price} 
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="number" 
            placeholder="Enter price" 
          />
        </div>

        {/* Quantity */}
        <div>
          <p className="mb-2 text-lg font-semibold">Quantity</p>
          <input 
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity} 
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="number" 
            placeholder="Enter quantity" 
          />
        </div>
      </div>

      {/* Brand & Stock */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Brand */}
        <div>
          <p className="mb-2 text-lg font-semibold">Brand</p>
          <input 
            onChange={(e) => setBrand(e.target.value)}
            value={brand} 
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="text" 
            placeholder="Enter brand name" 
          />
        </div>

        {/* Stock */}
        <div>
          <p className="mb-2 text-lg font-semibold">Stock Count</p>
          <input 
            onChange={(e) => setStock(e.target.value)}
            value={stock} 
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="number" 
            placeholder="Enter stock count" 
          />
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-32 py-3 mt-6 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductList;
