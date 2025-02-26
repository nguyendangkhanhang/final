import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, createOrder).get(authenticateAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(authenticateAdmin, countTotalOrders);
router.route("/total-sales").get(authenticateAdmin, calculateTotalSales);
router.route("/total-sales-by-date").get(authenticateAdmin, calcualteTotalSalesByDate);

router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router.route("/:id/deliver").put(authenticateAdmin, markOrderAsDelivered);

export default router;
