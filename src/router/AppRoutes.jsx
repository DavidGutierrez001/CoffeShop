import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/layout/DashboardLayout";

import Dashboard from "@/pages/Dashboard";
import DashboardProductos from "@/pages/DashboardProductos";

import PublicRoutes from "@/router/PublicRoutes";
import PrivateRoutes from "@/router/PrivateRoutes";

const router = createBrowserRouter([

    {
        element: <PublicRoutes />,
        errorElement: <NotFound />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/", element: <Login /> },
        ]
    },

    {
        element: <PrivateRoutes />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/dashboard",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <Dashboard /> },
                    { path: "/dashboard/inventario/productos", element: <DashboardProductos /> },
                    { path: "*", element: <NotFound /> },
                ]
            }

        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default router;