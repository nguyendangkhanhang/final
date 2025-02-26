import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
