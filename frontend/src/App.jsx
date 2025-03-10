import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import Footer from './components/Footer'
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
      <main className="pt-[5rem] py-3">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
