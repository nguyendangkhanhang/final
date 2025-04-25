import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "@frontend/redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@frontend/redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const sizesAvailable = ["S", "M", "L", "XL", "XXL"];

const ProductUpdate = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading } = useGetProductByIdQuery(_id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState([]);
  const [quantity, setQuantity] = useState({});

  useEffect(() => {
    if (productData) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || "");
      setBrand(productData.brand || "");
      setSize(productData.size || []);
      
      // Khởi tạo quantity từ sizeQuantities
      if (productData.sizeQuantities) {
        const initialQuantities = {};
        productData.size.forEach(s => {
          initialQuantities[s] = productData.sizeQuantities[s] || 0;
        });        
        setQuantity(initialQuantities);
      }
      
      const fullImageUrl = productData.image?.startsWith("/uploads")
        ? `http://localhost:5000${productData.image.replace(/\\/g, "/")}`
        : productData.image;
  
      setImage(productData.image);
      setImageUrl(fullImageUrl);
    }
  }, [productData]);

  const handleSizeChange = (sizeValue) => {
    setSize((prevSizes) => {
      if (prevSizes.includes(sizeValue)) {
        const newSizes = prevSizes.filter((s) => s !== sizeValue);
        setQuantity(prev => {
          const newQuantity = { ...prev };
          delete newQuantity[sizeValue];
          return newQuantity;
        });
        return newSizes;
      } else {
        setQuantity(prev => ({ ...prev, [sizeValue]: 0 }));
        return [...prevSizes, sizeValue];
      }
    });
  };

  const handleQuantityChange = (size, value) => {
    setQuantity(prev => ({
      ...prev,
      [size]: parseInt(value) || 0
    }));
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");

      const fullImageUrl = res.image.startsWith("/uploads")
        ? `http://localhost:5000${res.image.replace(/\\/g, "/")}`
        : res.image;

      setImage(res.image);
      setImageUrl(fullImageUrl);
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("size", JSON.stringify(size));
      
      // Tính tổng số lượng
      const totalQuantity = size.reduce((total, s) => total + (quantity[s] || 0), 0);
      formData.append("quantity", totalQuantity);

      // Thêm số lượng cho từng size
      const sizeQuantities = {};
      size.forEach(s => {
        sizeQuantities[s] = quantity[s] || 0;
      });
      formData.append("sizeQuantities", JSON.stringify(sizeQuantities));

      const { data } = await updateProduct({ productId: _id, formData });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Product successfully updated");
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error("Product update failed. Try Again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;

      const { data } = await deleteProduct(_id);
      toast.success(`${data.name} is deleted`);
      navigate("/admin/allproductslist");
    } catch (error) {
      toast.error("Delete failed. Try Again.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase text-[#5b3f15]">Update Product</h1>
            <p className="text-gray-400 mt-1">Modify the details of your product</p>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {imageUrl ? (
                <div className="mb-4">
                  <img
                    src={imageUrl}
                    alt="product preview"
                    className="mx-auto max-h-[200px] rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1">Drag and drop an image here or click to select</p>
                </div>
              )}
              <label className="cursor-pointer bg-[#bd8837] text-white px-4 py-2 rounded-lg hover:bg-[#5b3f15] transition-colors duration-200">
                {image ? "Change Image" : "Choose Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold text-[#5b3f15]">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#5b3f15] shadow-sm focus:border-[#bd8837] focus:ring-[#bd8837]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-[#5b3f15]">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#5b3f15] shadow-sm focus:border-[#bd8837] focus:ring-[#bd8837]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-[#5b3f15]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#5b3f15] shadow-sm focus:border-[#bd8837] focus:ring-[#bd8837]"
                    required
                  >
                    <option value="">Select category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-[#5b3f15]">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#5b3f15] shadow-sm focus:border-[#bd8837] focus:ring-[#bd8837]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold text-[#5b3f15] mb-2">Sizes and Quantities</label>
                  <div className="space-y-2">
                    {sizesAvailable.map((s) => (
                      <div key={s} className="grid grid-cols-[80px_1fr] items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSizeChange(s)}
                          className={`px-4 py-2 rounded-full text-lg font-semibold transition-colors ${
                            size.includes(s)
                              ? "bg-[#bd8837] text-white"
                              : "bg-gray-200 text-[#5b3f15] hover:bg-gray-300"
                          }`}
                        >
                          {s}
                        </button>
                        {size.includes(s) && (
                          <input
                            type="number"
                            min="0"
                            value={quantity[s] || 0}
                            onChange={(e) => handleQuantityChange(s, e.target.value)}
                            className="w-20 p-2 border border-[#5b3f15] rounded-lg shadow-sm focus:border-[#bd8837] focus:ring-[#bd8837]"
                            placeholder="Qty"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-[#5b3f15]">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="mt-1 block w-full p-2 border border-[#5b3f15] shadow-sm focus:border-[#bd8837] focus:ring-[#bd8837]"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Delete Product
              </button>
              <button
                type="submit"
                className="bg-[#bd8837] text-white px-6 py-2 rounded-lg hover:bg-[#5b3f15] transition-colors duration-200"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
