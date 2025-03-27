import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    let { name, description, price, category, subCategory, quantity, brand, size, image } = req.fields;

    console.log("Received data:", req.fields); // Debug dữ liệu nhận từ frontend

    // 🛠 Kiểm tra nếu `size` là chuỗi JSON, cần parse thành mảng
    if (typeof size === "string") {
      try {
        size = JSON.parse(size); // Chuyển JSON string thành array
      } catch (error) {
        return res.status(400).json({ error: "Invalid size format" });
      }
    }

    // 🛠 Đảm bảo `size` là mảng hợp lệ, không chứa `null`
    if (!Array.isArray(size) || size.length === 0 || size.some(s => s === null || s === "")) {
      return res.status(400).json({ error: "Size must be a non-empty array and cannot contain null values" });
    }

    const product = new Product({ name, description, price, category, subCategory, quantity, brand, size, image });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    let { name, description, price, category, subCategory, quantity, brand, size } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !subCategory:
        return res.json({ error: "SubCategory is required" });
      case !size || !Array.isArray(size):
        return res.json({ error: "Size must be an array and is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, subCategory, quantity, brand, size },
      { new: true }
    );

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subCategory"); // Populate thêm subCategory

    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .populate("subCategory") // Populate thêm subCategory
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
        createdAt: new Date(), // Lưu thời gian review
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      // Tính toán lại rating trung bình
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added successfully" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// const getProductRecommendations = async (req, res) => {
//   try {
//     const { query } = req.body;  // Query từ khách hàng (ví dụ: tìm "t-shirt", "laptop", v.v.)
    
//     const products = await Product.find({
//       name: { $regex: query, $options: "i" },  // Tìm kiếm theo tên sản phẩm
//     });

//     if (products.length === 0) {
//       return res.status(404).json({ error: "No products found matching your request." });
//     }

//     const productNames = products.map(product => product.name).join(", ");
//     res.json({ message: `We recommend these products: ${productNames}` });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  // getProductRecommendations,
};