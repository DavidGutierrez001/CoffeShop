import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const isAuth = !!localStorage.getItem("token");

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;