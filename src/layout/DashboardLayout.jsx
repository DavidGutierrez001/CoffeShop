import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react"

import DashboardNotifications from "@/data/DashboardNotifications.json";

import { Button } from "@/components/ui/button"

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle";

import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function DashboardLayout() {
    return (
        <ThemeProvider>
            <SidebarProvider
                style={{
                    "--sidebar-width": "18rem",
                    "--sidebar-width-mobile": "20rem",
                }}
            >
                <AppSidebar />

                <SidebarInset>
                    <DashboardHeader />

                    <Separator />

                    <main className="p-5 lg:p-7 h-full min-h-[calc(100svh-77px)]">
                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}

function DashboardHeader() {
    return (
        <header className="flex items-center px-7 py-5 gap-5 justify-between">
            <div className="flex gap-3 items-center">
                <SidebarTrigger />
                <BreadCrumb />
            </div>
            <div className="flex gap-3">
                <NotificationsPopover />
                <ModeToggle />
            </div>
        </header>
    );
}

function NotificationsPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Abrir notificaciones">
                    <Bell />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-h-50 w-full max-w-100" align="end">
                <div className="flex justify-between items-center">
                    <h2 className="font-medium text-lg">Notificaciones</h2>
                    <span className="flex rounded justify-center items-center text-md border w-8 h-8">{DashboardNotifications.length}</span>
                </div>
                <Separator />
                {DashboardNotifications.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {DashboardNotifications.map((notification) => (
                            <div key={notification.id} className="flex flex-col gap-1">
                                <PopoverHeader className="font-medium">{notification.title}</PopoverHeader>
                                <PopoverDescription className="text-sm text-muted-foreground">
                                    {notification.description}
                                </PopoverDescription>
                            </div>
                        ))}
                        <Separator />
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Aún no hay notificaciones.
                    </p>
                )}
            </PopoverContent>
        </Popover>
    );
}


function BreadCrumb() {

    const location = useLocation();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/" />}>Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/Dashboard" />}>
                        Dashboard
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}