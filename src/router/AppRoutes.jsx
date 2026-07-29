import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/layout/DashboardLayout";

import Dashboard from "@/pages/Dashboard";
import DashboardUsuarios from "@/pages/DashboardUsuarios";
import DashboardPedidos from "@/pages/DashboardPedidos"

import PublicRoutes from "@/router/PublicRoutes";
import PrivateRoutes from "@/router/PrivateRoutes";

const router = createBrowserRouter([

    {
        element: <PublicRoutes />,
        errorElement: <NotFound />,
        children: [
            { path: "/login", element: <Login /> },
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
                    { path: "/dashboard/usuarios", element: <DashboardUsuarios /> },
                    { path: "/dashboard/pedidos", element: <DashboardPedidos /> },
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