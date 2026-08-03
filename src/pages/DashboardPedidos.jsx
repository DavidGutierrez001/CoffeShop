import { useState } from "react"
import { CircleCheck, MoreVerticalIcon, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const STORAGE_KEY = "user_pedidos";

const ORDER_STATUSES = ["Pendiente", "Enviado", "Entregado", "Cancelado"];

const STATUS_STYLES = {
    Pendiente: "bg-orange-100 text-orange-500 dark:bg-orange-500/20 dark:text-orange-300",
    Enviado: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    Entregado: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
    Cancelado: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

const SEED_ORDERS = [
    {
        id: 1,
        title: "Essence Mascara Lash Princess",
        userName: "Leanne Graham",
        price: 9.99,
        quantity: 2,
        status: "Entregado",
        createdAt: "2026-07-01T10:00:00.000Z",
    },
    {
        id: 2,
        title: "iPhone 9",
        userName: "Ervin Howell",
        price: 549,
        quantity: 1,
        status: "Enviado",
        createdAt: "2026-07-05T14:30:00.000Z",
    },
    {
        id: 3,
        title: "Samsung Universe 9",
        userName: "Clementine Bauch",
        price: 1249,
        quantity: 1,
        status: "Pendiente",
        createdAt: "2026-07-12T09:15:00.000Z",
    },
];

function loadOrders() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ORDERS));
        return SEED_ORDERS;
    }
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Componente principal de la página de pedidos
export default function DashboardPedidos() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orders, setOrders] = useState(loadOrders);

    function saveOrders(nextOrders) {
        setOrders(nextOrders);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
    }

    return (
        <>
            <div className="flex justify-between mb-5">
                <h3 className="text-xl font-medium">Pedidos del cliente</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger>
                        <Button>
                            <Plus />
                            Crear Pedido
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <OrderForm
                            orders={orders}
                            onClose={() => setIsDialogOpen(false)}
                            onOrderCreated={(order) => saveOrders([order, ...orders])}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <OrdersTable orders={orders} onChange={saveOrders} />
        </>
    )
}

// Componente para el formulario de creación de pedidos
function OrderForm({ orders, onClose, onOrderCreated }) {
    const [formData, setFormData] = useState({
        title: "",
        userName: "",
        quantity: "",
        price: "",
    });

    function giveData(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        const { title, userName, quantity, price } = formData;

        if (!title.trim() || !userName.trim() || !quantity || !price) {
            alert("Todos los campos son obligatorios");
            return;
        }

        // Agarra el siguiente ID disponible basado en el último pedido y le suma 1, si no hay pedidos, empieza desde 1
        const nextId = orders.length > 0 ? Math.max(...orders.map((order) => Number(order.id) || 0)) + 1 : 1;

        const newOrder = {
            id: nextId,
            title: title.trim(),
            userName: userName.trim(),
            price: Number(price),
            quantity: Number(quantity),
            status: "Pendiente",
            createdAt: new Date().toISOString(),
        };

        toast("Pedido agregado correctamente", {
            icon: <CircleCheck className="size-5 text-green-500" />,
            description: "Pedido #" + newOrder.id + " guardado correctamente",
            position: "top-center",
        });

        setFormData({ title: "", userName: "", quantity: "", price: "" });
        onOrderCreated?.(newOrder);
        onClose();
    }

    return (
        <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldTitle className="text-xl">Crear nuevo pedido</FieldTitle>
                <FieldDescription>Comienza agregando los detalles del nuevo pedido.</FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="title">Nombre del producto</FieldLabel>
                        <Input required id="title" autoComplete="off" name="title" value={formData.title} onChange={giveData} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="userName">Cliente</FieldLabel>
                        <Input required id="userName" autoComplete="off" name="userName" value={formData.userName} onChange={giveData} />
                    </Field>
                    <FieldGroup className="flex flex-row">
                        <Field>
                            <FieldLabel htmlFor="quantity">Cantidad</FieldLabel>
                            <Input required id="quantity" autoComplete="off" name="quantity" value={formData.quantity} onChange={giveData} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="price">Precio</FieldLabel>
                            <Input required id="price" autoComplete="off" name="price" value={formData.price} onChange={giveData} />
                        </Field>
                    </FieldGroup>
                </FieldGroup>
            </FieldSet>
            <Button className="h-12" type="submit">
                Agregar pedido
            </Button>
        </form>
    )
}

// Tabla de pedidos almacenados en localStorage
function OrdersTable({ orders, onChange }) {
    function DeleteOrder(orderId) {
        onChange(orders.filter((order) => order.id !== orderId));
        toast("Pedido eliminado correctamente", {
            icon: <CircleCheck className="size-5 text-green-500" />,
            description: "Pedido #" + orderId + " eliminado",
            position: "top-center",
        });
    }

    function ChangeStatus(orderId, status) {
        onChange(orders.map((order) => (
            order.id === orderId ? { ...order, status } : order
        )));
        toast("Estado actualizado", {
            icon: <CircleCheck className="size-5 text-green-500" />,
            description: "Pedido #" + orderId + " ha sido actualizado a " + status,
            position: "top-center",
        });
    }

    return (
        <Table>
            <TableCaption>Lista de pedidos</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Pedido #</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead>Acción</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="text-center">{order.id}</TableCell>
                        <TableCell>{order.title}</TableCell>
                        <TableCell>{order.userName}</TableCell>
                        <TableCell>${Number(order.price).toFixed()}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${(Number(order.price) * Number(order.quantity)).toFixed()}</TableCell>
                        <TableCell className="text-center">
                            <Badge className={STATUS_STYLES[order.status] ?? STATUS_STYLES.Pendiente}>
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                        <MoreVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-50" align="end">
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Cambiar estado</DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup
                                                value={order.status}
                                                onValueChange={(value) => ChangeStatus(order.id, value)}
                                            >
                                                {ORDER_STATUSES.map((option) => (
                                                    <DropdownMenuRadioItem key={option} value={option}>
                                                        {option}
                                                    </DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        disabled
                                    >
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onSelect={(e) => e.preventDefault()}
                                            >
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>¿Estás seguro?</DialogTitle>
                                                <DialogDescription>
                                                    Esta acción no se puede deshacer. Se eliminará el registro permanentemente.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancelar</Button>
                                                </DialogClose>

                                                <Button
                                                    onClick={() => DeleteOrder(order.id)}
                                                    variant="destructive"
                                                >
                                                    Eliminar
                                                </Button>

                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
