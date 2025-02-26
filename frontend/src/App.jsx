import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/features/auth/authSlice";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // 🔥 Khôi phục userInfo từ localStorage khi reload
  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      dispatch(setCredentials(JSON.parse(savedUserInfo)));
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
};

export default App;
