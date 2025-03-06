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
  const [subCategory, setSubCategory] = useState("");
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
      productData.append("subCategory", subCategory);
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
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12">Create Product</div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-3">
            <label>Name</label>
            <input type="text" className="input-style" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Price</label>
            <input type="number" className="input-style" value={price} onChange={(e) => setPrice(e.target.value)} />

            <label>Quantity</label>
            <input type="number" className="input-style" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

            <label>Brand</label>
            <input type="text" className="input-style" value={brand} onChange={(e) => setBrand(e.target.value)} />

            <label>Description</label>
            <textarea className="input-style" value={description} onChange={(e) => setDescription(e.target.value)} />

            <label>Category</label>
            <select className="input-style" onChange={(e) => setCategory(e.target.value)}>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label>Sub Category</label>
            <select className="input-style" onChange={(e) => setSubCategory(e.target.value)}>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>

            <label>Product Sizes</label>
            <div className="flex gap-3">
              {sizesAvailable.map((s) => (
                <div key={s} onClick={() => handleSizeChange(s)}>
                  <p className={`px-3 py-1 cursor-pointer ${size.includes(s) ? "bg-pink-100" : "bg-slate-200"}`}>
                    {s}
                  </p>
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} className="submit-btn">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
