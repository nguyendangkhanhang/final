import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@frontend/redux/store"; 
import { ToastContainer } from "react-toastify";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <PayPalScriptProvider>
        <ToastContainer />
        <App />
      </PayPalScriptProvider>
    </BrowserRouter>
  </Provider>
);
