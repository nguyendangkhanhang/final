import express from 'express';
import {
  saveUserCoupon,
  getUserCoupons,
  markCouponAsUsed
} from '../controllers/userCouponController.js';
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', authenticate, saveUserCoupon);
router.get('/', authenticate, getUserCoupons);
router.put('/:couponId/use', authenticate, markCouponAsUsed);

export default router; 