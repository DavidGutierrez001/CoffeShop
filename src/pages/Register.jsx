import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { BorderBeam } from "@/components/ui/border-beam";
import { useNavigate, Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner"
import { registerUser } from "@/services/authService";

// Esquema de validación para el formulario de registro
const formSchema = z.object({
    nombre: z
        .string()
        .min(1, "Por favor ingresa tu nombre.")
        .max(100, "El nombre no puede superar los 100 carácteres."),

    email: z
        .string()
        .min(1, "Por favor ingresa el correo electrónico.")
        .email("Ingresa un correo electrónico válido."),

    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 carácteres."),

    confirmPassword: z
        .string()
        .min(6, "Repite la contraseña."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});

// Componente de registro
function Register() {
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    // Funcion asincrona para manejar el envio del formulario
    async function onSubmit(values) {
        const { confirmPassword, ...data } = values;

        try {
            await registerUser(data);
            navigate("/login");
        }
        catch (error) {
            form.setError("root.serverError", {
                type: "manual",
                message: error.message || "No se pudo crear la cuenta. Por favor, inténtalo de nuevo.",
            });
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center pt-20 gap-10">
            <section className="flex w-full max-w-95 p-5 flex-col space-y-6">
                <form
                    className="flex flex-col gap-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <h2 className="text-4xl md:text-3xl font-bold md:font-semibold">Crear cuenta</h2>
                    <Controller
                        name="nombre"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nombre completo</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="text"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="name"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Correo electrónico</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="email"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Confirmar contraseña</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    {form.formState.errors.root?.serverError && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.root.serverError.message}
                        </p>
                    )}

                    <Button
                        className="group relative h-14 overflow-hidden px-1"
                        type="submit"
                        variant="secondary"
                    >
                        {isSubmitting ? <Spinner /> : "Regístrarse"}
                        <BorderBeam
                            size={70}
                            duration={2}
                            className="from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                        />
                    </Button>
                </form>
            </section>
            <section className="flex flex-col gap-3 w-full max-w-84">
                <Separator />
                <p className="text-sm text-muted-foreground flex flex-col justify-center items-center">
                    ¿Ya tienes una cuenta?
                    <Link
                        to="/login"
                        className="text-primary hover:underline underline-offset-4 hover:text-primary/80 transition-colors"
                    >
                        Inicia sesión
                    </Link>
                </p>
                <Separator />
            </section>
        </div>
    );
}

export default Register;
