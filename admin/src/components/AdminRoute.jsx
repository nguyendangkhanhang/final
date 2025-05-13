import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  if (!adminInfo?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;