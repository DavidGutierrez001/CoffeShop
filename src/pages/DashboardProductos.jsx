import { Plus, MoreVerticalIcon, PackageX, SquarePen, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { createProduct, readProducts, updateProduct, deleteProduct } from "@/services/productService"

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"

const CATEGORIES = [
    { value: "desayuno", label: "Desayuno" },
    { value: "almuerzo", label: "Almuerzo" },
    { value: "bebida", label: "Bebida" },
    { value: "postre", label: "Postre" },
]

const precioFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
})

function formatPrice(value) {
    if (value === null || value === undefined) {
        return "-";
    }

    return precioFormatter.format(value);
}

const productSchema = z.object({
    nombre: z.string()
        .min(1, "El nombre es requerido")
        .max(100, "Máximo 100 caracteres"),
    descripcion: z.string()
        .max(300, "Máximo 300 caracteres")
        .optional(),
    precio: z.coerce
        .number({ invalid_type_error: "El precio es requerido" })
        .positive("El precio debe ser mayor a 0"),
    categoria: z.enum(["desayuno", "almuerzo", "bebida", "postre"], {
        message: "Selecciona una categoría",
    }),
    disponible: z.boolean().default(true),
})

// Componente principal de la página de productos
export default function DashboardProductos() {
    const [openDialog, setOpenDialog] = useState(false);
    const [refresh, setRefresh] = useState(0);

    return (
        <div>
            <div className="flex justify-between">
                <h3 className="mb-5 text-xl font-medium">Productos</h3>

                <Button
                    onClick={() => setOpenDialog(true)}
                    className="h-9"
                    size="sm"
                >
                    <Plus />
                    Crear producto
                </Button>
            </div>

            <ReadProduct refresh={refresh} />
            <DialogCreateProduct
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                onCreated={() => setRefresh((value) => value + 1)}
            />
        </div>
    );
}

// Componente para crear un nuevo producto
function DialogCreateProduct({ openDialog, setOpenDialog, onCreated }) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            nombre: "",
            descripcion: "",
            precio: "",
            categoria: "",
            disponible: true,
        },
    })

    const onSubmit = async (values) => {
        try {
            await createProduct(values)
            toast.success("Producto creado correctamente")
            reset()
            onCreated()
            setOpenDialog(false)
        } catch (error) {
            toast.error(error.message || "No se pudo crear el producto")
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Crear producto</DialogTitle>
                    <DialogDescription>
                        Completa los datos del nuevo producto.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <ProductFormFields register={register} control={control} errors={errors} />

                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Spinner />}
                            Crear producto
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Componente para editar / eliminar un producto existente
function ProductFormFields({ register, control, errors }) {
    return (
        <>
            <Field>
                <FieldLabel>Nombre</FieldLabel>
                <FieldContent>
                    <Input
                        {...register("nombre")}
                        placeholder="Ej. Café con leche"
                        aria-invalid={!!errors.nombre}
                    />
                    <FieldError>{errors.nombre?.message}</FieldError>
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Descripción</FieldLabel>
                <FieldContent>
                    <Textarea
                        {...register("descripcion")}
                        placeholder="Descripción del producto (opcional)"
                        aria-invalid={!!errors.descripcion}
                    />
                    <FieldError>{errors.descripcion?.message}</FieldError>
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Precio</FieldLabel>
                <FieldContent>
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register("precio")}
                        placeholder="0.00"
                        aria-invalid={!!errors.precio}
                    />
                    <FieldError>{errors.precio?.message}</FieldError>
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Categoría</FieldLabel>
                <FieldContent>
                    <Controller
                        control={control}
                        name="categoria"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    aria-invalid={!!errors.categoria}
                                    className="h-11! w-full min-w-0"
                                >
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FieldError>{errors.categoria?.message}</FieldError>
                </FieldContent>
            </Field>
            <Controller
                control={control}
                name="disponible"
                render={({ field }) => (
                    <Label className="flex w-fit cursor-pointer items-center gap-2 text-sm">

                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        Disponibilidad
                    </Label>
                )}
            />
        </>
    )
}

// Componente para editar / eliminar un producto existente
function DialogEditProduct({ product, setProduct, onUpdated }) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(productSchema),
    })

    useEffect(() => {
        if (product) {
            reset({
                nombre: product.nombre ?? "",
                descripcion: product.descripcion ?? "",
                precio: product.precio ?? "",
                categoria: product.categoria ?? "",
                disponible: product.disponible ?? true,
            })
        }
    }, [product, reset])

    const onSubmit = async (values) => {
        try {
            await updateProduct(product._id, values)
            toast.success("Producto actualizado correctamente")
            onUpdated(values)
            setProduct(null)
        } catch (error) {
            toast.error(error.message || "No se pudo actualizar el producto")
        }
    }

    return (
        <Dialog open={!!product} onOpenChange={(open) => { if (!open) setProduct(null); }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar producto</DialogTitle>
                    <DialogDescription>
                        Actualiza los datos del producto.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <ProductFormFields register={register} control={control} errors={errors} />

                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Spinner />}
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// Componente para leer y mostrar los productos
function ReadProduct({ refresh }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [productToDelete, setProductToDelete] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await readProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("No se pudieron cargar los productos");
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [refresh]);

    const handleUpdated = (values) => {
        setProducts((prev) =>
            prev.map((p) =>
                p._id === productToEdit._id ? { ...p, ...values } : p
            )
        );
    };

    const confirmDelete = async () => {
        if (!productToDelete) {
            return;
        }

        setDeleting(true);
        try {
            await deleteProduct(productToDelete._id);
            toast.success("Producto eliminado correctamente");
            setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
            setProductToDelete(null);
        } catch (error) {
            toast.error(error.message || "No se pudo eliminar el producto");
        } finally {
            setDeleting(false);
        }
    };

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

    if (error) {
        return <Empty>
            <EmptyContent>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PackageX />
                    </EmptyMedia>
                    <EmptyTitle>No se pudieron cargar los productos</EmptyTitle>
                    <EmptyDescription>{error}</EmptyDescription>
                </EmptyHeader>
            </EmptyContent>
        </Empty>;
    }

    return (
        <>
            <Table>
                <TableCaption>Listado de productos de la cafetería</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripcion</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product._id}>
                            <TableCell>{product.nombre}</TableCell>
                            <TableCell>{product.descripcion}</TableCell>
                            <TableCell>{formatPrice(product.precio)}</TableCell>
                            <TableCell className="capitalize">{product.categoria}</TableCell>
                            <TableCell className="text-center">
                                {product.disponible ?
                                    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                                        Disponible
                                    </Badge> :
                                    <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                                        Agotado
                                    </Badge>
                                }
                            </TableCell>
                            <TableCell className="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVerticalIcon className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => setProductToEdit(product)}>
                                                <SquarePen />
                                                Modificar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setProductToDelete(product)}>
                                                <Trash />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={!!productToDelete} onOpenChange={(open) => { if (!open) setProductToDelete(null); }}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogDescription>
                            Estás a punto de eliminar <strong>"{productToDelete?.nombre}"</strong>. Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                            {deleting && <Spinner />}
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DialogEditProduct
                product={productToEdit}
                setProduct={setProductToEdit}
                onUpdated={handleUpdated}
            />
        </>
    )
}