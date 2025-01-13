import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";

import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

import Profile from "./pages/User/Profile.jsx";

import AdminRoute from "./pages/Admin/AdminRoute";
import UserList from "./pages/Admin/UserList";

// import CategoryList from "./pages/Admin/CategoryList";

// import ProductList from "./pages/Admin/ProductList";
// import AllProducts from "./pages/Admin/AllProducts";
// import ProductUpdate from "./pages/Admin/ProductUpdate";

// import Home from "./pages/Home.jsx";
// import Favorites from "./pages/Products/Favorites.jsx";
// import ProductDetails from "./pages/Products/ProductDetails.jsx";

// import Cart from "./pages/Cart.jsx";
// import Shop from "./pages/Shop.jsx";

// import Shipping from "./pages/Orders/Shipping.jsx";
// import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
// import Order from "./pages/Orders/Order.jsx";
// import OrderList from "./pages/Admin/OrderList.jsx";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} /> */}
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        {/* <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="dashboard" element={<AdminDashboard />} /> */}
      </Route>

    </Route>
  )
);


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
