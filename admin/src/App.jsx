import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation  } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import UserList from "./pages/UserList.jsx";
import CategoryList from "./pages/CategoryList.jsx";
import ProductList from "./pages/ProductList";
import AllProducts from "./pages/AllProducts";
import ProductUpdate from "./pages/ProductUpdate";
import OrderList from "./pages/OrderList.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Login from "./components/Login";
import AdminRoute from "./components/AdminRoute";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const App = () => {
  const location = useLocation(); // Lấy location để làm key cho Routes
  const { userInfo } = useSelector((state) => state.auth); // Lấy thông tin user từ Redux
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);


  return (
    <div className="bg-gray-50 min-h-screen">
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Header setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
            <Routes key={location.pathname}>
                <Route path="/admin/" element={<AdminRoute />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="allproductslist" element={<AllProducts />} />
                    <Route path="categorylist" element={<CategoryList />} />
                    <Route path="orderlist" element={<OrderList />} />
                    <Route path="productlist" element={<ProductList />} />
                    <Route path="product/update/:_id" element={<ProductUpdate />} />
                    <Route path="userlist" element={<UserList />} />
                </Route>
            </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
