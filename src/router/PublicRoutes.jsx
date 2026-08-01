import { Navigate, Outlet } from "react-router-dom";

function PublicRoutes() {
    const isAuth = !!localStorage.getItem("token");

    return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default PublicRoutes;