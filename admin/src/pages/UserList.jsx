import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "@frontend/components/Message";
import Loader from "@frontend/components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@frontend/redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import Pagination from '@frontend/components/Pagination';

const UserList = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  
    const [deleteUser] = useDeleteUserMutation();
  
    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUserName, setEditableUserName] = useState("");
    const [editableUserEmail, setEditableUserEmail] = useState("");
  
    const [updateUser] = useUpdateUserMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  
    useEffect(() => {
      refetch();
    }, [refetch]);
  
    const deleteHandler = async (id) => {
      if (window.confirm("Are you sure")) {
        try {
          await deleteUser(id);
          refetch();
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    };
  
    const toggleEdit = (id, username, email) => {
      setEditableUserId(id);
      setEditableUserName(username);
      setEditableUserEmail(email);
    };
  
    const updateHandler = async (id) => {
      try {
        await updateUser({
          userId: id,
          username: editableUserName,
          email: editableUserEmail,
        });
        setEditableUserId(null);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };

    const totalPages = users ? Math.ceil(users.length / itemsPerPage) : 1;

    const currentUsers = users
        ? users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
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
              <h1 className="text-3xl uppercase font-bold text-[#5b3f15]">Users</h1>
              <p className="text-gray-400 mt-1">Manage your users and their permissions</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-[#5b3f15]">Loading...</div>
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <div className="">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#5b3f15] text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-[#efe9e0] transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-[#5b3f15]">
                          {user._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#5b3f15]">
                          {editableUserId === user._id ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={editableUserName}
                                onChange={(e) => setEditableUserName(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                              />
                              <button
                                onClick={() => updateHandler(user._id)}
                                className="ml-2 bg-[#bd8837] text-white py-2 px-4 rounded-lg hover:bg-[#5b3f15] transition-colors duration-200"
                              >
                                <FaCheck />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              {user.username} 
                              <button
                                onClick={() =>
                                  toggleEdit(user._id, user.username, user.email)
                                }
                                className="ml-2 text-[#bd8837] hover:text-[#5b3f15] transition-colors duration-200"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#5b3f15]">
                          {editableUserId === user._id ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={editableUserEmail}
                                onChange={(e) => setEditableUserEmail(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent"
                              />
                              <button
                                onClick={() => updateHandler(user._id)}
                                className="ml-2 bg-[#bd8837] text-white py-2 px-4 rounded-lg hover:bg-[#5b3f15] transition-colors duration-200"
                              >
                                <FaCheck />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <a href={`mailto:${user.email}`} className="text-[#bd8837] hover:text-[#5b3f15] transition-colors duration-200">{user.email}</a>
                              <button
                                onClick={() =>
                                  toggleEdit(user._id, user.username, user.email)
                                }
                                className="ml-2 text-[#bd8837] hover:text-[#5b3f15] transition-colors duration-200"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {user.isAdmin ? (
                            <FaCheck style={{ color: "green" }} />
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {!user.isAdmin && (
                            <button
                              onClick={() => deleteHandler(user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex justify-center mt-6">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default UserList;