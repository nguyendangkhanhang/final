import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "@frontend/redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@frontend/redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const sizesAvailable = ["S", "M", "L", "XL", "XXL"];

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSizeChange = (sizeValue) => {
    setSize((prevSizes) =>
      prevSizes.includes(sizeValue)
        ? prevSizes.filter((s) => s !== sizeValue)
        : [...prevSizes, sizeValue]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (size.length === 0) {
      toast.error("Please select at least one size!");
      return;
    }

    if (!image) {
      toast.error("Please upload an image!");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("size", JSON.stringify(size));

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Product creation failed. Try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);

      const fullImageUrl = res.image.startsWith("/uploads")
        ? `http://localhost:5000${res.image.replace(/\\/g, "/")}`
        : res.image;

      setImage(res.image);
      setImageUrl(fullImageUrl);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase text-[#5b3f15]">Create New Product</h1>
            <p className="text-gray-400 mt-1">Add a new product to your inventory</p>
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
                  <label className="block text-lg font-semibold text-[#5b3f15]">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#5b3f15] shadow-sm focus:border-[#bd8837] focus:ring-[#bd8837]"
                    required
                  />
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
                  <label className="block text-lg font-semibold text-[#5b3f15] mb-2">Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {sizesAvailable.map((s) => (
                      <button
                        key={s}
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

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#bd8837] text-white px-6 py-2 rounded-lg hover:bg-[#5b3f15] transition-colors duration-200"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
