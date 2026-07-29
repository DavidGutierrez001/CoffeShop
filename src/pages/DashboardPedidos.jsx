import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react"
import { CircleCheck, MoreVerticalIcon, Plus } from "lucide-react"
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"

import { Spinner } from "@/components/ui/spinner"

import { Button } from "@/components/ui/button"

// Componente principal de la página de pedidos
export default function DashboardPedidos() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

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
                            onClose={() => setIsDialogOpen(false)}
                            onOrderCreated={() => setRefreshKey((k) => k + 1)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <GetOrders key={refreshKey} />
        </>
    )
}

const STORAGE_KEY = 'user_pedidos';

// Componente para el formulario de creación de pedidos
function OrderForm({ onClose, onOrderCreated }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        productId: "",
        userId: "",
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

    async function handleSubmit(e) {
        e.preventDefault();

        const { productId, userId, quantity, price } = formData;

        if (!productId || !userId || !quantity || !price) {
            alert("Todos los campos son obligatorios");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch('https://dummyjson.com/carts/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: Number(userId),
                    products: [{ id: Number(productId), quantity: Number(quantity) }],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error al agregar pedido');
            }

            const newOrder = {
                ...data,
                localPrice: Number(price),
                localUserId: Number(userId),
                localProductId: Number(productId),
                createdAt: new Date().toISOString(),
            };

            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            stored.unshift(newOrder);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

            toast("Pedido agregado correctamente", {
                icon: <CircleCheck className="size-5 text-green-500" />,
                description: "Pedido #" + data.id + " guardado",
                position: "top-center",
            });

            setFormData({ productId: "", userId: "", quantity: "", price: "" });
            onOrderCreated?.();
            onClose();
        } catch (error) {
            alert(`Error al agregar pedido: ${error.message}`);
        }

        setLoading(false);
    }

    return (
        <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldTitle className="text-xl">Crear nuevo pedido</FieldTitle>
                <FieldDescription>Comienza agregando los detalles del nuevo pedido.</FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="userId">ID Usuario</FieldLabel>
                        <Input required id="userId" autoComplete="off" name="userId" value={formData.userId} onChange={giveData} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="productId">ID Producto</FieldLabel>
                        <Input required id="productId" autoComplete="off" name="productId" value={formData.productId} onChange={giveData} />
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
                {loading ? <Spinner /> : 'Agregar pedido'}
            </Button>
        </form>
    )
}


// Obtener los pedidos desde la API y mostrarlos como tabla
function GetOrders() {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);

    function DeleteOrder(cartId) {
        localStorage.removeItem(STORAGE_KEY);

        const updatedOrders = orders.filter(
            (order) => order.id !== cartId
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        toast("Pedido eliminado correctamente", {
            icon: <CircleCheck className="size-5 text-green-500" />,
            description: "Pedido #" + cartId + " eliminado",
            position: "top-center",
        });
    }

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);

                const [cartsRes, usersRes] = await Promise.all([
                    fetch('https://dummyjson.com/carts?limit=10'),
                    fetch('https://dummyjson.com/users?limit=0'),
                ]);

                const cartsData = await cartsRes.json();
                const usersData = await usersRes.json();

                const usersMap = {};
                usersData.users.forEach((user) => {
                    usersMap[user.id] = user;
                });

                const localOrders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

                const allOrders = [...localOrders, ...cartsData.carts];

                setOrders(allOrders);
                setUsers(usersMap);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-10 w-full bg-accent" />
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-7 w-full rounded-md bg-accent/60" />
                ))}
            </div>
        );
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
                    <TableHead>Acción</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((cart) => {
                    const userId = cart.localUserId ?? cart.userId;
                    const user = users[userId];
                    const userName = user ? `${user.firstName} ${user.lastName}` : `Usuario #${userId}`;
                    const title = cart.products?.[0]?.title ?? `Producto #${cart.localProductId}`;
                    const price = cart.localPrice ?? cart.products?.[0]?.price ?? 0;
                    const quantity = cart.products?.[0]?.quantity ?? 0;
                    const total = price * quantity;

                    return (
                        <TableRow key={cart.id + (cart.createdAt ?? '')}>
                            <TableCell className="text-center">{cart.id}</TableCell>
                            <TableCell>{title}</TableCell>
                            <TableCell>{userName}</TableCell>
                            <TableCell>${Number(price).toFixed()}</TableCell>
                            <TableCell>{quantity}</TableCell>
                            <TableCell>${total.toFixed()}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            <MoreVerticalIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem disabled>
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => DeleteOrder(cart.id)}
                                            className="text-destructive">

                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}