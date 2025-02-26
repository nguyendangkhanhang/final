import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@frontend/redux/store"; // Sử dụng chung store với frontend
import { ToastContainer } from "react-toastify";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // Thêm PayPal provider để fix lỗi

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <PayPalScriptProvider>
        {/* Bọc toàn bộ admin bằng PayPalScriptProvider để tránh lỗi khi gọi usePayPalScriptReducer */}
        <ToastContainer />
        <App />
      </PayPalScriptProvider>
    </BrowserRouter>
  </Provider>
);
