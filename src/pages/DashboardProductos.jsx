import { Plus, MoreVerticalIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { getProducts } from "@/services/productService"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

export default function DashboardProductos() {
    return (
        <>
            <div>
                <div className="flex justify-between">
                    <h3 className="mb-5 text-xl font-medium">Productos registrados</h3>
                    <Button disabled>
                        <Plus />
                        Registrar producto
                    </Button>
                </div>
                <GetProducts />
            </div>
        </>
    );
}

function GetProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                setProducts(await getProducts());
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-10 w-full bg-accent" />
                {Array.from({ length: 15 }).map((_, index) => (
                    <Skeleton key={index} className="h-7 w-full rounded-md bg-accent/60" />
                ))}
            </div>
        );
    }

    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-25">ID</TableHead>
                    <TableHead className="w-25">Producto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell className="font-medium max-w-80 hover:underline">
                            <Link to={`/dashboard/inventario/productos/detalle/${product.id}`}>
                                {product.title}
                            </Link>
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell className="text-center">
                            {product.availabilityStatus === "In Stock" ? (
                                <Badge className="bg-blue-50 text-green-700 dark:bg-green-950/50 dark:text-green-300">
                                    {product.availabilityStatus}
                                </Badge>
                            )
                                :

                                (<Badge className="bg-orange-100 text-orange-500 dark:bg-orange-500/20 dark:text-orange-300">
                                    {product.availabilityStatus}
                                </Badge>)
                            }
                        </TableCell>
                        <TableCell>${product.price.toFixed()}</TableCell>
                        <TableCell>{product.stock}</TableCell>

                        <TableCell className="text-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <MoreVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link to={`/dashboard/inventario/productos/detalle/${product.id}`}>Ver más</Link>
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

                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Button disabled variant="destructive">Eliminar</Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Esta función está deshabilitada porque no se permite la eliminación de sus datos.</p>
                                                    </TooltipContent>
                                                </Tooltip>

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
    )
}