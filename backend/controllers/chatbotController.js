import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Order status
const getOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    return res.json({ message: "No order found with this ID." });
  }
  res.json({
    message: `Your order status is: ${order.status}`,
    order: {
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt
    }
  });
});

// Categories
const getCategoryInfo = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    if (!categories.length) {
      return res.json({ message: "No categories available.", categories: [] });
    }
    res.json({
      message: "Available product categories:",
      categories: categories.map(c => c.name)
    });
  } catch (error) {
    console.error("Category error:", error);
    res.status(500).json({ 
      message: "Sorry, there was an error fetching categories. Please try again.",
      error: error.message 
    });
  }
});

// New products
const getNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(6);
  const productList = products.map(p => ({
    name: p.name,
    price: p.price,
  }));
  res.json({ message: "🆕 New products:", products: productList });
});

// Top-rated products
const getTopRatedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ rating: -1 }).limit(4);
  const productList = products.map(p => ({
    name: p.name,
    rating: p.rating,
    price: p.price
  }));
  res.json({ message: "🌟 Top-rated products:", products: productList });
});


export {
  getOrderStatus,
  getCategoryInfo,
  getNewProducts,
  getTopRatedProducts
};
