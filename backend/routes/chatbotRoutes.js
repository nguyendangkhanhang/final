import express from "express";
import {
  getOrderStatus,
  getCategoryInfo,
  getNewProducts,
  getTopRatedProducts,
} from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/order-status", getOrderStatus);
router.get("/categories", getCategoryInfo);
router.get("/new-products", getNewProducts);
router.get("/top-products", getTopRatedProducts);

export default router;