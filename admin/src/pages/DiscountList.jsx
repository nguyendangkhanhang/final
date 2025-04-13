import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetDiscountCodesQuery,
    useCreateDiscountCodeMutation,
    useUpdateDiscountCodeMutation,
    useDeleteDiscountCodeMutation
} from '@frontend/redux/api/discountApiSlice';
import { resetDiscountState } from '@frontend/redux/features/discount/discountSlice';
import { toast } from 'react-toastify';

const DiscountList = () => {
    const dispatch = useDispatch();
    const { data: discountData, isLoading, error } = useGetDiscountCodesQuery();
    const discountCodes = discountData?.data || [];
    const [createDiscountCode] = useCreateDiscountCodeMutation();
    const [updateDiscountCode] = useUpdateDiscountCodeMutation();
    const [deleteDiscountCode] = useDeleteDiscountCodeMutation();

    const [showModal, setShowModal] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
        startDate: '',
        endDate: '',
        usageLimit: '',
        minimumOrderAmount: '',
        description: ''
    });

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || 'Có lỗi xảy ra');
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const discountData = {
            code: formData.code.toUpperCase(),
            discountPercentage: Number(formData.discountPercentage),
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            usageLimit: Number(formData.usageLimit),
            minimumOrderAmount: Number(formData.minimumOrderAmount) || 0,
            description: formData.description || '',
            isActive: true
        };

        try {
            if (editingDiscount) {
                await updateDiscountCode({ id: editingDiscount._id, discountData }).unwrap();
                toast.success('Cập nhật thành công');
            } else {
                await createDiscountCode(discountData).unwrap();
                toast.success('Tạo mã giảm giá thành công');
            }
            setShowModal(false);
            setEditingDiscount(null);
            setFormData({
                code: '',
                discountPercentage: '',
                startDate: '',
                endDate: '',
                usageLimit: '',
                minimumOrderAmount: '',
                description: ''
            });
        } catch (error) {
            toast.error(error?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleEdit = (discount) => {
        setEditingDiscount(discount);
        setFormData({
            code: discount.code,
            discountPercentage: discount.discountPercentage,
            startDate: new Date(discount.startDate).toISOString().split('T')[0],
            endDate: new Date(discount.endDate).toISOString().split('T')[0],
            usageLimit: discount.usageLimit,
            minimumOrderAmount: discount.minimumOrderAmount,
            description: discount.description
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
            try {
                await deleteDiscountCode(id).unwrap();
                toast.success('Xóa thành công');
            } catch (error) {
                toast.error(error?.data?.message || 'Có lỗi xảy ra');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
                <button
                    onClick={() => {
                        setEditingDiscount(null);
                        setFormData({
                            code: '',
                            discountPercentage: '',
                            startDate: '',
                            endDate: '',
                            usageLimit: '',
                            minimumOrderAmount: '',
                            description: ''
                        });
                        setShowModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Thêm mã giảm giá
                </button>
            </div>

            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Mã
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Giảm giá
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ngày bắt đầu
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ngày kết thúc
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Đã sử dụng
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Tối thiểu
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {discountCodes.map((discount) => (
                                <tr key={discount._id}>
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        {discount.code}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        {discount.discountPercentage}%
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        {new Date(discount.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        {new Date(discount.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        {discount.usedCount}/{discount.usageLimit}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        {discount.minimumOrderAmount.toLocaleString()}đ
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        <button
                                            onClick={() => handleEdit(discount)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discount._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {editingDiscount ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mã giảm giá
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Phần trăm giảm giá
                                </label>
                                <input
                                    type="number"
                                    value={formData.discountPercentage}
                                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Ngày bắt đầu
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Ngày kết thúc
                                </label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Giới hạn sử dụng
                                </label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Giá trị đơn hàng tối thiểu
                                </label>
                                <input
                                    type="number"
                                    value={formData.minimumOrderAmount}
                                    onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    min="0"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {editingDiscount ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountList; 