import express from "express";
import {
  getProductRecommendations,
  getOrderStatus,
  getCategoryInfo
} from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/recommend-products", getProductRecommendations);
router.post("/order-status", getOrderStatus);
router.get("/categories", getCategoryInfo);

export default router; 