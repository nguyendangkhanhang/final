import DiscountCode from '../models/discountModel.js';
import * as expressValidator from 'express-validator';

// Validation function
const validateDiscountCodeData = (req) => {
    const errors = [];
    
    // Validate code
    if (!req.body.code || req.body.code.trim().length < 3 || req.body.code.trim().length > 20) {
        errors.push({ field: 'code', message: 'Discount code must be between 3 and 20 characters' });
    }

    // Validate discountPercentage
    if (!req.body.discountPercentage || req.body.discountPercentage < 0 || req.body.discountPercentage > 100) {
        errors.push({ field: 'discountPercentage', message: 'Discount percentage must be between 0 and 100' });
    }

    // Validate startDate
    if (!req.body.startDate || isNaN(new Date(req.body.startDate).getTime())) {
        errors.push({ field: 'startDate', message: 'Invalid start date' });
    }

    // Validate endDate
    if (!req.body.endDate || isNaN(new Date(req.body.endDate).getTime())) {
        errors.push({ field: 'endDate', message: 'Invalid end date' });
    } else if (new Date(req.body.endDate) <= new Date(req.body.startDate)) {
        errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }

    // Validate usageLimit
    if (!req.body.usageLimit || !Number.isInteger(req.body.usageLimit) || req.body.usageLimit < 1) {
        errors.push({ field: 'usageLimit', message: 'Usage limit must be an integer greater than 0' });
    }

    return errors;
};

// Validate discount code
const validateDiscountCode = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        const currentDate = new Date();

        const discountCode = await DiscountCode.findOne({
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        });

        if (!discountCode) {
            return res.status(404).json({
                success: false,
                message: 'Invalid discount code or expired'
            });
        }

        if (discountCode.usedCount >= discountCode.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Discount code has reached its usage limit'
            });
        }

        if (orderAmount < discountCode.minimumOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Order must have a minimum value of ${discountCode.minimumOrderAmount}`
            });
        }

        const discountAmount = (orderAmount * discountCode.discountPercentage) / 100;
        const finalAmount = orderAmount - discountAmount;

        res.status(200).json({
            success: true,
            data: {
                discountCode: discountCode.code,
                discountPercentage: discountCode.discountPercentage,
                discountAmount,
                finalAmount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create new discount code
const createDiscountCode = async (req, res) => {
    try {
        const errors = validateDiscountCodeData(req);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        // Check if code already exists
        const existingCode = await DiscountCode.findOne({ code: req.body.code.toUpperCase() });
        if (existingCode) {
            return res.status(400).json({
                success: false,
                message: 'Discount code already exists'
            });
        }

        const discountCode = await DiscountCode.create({
            ...req.body,
            code: req.body.code.toUpperCase()
        });
        
        res.status(201).json({
            success: true,
            data: discountCode
        });
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({
                success: false,
                message: 'Discount code already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Get all discount codes
const getDiscountCodes = async (req, res) => {
    try {
        const discountCodes = await DiscountCode.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: discountCodes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update discount code
const updateDiscountCode = async (req, res) => {
    try {
        const errors = validateDiscountCodeData(req);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        const discountCode = await DiscountCode.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!discountCode) {
            return res.status(404).json({
                success: false,
                message: 'Discount code not found'
            });
        }

        res.status(200).json({
            success: true,
            data: discountCode
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Delete discount code
const deleteDiscountCode = async (req, res) => {
    try {
        const discountCode = await DiscountCode.findByIdAndDelete(req.params.id);

        if (!discountCode) {
            return res.status(404).json({
                success: false,
                message: 'Discount code not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Discount code deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const applyDiscountCode = async (req, res) => {
    try {
        const { code, items } = req.body;

        // Tìm mã giảm giá
        const discountCode = await DiscountCode.findOne({ code });
        if (!discountCode) {
            return res.status(404).json({
                success: false,
                message: 'Invalid discount code'
            });
        }

        // Kiểm tra ngày hết hạn
        const now = new Date();
        const startDate = new Date(discountCode.startDate);
        const endDate = new Date(discountCode.endDate);

        console.log('Current date:', now);
        console.log('Start date:', startDate);
        console.log('End date:', endDate);

        if (now < startDate) {
            return res.status(400).json({
                success: false,
                message: 'Discount code has not started yet'
            });
        }

        if (now > endDate) {
            return res.status(400).json({
                success: false,
                message: 'Discount code has expired'
            });
        }

        // Kiểm tra số lần sử dụng
        if (discountCode.usageCount >= discountCode.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Discount code has reached its usage limit'
            });
        }

        // Tính tổng giá trị đơn hàng
        const subtotal = items.reduce((total, item) => total + (item.price * item.qty), 0);

        // Tính số tiền được giảm
        const discountAmount = (subtotal * discountCode.discountPercentage) / 100;

        // Trả về thông tin giảm giá
        res.status(200).json({
            success: true,
            data: {
                discountAmount,
                total: subtotal - discountAmount,
                discountCode: {
                    code: discountCode.code,
                    discountPercentage: discountCode.discountPercentage
                }
            }
        });
    } catch (error) {
        console.error('Error applying discount code:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export {
    validateDiscountCode,
    createDiscountCode,
    getDiscountCodes,
    updateDiscountCode,
    deleteDiscountCode,
    applyDiscountCode
}; 