import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardUsuarios() {
    return (
        <>
            <ActionsUsers />
            <GetUsers />
        </>
    );
}

function ActionsUsers() {
    return (
        <div className="mb-5 flex w-full justify-between">
            <h3 className="text-xl font-medium">Usuarios registrados</h3>
            <FormDialog />
        </div>
    );
}

function FormDialog() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        edad: "",
    });

    function handleChange(e) {
        const { name, value } = e.target; // obtiene el nombre y valor del campo que se está editando
        setFormData((prev) => ({
            ...prev, // mantiene los valores anteriores de formData
            [name]: value, // cambia el valor del campo correspondiente en formData
        }));
    }

    async function getFormData(e) {
        e.preventDefault();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button">Crear Usuario</Button>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={getFormData}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Crear Usuario</DialogTitle>
                        <DialogDescription>
                            Complete los siguientes campos para crear un nuevo usuario.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="my-7">
                        <Field>
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
                        </Field>

                        <Field>
                            <Label htmlFor="apellido">Apellido</Label>
                            <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
                        </Field>

                        <Field>
                            <Label htmlFor="correo">Correo</Label>
                            <Input id="correo" name="correo" type="email" value={formData.correo} onChange={handleChange} />
                        </Field>

                        <Field>
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
                        </Field>

                        <Field>
                            <Label htmlFor="edad">Edad</Label>
                            <Input id="edad" name="edad" type="number" value={formData.edad} onChange={handleChange} />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled >Agregar usuario</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function GetUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://dummyjson.com/users?limit=20");
                const data = await res.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-10 w-full bg-accent" />
                {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="h-7 w-full rounded-md bg-accent/60" />
                ))}
            </div>
        );
    }

    return (
        <Table>
            <TableCaption>Listado de usuarios</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo electrónico</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        
                        <TableCell className="text-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <MoreVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive">
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}