import express from 'express';
import {
    validateDiscountCode,
    createDiscountCode,
    getDiscountCodes,
    updateDiscountCode,
    deleteDiscountCode,
    applyDiscountCode
} from '../controllers/discountController.js';
import { authenticate, authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/validate', validateDiscountCode);

// Protected routes (require authentication)
router.get('/', authenticate, getDiscountCodes);

// Admin routes (require admin privileges)
router.post('/', authenticateAdmin, createDiscountCode);
router.put('/:id', authenticateAdmin, updateDiscountCode);
router.delete('/:id', authenticateAdmin, deleteDiscountCode);

router.post('/apply', authenticate, applyDiscountCode);

export default router; 