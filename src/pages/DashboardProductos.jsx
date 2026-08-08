import { Plus, MoreVerticalIcon, PackageX, SquarePen, Trash, SlidersHorizontal, Upload, X, Image as ImageIcon } from "lucide-react"
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

import { createProduct, readProducts, updateProduct, deleteProduct, uploadProductImage, deleteProductImage } from "@/services/productService"
import { API_BASE_URL } from "@/services/api"

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
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
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

// Construir la URL completa de la imagen del producto
function buildImageUrl(imageUrl) {
    return API_BASE_URL + imageUrl;
}

function ProductImage({ product }) {
    const [failed, setFailed] = useState(false);

    if (!product.imagen_url || failed) {
        return (
            <Button asChild className="p-0 border-2 border-transparent hover:border-primary/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                </div>
            </Button>
        );
    }

    return (
        <>
            <Dialog >
                <DialogTrigger>
                    <Button asChild className="p-0 border-2 border-transparent hover:border-primary/90">
                        <img
                            src={buildImageUrl(product.imagen_url)}
                            alt={product.nombre}
                            onError={() => setFailed(true)}
                            className="h-12 w-12 rounded-md object-cover"
                        />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl">{product.nombre}</DialogTitle>
                        <DialogDescription>
                            {product.descripcion}
                        </DialogDescription>
                    </DialogHeader>
                    <img
                        src={buildImageUrl(product.imagen_url)}
                        alt={product.nombre}
                        onError={() => setFailed(true)}
                        className="w-full max-w-100 rounded-md object-cover"
                    />
                </DialogContent>
            </Dialog>
        </>
    );
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
    const [filterCategoria, setFilterCategoria] = useState("");

    return (
        <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-medium">Productos</h3>

                <div className="flex flex-wrap items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <SlidersHorizontal />
                                Filtrar
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Categorías</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                checked={filterCategoria === ""}
                                onCheckedChange={() => setFilterCategoria("")}
                            >
                                Todas
                            </DropdownMenuCheckboxItem>
                            {CATEGORIES.map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category.value}
                                    checked={filterCategoria === category.value}
                                    onCheckedChange={() => setFilterCategoria(category.value)}
                                >
                                    {category.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        onClick={() => setOpenDialog(true)}
                        className="h-9"
                        size="sm"
                    >
                        <Plus />
                        Crear producto
                    </Button>
                </div>
            </div>

            <ReadProduct
                refresh={refresh}
                filterCategoria={filterCategoria}
            />
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

    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState("");

    useEffect(() => {
        if (!imagenPreview) {
            return;
        }

        const url = imagenPreview;
        return () => URL.revokeObjectURL(url);
    }, [imagenPreview]);

    // Función para manejar el cambio de imagen
    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setImagen(file);
        setImagenPreview(URL.createObjectURL(file));
    };

    // Función para limpiar la imagen seleccionada
    const clearImage = () => {
        setImagen(null);
        setImagenPreview("");
    };

    // Función para manejar el cambio de estado del diálogo
    const handleOpenChange = (open) => {
        setOpenDialog(open);
        if (!open) {
            clearImage();
            reset();
        }
    };

    const onSubmit = async (values) => {
        try {
            const created = await createProduct(values);
            const productId = created?._id ?? created?.id;

            if (imagen && productId) {
                await uploadProductImage(productId, imagen);
            }

            toast.success("Producto creado correctamente");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error al crear el producto");
        }

        clearImage()
        reset()
        onCreated()
        setOpenDialog(false)
    }

    return (
        <Dialog open={openDialog} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Crear producto</DialogTitle>
                    <DialogDescription>
                        Completa los datos del nuevo producto.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Field>
                        <FieldLabel>Imagen</FieldLabel>
                        <FieldContent>
                            {imagenPreview && (
                                <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                                    <img
                                        src={imagenPreview}
                                        alt="Vista previa del producto"
                                        className="h-full w-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={clearImage}
                                        className={'absolute top-1 right-1 bg-background/80 hover:bg-background'}
                                        aria-label="Quitar imagen"
                                    >
                                        <X />
                                    </Button>
                                </div>
                            )}
                            <Label
                                htmlFor="producto-imagen"
                                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-muted"
                            >
                                <Upload />
                                {imagen ? "Cambiar imagen" : "Subir imagen"}
                            </Label>
                            <Input
                                id="producto-imagen"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </FieldContent>
                    </Field>

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

// Componente para editar un producto existente
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

    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(() =>
        product?.imagen_url ? buildImageUrl(product.imagen_url) : ""
    );
    const [eliminarImagen, setEliminarImagen] = useState(false);
    const [prevProduct, setPrevProduct] = useState(product);

    if (product !== prevProduct) {
        setPrevProduct(product);
        setImagen(null);
        setEliminarImagen(false);
        setImagenPreview(product?.imagen_url ? buildImageUrl(product.imagen_url) : "");
    }

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

    useEffect(() => {
        if (!imagenPreview) {
            return;
        }

        const url = imagenPreview;
        return () => URL.revokeObjectURL(url);
    }, [imagenPreview]);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setImagen(file);
        setEliminarImagen(false);
        setImagenPreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImagen(null);
        setEliminarImagen(true);
        setImagenPreview("");
    };

    const onSubmit = async (values) => {
        try {
            await updateProduct(product._id, values);

            if (eliminarImagen) {
                await deleteProductImage(product._id);
            } else if (imagen) {
                await uploadProductImage(product._id, imagen);
            }

            toast.success("Producto actualizado correctamente")
            onUpdated(values)
            setProduct(null)
        } catch (error) {
            toast.error(error.message || "No se pudo actualizar el producto")
        }
    }

    return (
        <Dialog open={!!product} onOpenChange={(open) => { if (!open) setProduct(null); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar producto</DialogTitle>
                    <DialogDescription>
                        Actualiza los datos del producto.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Field>
                        <FieldLabel>Imagen</FieldLabel>
                        <FieldContent>
                            {imagenPreview && (
                                <div className="relative flex justify-center w-full items-center h-32 overflow-hidden rounded-md border">
                                    <img
                                        src={imagenPreview}
                                        alt="Vista previa del producto"
                                        className={'h-full w-full object-cover'}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={clearImage}
                                        className={'absolute top-1 right-1 bg-background/80 hover:bg-background'}
                                        aria-label="Quitar imagen"
                                    >
                                        <X />
                                    </Button>
                                </div>
                            )}
                            <Label
                                htmlFor="producto-imagen-editar"
                                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-muted"
                            >
                                <Upload />
                                {imagen ? "Cambiar imagen" : "Subir imagen"}
                            </Label>
                            <Input
                                id="producto-imagen-editar"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </FieldContent>
                    </Field>

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
function ReadProduct({ refresh, filterCategoria }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [productToDelete, setProductToDelete] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [localRefresh, setLocalRefresh] = useState(0);

    const filteredProducts = filterCategoria
        ? products.filter((product) => product.categoria === filterCategoria)
        : products;

    // Obtener los productos desde el servicio
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
    }, [refresh, localRefresh]);

    // Función para actualizar un producto en la lista después de editarlo
    const handleUpdated = (values) => {
        setProducts((prev) =>
            prev.map((p) =>
                p._id === productToEdit._id ? { ...p, ...values } : p
            )
        );
        setLocalRefresh((value) => value + 1);
    };

    // Función para confirmar la eliminación de un producto
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
                        <TableHead>Imagen</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredProducts.length ? (
                        filteredProducts.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <ProductImage product={product} />
                                </TableCell>
                                <TableCell>{product.nombre}</TableCell>
                                <TableCell>
                                    <span className="block max-w-xs truncate">
                                        {product.descripcion || "Sin descripción"}
                                    </span>
                                </TableCell>
                                <TableCell>{formatPrice(product.precio)}</TableCell>
                                <TableCell className="capitalize">{product.categoria}</TableCell>
                                <TableCell className="text-center">
                                    {product.disponible ? (
                                        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                                            Disponible
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                                            Agotado
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menú</span>
                                                <MoreVerticalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem
                                                    onClick={() => setProductToEdit(product)}
                                                >
                                                    <SquarePen />
                                                    Modificar
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => setProductToDelete(product)}
                                                >
                                                    <Trash />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="h-24 text-center"
                            >
                                No hay productos registrados.
                            </TableCell>
                        </TableRow>
                    )}
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