import logolight from "@/assets/logo-light.svg";
import logodark from "@/assets/logo-dark.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PanelLeft, Package, ShoppingBag, UserRound, Settings, LogOut, Truck, ListCheck, ListSortAscending, Undo2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import { useTheme } from "@/context/ThemeContext";

function AvatarWithBadge() {
  return (
    <Avatar className="size-8">
      <AvatarImage src="https://github.com/shadcn.png" className="rounded-md" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-green-600 dark:bg-green-800" />
    </Avatar>
  );
}


export function AppSidebar() {

  const location = useLocation();

  const { theme } = useTheme();

  const items = [
    {
      section: "Menú",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: <PanelLeft className="size-4" />,
          beta: true,
          disabled: false,
        },
        {
          label: "Usuarios",
          path: "/dashboard/usuarios",
          icon: <UserRound className="size-4" />,
          beta: true,
          disabled: false,
        },
        {
          label: "Pedidos",
          path: "/dashboard/pedidos",
          icon: <ShoppingBag className="size-4" />,
          beta: true,
          disabled: false,
        },
      ],
    },
    {
      section: "Inventario",
      items: [
        {
          label: "Productos",
          path: "/dashboard/inventario/productos",
          icon: <Package className="size-4" />,
          beta: true,
          disabled: false,
        },
        {
          label: "Categorias",
          path: "/dashboard/inventario/categorias",
          icon: <ListSortAscending className="size-4" />,
          beta: true,
          disabled: true,
        },
        {
          label: "Stock",
          path: "/dashboard/inventario/stock",
          icon: <ListCheck className="size-4" />,
          beta: true,
          disabled: true,
        },
      ],
    },
    {
      section: "Logística",
      items: [
        {
          label: "Envíos",
          path: "/dashboard/logistica/envios",
          icon: <Truck className="size-4" />,
          beta: true,
          disabled: true,
        },
        {
          label: "Devoluciones",
          path: "/dashboard/logistica/devoluciones",
          icon: <Undo2 className="size-4" />,
          beta: true,
          disabled: true,
        },
      ],
    },
  ];

  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  }

  return (

    <Sidebar id="sidebar-trigger">
      <SidebarHeader className="flex flex-col items-center justify-center my-7">
        {theme === "light" ? (
          <img src={logodark} className="h-9" alt="Logo" />
        ) : (
          <img src={logolight} className="h-9" alt="Logo" />
        )}
      </SidebarHeader>
      <Separator />
      <SidebarContent className="px-3">
        {items.map((section, index) => (
          <div key={section.section}>
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>{section.section}</SidebarGroupLabel>

              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      size="xs"
                      className={location.pathname === item.path ? "pointer-events-none" : ""}
                    >
                      <Link
                        to={item.path}
                        className={item.disabled ? "pointer-events-none opacity-50" : ""}
                      >
                        {item.icon}
                        <span>{item.label}</span>

                        {item.beta && (
                          <Badge
                            variant="outline"
                            className="ml-auto px-2 font-medium"
                          >
                            Beta
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            {index !== items.length - 1 && <Separator />}
          </div>
        ))}
      </SidebarContent>

      <Separator />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12 gap-3">
                  <AvatarWithBadge />
                  <div className="flex flex-col items-start justify-center">
                    <span>{user ? `${user.firstName} ${user.lastName}` : "Usuario"}</span>
                    <span className="text-xs text-foreground/50 ">
                      {user?.email ?? "Sin sesión"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="end" className="flex flex-col gap-2 p-3">

                <DropdownMenuGroup>
                  <DropdownMenuLabel>Menú</DropdownMenuLabel>
                  <DropdownMenuItem disabled>
                    <Settings />
                    Configuración
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    Cuenta
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                  >
                    <LogOut />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  );
}