import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApplyDiscountCodeMutation } from '../redux/api/discountApiSlice';
import { toast } from 'react-toastify';
import { setDiscount } from '../redux/features/cart/cartSlice';
import { Link } from 'react-router-dom';

const DiscountCodeInput = ({ onDiscountApplied }) => {
    const [code, setCode] = useState('');
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const { userInfo } = useSelector((state) => state.auth);
    const [applyDiscountCode] = useApplyDiscountCodeMutation();

    const handleApplyDiscount = async (e) => {
        e.preventDefault();
        if (!code.trim()) {
            toast.error('Vui lòng nhập mã giảm giá');
            return;
        }

        if (!userInfo) {
            toast.error('Vui lòng đăng nhập để sử dụng mã giảm giá');
            return;
        }

        try {
            const res = await applyDiscountCode({
                code,
                items: cartItems
            }).unwrap();

            if (res.success) {
                // Cập nhật thông tin giảm giá vào Redux store
                const discountInfo = {
                    code: res.data.discountCode.code,
                    discountPercentage: res.data.discountCode.discountPercentage
                };
                dispatch(setDiscount(discountInfo));
                toast.success('Áp dụng mã giảm giá thành công');
            }
        } catch (error) {
            toast.error(error?.data?.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá');
        }
    };

    if (!userInfo) {
        return (
            <div className="mb-4 text-center">
                <p className="text-gray-600 mb-2">Vui lòng đăng nhập để sử dụng mã giảm giá</p>
                <Link to="/login" className="text-blue-500 hover:underline">
                    Đăng nhập
                </Link>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <form onSubmit={handleApplyDiscount} className="flex gap-2">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Áp dụng
                </button>
            </form>
        </div>
    );
};

export default DiscountCodeInput; 