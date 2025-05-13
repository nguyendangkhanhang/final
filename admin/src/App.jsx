import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Order from "@frontend/pages/Orders/Order";
import DiscountList from "./pages/DiscountList";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const App = () => {
  const location = useLocation();
  const [adminInfo, setAdminInfo] = useState(() =>
    JSON.parse(localStorage.getItem("adminInfo"))
  );

  if (!adminInfo?.isAdmin) {
    return <Login setAdminInfo={setAdminInfo} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      <>
        <Header setAdminInfo={setAdminInfo} />
        <hr />
        <div className="flex w-full">
          <Sidebar />
          <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
            <Routes key={location.pathname}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/" element={<AdminRoute />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="allproductslist" element={<AllProducts />} />
                <Route path="categorylist" element={<CategoryList />} />
                <Route path="orderlist" element={<OrderList />} />
                <Route path="order/:id" element={<Order />} />
                <Route path="productlist" element={<ProductList />} />
                <Route path="product/update/:_id" element={<ProductUpdate />} />
                <Route path="userlist" element={<UserList />} />
                <Route path="discountlist" element={<DiscountList />} />
              </Route>
            </Routes>
          </div>
        </div>
      </>
    </div>
  );
};

export default App;