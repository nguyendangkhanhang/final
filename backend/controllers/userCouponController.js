import UserCoupon from '../models/userCouponModel.js';
import DiscountCode from '../models/discountModel.js';

// Lưu mã giảm giá cho user
export const saveUserCoupon = async (req, res) => {
  try {
    const { discountCodeId } = req.body;
    const userId = req.user._id;

    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Kiểm tra mã giảm giá có tồn tại và còn hiệu lực không
    const discountCode = await DiscountCode.findOne({
      _id: discountCodeId,
      isActive: true,
      startDate: { $lte: endOfToday },  // Cho phép startDate <= hôm nay
      endDate: { $gte: now }            // Chỉ cần endDate >= thời điểm hiện tại
    });

    if (!discountCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid discount code or expired'
      });
    }

    // Kiểm tra user đã lưu mã này chưa
    const existingCoupon = await UserCoupon.findOne({
      user: userId,
      discountCode: discountCodeId
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'You have already saved this discount code'
      });
    }

    // Lưu mã giảm giá cho user
    const userCoupon = await UserCoupon.create({
      user: userId,
      discountCode: discountCodeId
    });

    res.status(201).json({
      success: true,
      data: userCoupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Lấy danh sách mã giảm giá của user
export const getUserCoupons = async (req, res) => {
  try {
    const userId = req.user._id;

    const userCoupons = await UserCoupon.find({ user: userId })
      .populate('discountCode')
      .sort({ createdAt: -1 });

    const filteredCoupons = userCoupons.filter(coupon => coupon.discountCode);

    res.status(200).json({
      success: true,
      data: filteredCoupons
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Đánh dấu mã giảm giá đã sử dụng
export const markCouponAsUsed = async (req, res) => {
  try {
    const { couponId } = req.params;
    const userId = req.user._id;

    const userCoupon = await UserCoupon.findOneAndUpdate(
      { _id: couponId, user: userId },
      { isUsed: true, usedAt: new Date() },
      { new: true }
    );

    if (!userCoupon) {
      return res.status(404).json({
        success: false,
        message: 'Discount code not found'
      });
    }

    // ✅ Tăng usedCount cho discountCode
    const discountCode = await DiscountCode.findById(userCoupon.discountCode);
    if (discountCode.usedCount < discountCode.usageLimit) {
      discountCode.usedCount += 1;
      await discountCode.save();
    }

    res.status(200).json({
      success: true,
      data: userCoupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
