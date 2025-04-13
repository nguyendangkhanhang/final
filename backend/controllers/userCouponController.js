import UserCoupon from '../models/userCouponModel.js';
import DiscountCode from '../models/discountModel.js';

// Lưu mã giảm giá cho user
export const saveUserCoupon = async (req, res) => {
  try {
    const { discountCodeId } = req.body;
    const userId = req.user._id;

    // Kiểm tra mã giảm giá có tồn tại và còn hiệu lực không
    const discountCode = await DiscountCode.findOne({
      _id: discountCodeId,
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    if (!discountCode) {
      return res.status(404).json({
        success: false,
        message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
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
        message: 'Bạn đã lưu mã giảm giá này rồi'
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
      message: 'Lỗi server',
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

    res.status(200).json({
      success: true,
      data: userCoupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
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
        message: 'Không tìm thấy mã giảm giá'
      });
    }

    res.status(200).json({
      success: true,
      data: userCoupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}; 