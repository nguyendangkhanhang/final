import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);
    console.log("AdminRoute - User Info:", userInfo); // Debug Redux state

    if (!userInfo) {
        return <Navigate to="/admin/login" replace={true} />;
    }

    return userInfo.isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace={true} />;
};

export default AdminRoute;
