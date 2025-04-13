import mongoose from 'mongoose';

const userCouponSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  discountCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscountCode',
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  }
}, {
  timestamps: true
});

userCouponSchema.index({ user: 1, discountCode: 1 }, { unique: true });

const UserCoupon = mongoose.model('UserCoupon', userCouponSchema);

export default UserCoupon; 