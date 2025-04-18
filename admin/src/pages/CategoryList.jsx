import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "@frontend/redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../components/CategoryForm";
import Modal from "@frontend/components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
    const { data: categories } = useFetchCategoriesQuery();
    const [name, setName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updatingName, setUpdatingName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
  
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
  
    const handleCreateCategory = async (e) => {
      e.preventDefault();
  
      if (!name) {
        toast.error("Category name is required");
        return;
      }
  
      try {
        const result = await createCategory({ name }).unwrap();
        if (result.error) {
          toast.error(result.error);
        } else {
          setName("");
          toast.success(`${result.name} is created.`);
        }
      } catch (error) {
        console.error(error);
        toast.error("Creating category failed, try again.");
      }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
    
        if (!updatingName) {
          toast.error("Category name is required");
          return;
        }
    
        try {
          const result = await updateCategory({
            categoryId: selectedCategory._id,
            updatedCategory: {
              name: updatingName,
            },
          }).unwrap();
    
          if (result.error) {
            toast.error(result.error);
          } else {
            toast.success(`${result.name} is updated`);
            setSelectedCategory(null);
            setUpdatingName("");
            setModalVisible(false);
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      const handleDeleteCategory = async () => {
        try {
          const result = await deleteCategory(selectedCategory._id).unwrap();
    
          if (result.error) {
            toast.error(result.error);
          } else {
            toast.success(`${result.name} is deleted.`);
            setSelectedCategory(null);
            setModalVisible(false);
          }
        } catch (error) {
          console.error(error);
          toast.error("Category deletion failed. Try again.");
        }
      };

return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold uppercase text-[#5b3f15]">Manage Categories</h1>
                        <p className="text-gray-400 mt-1">Create, update, or delete categories</p>
                    </div>
                </div>

                <CategoryForm
                    value={name}
                    setValue={setName}
                    handleSubmit={handleCreateCategory}
                />
                <hr className="my-6" />

                <h1 className="text-3xl font-bold uppercase text-[#5b3f15] mb-4">All Categories</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories?.map((category) => (
                        <div key={category._id} className="bg-white py-2 px-4 border border-gray-300 rounded-md w-full overflow-hidden shadow-sm mt-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-yellow-500">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-[#5b3f15]">{category.name}</span>
                                <button
                                    className="bg-[#bd8837] text-white px-4 py-2 rounded-lg hover:bg-[#5b3f15] transition-colors duration-200"
                                    onClick={() => {
                                        setModalVisible(true);
                                        setSelectedCategory(category);
                                        setUpdatingName(category.name);
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                    <CategoryForm
                        value={updatingName}
                        setValue={(value) => setUpdatingName(value)}
                        handleSubmit={handleUpdateCategory}
                        buttonText="Update"
                        handleDelete={handleDeleteCategory}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default CategoryList;