import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Get product recommendations based on user query
const getProductRecommendations = asyncHandler(async (req, res) => {
  const { query } = req.body;
  
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    }).limit(5);

    if (products.length === 0) {
      return res.json({ 
        message: "I'm sorry, I couldn't find any products matching your request.",
        products: []
      });
    }

    const productList = products.map(p => ({
      name: p.name,
      price: p.price,
      description: p.description
    }));

    return res.json({
      message: "Here are some products that match your request:",
      products: productList
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order status
const getOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.json({
        message: "I'm sorry, I couldn't find an order with this ID.",
        order: null
      });
    }

    return res.json({
      message: `Your order status is: ${order.status}`,
      order: {
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category information
const getCategoryInfo = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    
    if (categories.length === 0) {
      return res.json({
        message: "I'm sorry, I couldn't find any categories.",
        categories: []
      });
    }

    return res.json({
      message: "Here are the product categories:",
      categories: categories.map(c => c.name)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  getProductRecommendations,
  getOrderStatus,
  getCategoryInfo
}; 