import mongoose from 'mongoose';

const discountCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        index: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    usageLimit: {
        type: Number,
        required: true,
        min: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    minimumOrderAmount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const DiscountCode = mongoose.model('DiscountCode', discountCodeSchema);

export default DiscountCode; 