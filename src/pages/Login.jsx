import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { BorderBeam } from "@/components/ui/border-beam";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext";

// Esquema de validación para el formulario de inicio de sesión
const formSchema = z.object({
    username: z
        .string()
        .min(1, "Por favor ingresa el usuario."),

    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 carácteres.")
});

// Componente de inicio de sesión
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    // Funcion asincrona para manejar el envio del formulario
    async function onSubmit(values) {
        try {
            await login(values.username, values.password);
            navigate("/dashboard");
        }
        catch (error) {
            form.setError("root.serverError", {
                type: "manual",
                message: "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.",
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
                    <h2 className="text-4xl md:text-3xl font-bold md:font-semibold">Iniciar sesión</h2>
                    <Controller
                        name="username"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Usuario</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="text"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="username"
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
                                    autoComplete="current-password"
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
                    <p className="text-xs text-muted-foreground">
                        Demo: usuario <span className="font-medium">emilys</span>, contraseña <span className="font-medium">emilyspass</span>
                    </p>
                    <Button
                        className="group relative h-14 overflow-hidden px-1"
                        type="submit"
                        variant="secondary"
                    >
                        {isSubmitting ? <Spinner /> : "Iniciar sesión"}
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
                    ¿No tienes una cuenta?
                    <a
                        className="text-primary cursor-not-allowed hover:underline underline-offset-4 hover:text-primary/80 transition-colors"
                        disabled
                    >
                        Regístrarse
                    </a>
                </p>
                <Separator />
            </section>
        </div>
    );
}

export default Login;