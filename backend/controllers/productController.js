import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    let { name, description, price, category, quantity, brand, size, image, sizeQuantities } = req.fields;

    console.log("Received data:", req.fields); // Debug dữ liệu nhận từ frontend

    // Parse size nếu là JSON string
    if (typeof size === "string") {
      try {
        size = JSON.parse(size);
      } catch (error) {
        return res.status(400).json({ error: "Invalid size format" });
      }
    }

    // Parse sizeQuantities nếu là JSON string
    if (typeof sizeQuantities === "string") {
      try {
        sizeQuantities = JSON.parse(sizeQuantities);
      } catch (error) {
        return res.status(400).json({ error: "Invalid sizeQuantities format" });
      }
    }

    // Validate size array
    if (!Array.isArray(size) || size.length === 0 || size.some(s => s === null || s === "")) {
      return res.status(400).json({ error: "Size must be a non-empty array and cannot contain null values" });
    }

    // Validate sizeQuantities
    if (sizeQuantities) {
      for (const [key, value] of Object.entries(sizeQuantities)) {
        if (!size.includes(key)) {
          return res.status(400).json({ error: `Size ${key} in sizeQuantities does not exist in size array` });
        }
        if (typeof value !== 'number' || value < 0) {
          return res.status(400).json({ error: `Quantity for size ${key} must be a non-negative number` });
        }
      }
    }

    const product = new Product({ 
      name, 
      description, 
      price, 
      category, 
      quantity, 
      brand, 
      size, 
      image,
      sizeQuantities: sizeQuantities || {}
    });
    
    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    let { name, description, price, category, quantity, brand, size, image, sizeQuantities } = req.fields;

    // Parse size nếu là JSON string
    if (typeof size === "string") {
      try {
        size = JSON.parse(size);
      } catch (error) {
        return res.status(400).json({ error: "Invalid size format" });
      }
    }

    // Parse sizeQuantities nếu là JSON string
    if (typeof sizeQuantities === "string") {
      try {
        sizeQuantities = JSON.parse(sizeQuantities);
      } catch (error) {
        return res.status(400).json({ error: "Invalid sizeQuantities format" });
      }
    }

    // Validate các trường bắt buộc
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
      case !size || !Array.isArray(size):
        return res.json({ error: "Size must be an array and is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    // Validate sizeQuantities
    if (sizeQuantities) {
      for (const [key, value] of Object.entries(sizeQuantities)) {
        if (!size.includes(key)) {
          return res.status(400).json({ error: `Size ${key} in sizeQuantities does not exist in size array` });
        }
        if (typeof value !== 'number' || value < 0) {
          return res.status(400).json({ error: `Quantity for size ${key} must be a non-negative number` });
        }
      }
    }

    // Tạo object update
    const updateData = {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      size,
      sizeQuantities: sizeQuantities || undefined
    };

    // Thêm image nếu có
    if (image) {
      updateData.image = image;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
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
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const products = await Product.find({ ...keyword });
    const count = products.length;

    res.json({
      products,
      count,
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
    const products = await Product.find().sort({ _id: -1 }).limit(6);
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

// @desc    Update product quantity
// @route   PUT /api/products/:id/quantity
// @access  Private/Admin
const updateProductQuantity = async (req, res) => {
  try {
    const { quantity, sizeQuantities } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      if (sizeQuantities) {
        for (const [key, value] of Object.entries(sizeQuantities)) {
          if (!product.size.includes(key)) {
            return res.status(400).json({ error: `Size ${key} does not exist in product sizes` });
          }
          if (typeof value !== 'number' || value < 0) {
            return res.status(400).json({ error: `Quantity for size ${key} must be a non-negative number` });
          }
        }
        product.sizeQuantities = sizeQuantities;
        
        // Update total quantity based on size quantities
        const totalSizeQuantities = Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0);
        product.quantity = totalSizeQuantities;
      } else if (quantity !== undefined) {
        product.quantity = quantity;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
  updateProductQuantity,
};