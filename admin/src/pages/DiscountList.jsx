import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetDiscountCodesQuery,
    useCreateDiscountCodeMutation,
    useUpdateDiscountCodeMutation,
    useDeleteDiscountCodeMutation
} from '@frontend/redux/api/discountApiSlice';
import { toast } from 'react-toastify';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Pagination from '@frontend/components/Pagination';

const DiscountList = () => {
    const dispatch = useDispatch();
    const { data: discountData, isLoading, error } = useGetDiscountCodesQuery();
    const discountCodes = discountData?.data || [];
    const [createDiscountCode] = useCreateDiscountCodeMutation();
    const [updateDiscountCode] = useUpdateDiscountCodeMutation();
    const [deleteDiscountCode] = useDeleteDiscountCodeMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
            toast.error(error?.data?.message || 'Error');
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
                toast.success('Update successfully');
            } else {
                await createDiscountCode(discountData).unwrap();
                toast.success('Create successfully');
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
            if (error?.data?.errors && Array.isArray(error.data.errors)) {
                error.data.errors.forEach(err => {
                    toast.error(`${err.field.toUpperCase()}: ${err.message}`);
                });
            } else {
                toast.error(error?.data?.message || 'Error');
            }
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
        if (window.confirm('Are you sure you want to delete this discount code?')) {
            try {
                await deleteDiscountCode(id).unwrap();
                toast.success('Delete successfully');
            } catch (error) {
                toast.error(error?.data?.message || 'Error');
            }
        }
    };

    const totalPages = discountCodes ? Math.ceil(discountCodes.length / itemsPerPage) : 1;

    const currentDiscountCodes = discountCodes
        ? discountCodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : [];

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl uppercase font-bold text-[#5b3f15]">Discount Codes</h1>
                        <p className="text-gray-400 mt-1">Manage your discount codes and promotions</p>
                    </div>
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
                        className="flex items-center gap-2 bg-white border border-[#5b3f15] text-[#5b3f15] px-6 py-3 hover:bg-[#5b3f15] hover:text-white transition-colors duration-200 shadow-lg"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Discount Code
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center text-[#5b3f15]">Loading...</div>
                ) : (
                    <div >
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-[#5b3f15] text-white">
                                        <th className="px-6 py-4 text-left text-base font-semibold uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-6 py-4 text-left text-base font-semibold uppercase tracking-wider">
                                            Discount
                                        </th>
                                        <th className="px-6 py-4 text-left text-base font-semibold uppercase tracking-wider">
                                            Start Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-base font-semibold uppercase tracking-wider">
                                            End Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-base font-semibold uppercase tracking-wider">
                                            Usage
                                        </th>
                                        <th className="px-6 py-4 text-left text-base font-semibold uppercase tracking-wider">
                                            Min. Order
                                        </th>
                                        <th className="px-6 py-4 text-left text-base font-semibold uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentDiscountCodes.map((discount) => (
                                        <tr key={discount._id} className="hover:bg-[#efe9e0] transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-black font-medium">
                                                {discount.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-black">
                                                {discount.discountPercentage}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-black">
                                                {new Date(discount.startDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-black">
                                                {new Date(discount.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-black">
                                                {discount.usedCount}/{discount.usageLimit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-black">
                                                {discount.minimumOrderAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(discount)}
                                                        className="p-2 text-[#bd8837] hover:text-[#5b3f15] hover:bg-[#efe9e0] rounded-lg transition-colors duration-200"
                                                        title="Edit"
                                                    >
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(discount._id)}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-xl w-[500px] shadow-2xl">
                            <h2 className="text-2xl font-bold text-[#5b3f15] mb-6">
                                {editingDiscount ? 'Edit Discount Code' : 'Add New Discount Code'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[#5b3f15] text-sm font-semibold mb-2">
                                        Discount Code
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#5b3f15] text-sm font-semibold mb-2">
                                        Discount Percentage
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.discountPercentage}
                                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                                        min="0"
                                        max="100"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[#5b3f15] text-sm font-semibold mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#5b3f15] text-sm font-semibold mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[#5b3f15] text-sm font-semibold mb-2">
                                            Usage Limit
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.usageLimit}
                                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#5b3f15] text-sm font-semibold mb-2">
                                            Minimum Order Amount
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.minimumOrderAmount}
                                            onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[#5b3f15] text-sm font-semibold mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 border border-[#5b3f15] text-[#5b3f15] rounded-lg hover:bg-[#efe9e0] transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-[#bd8837] text-white rounded-lg hover:bg-[#5b3f15] transition-colors duration-200"
                                    >
                                        {editingDiscount ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountList; 