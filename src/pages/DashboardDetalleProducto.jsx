import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardDetalleProducto() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function getProduct() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`https://dummyjson.com/products/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Error al obtener el producto");
                }

                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) getProduct();
    }, [id]);

    if (loading) return <p>Cargando producto...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>No se encontró el producto</p>;

    return (
        <>
            <div className="grid grid-cols-6 w-full gap-5">
                <section className="col-span-3 w-full flex justify-center items-center p-5 rounded-lg bg-black bg-linear-to-b from-primary/5 to-card outline outline-primary/10">
                    <img src={product.images[0]} alt="" className="h-100 object-cover" />
                </section>
                <section className="col-span-3 rounded-lg p-5 gap-5 flex flex-col bg-black bg-linear-to-b from-primary/5 to-card outline outline-primary/10">
                    <h2 className="text-2xl font-bold">{product.title}</h2>
                    <p className="text-muted-foreground">{product.description}</p>
                    <div className="flex gap-3">
                        {product.tags.map((tag, index) => (
                            <Badge variant="secondary" key={index} className="px-4 h-7">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h3 className="text-2xl font-bold">Precio: ${product.price} USD</h3>
                    <h3 className={`text-md px-4 py-1 w-fit rounded-full font-semibold ${product.availabilityStatus === "In Stock" ? "text-green-900 bg-green-500" : "text-red-500"}`}>
                        {product.availabilityStatus === "In Stock" ? "En stock" : "Fuera de stock"}
                    </h3>
                    <h4>SKU: {product.sku}</h4>
                    <div className="flex gap-3">
                        <Button disabled className="px-5">Editar detalles</Button>
                        <Button disabled className="px-5">Agregar stock</Button>
                    </div>
                </section>

                <section className="col-span-4 p-5 rounded-md bg-black bg-linear-to-b from-primary/5 to-card outline outline-primary/10">
                    <h2>Descripción del producto</h2>
                    <p>{product.description}</p>
                </section>
                <section className="col-span-2 p-5 rounded-md bg-black bg-linear-to-b from-primary/5 to-card outline outline-primary/10">
                    <h2>Especificacines del producto</h2>
                    <ul className="list-disc pl-5">
                        <li>Peso: {product.weight} g</li>
                        <li>Dimensiones: {product.dimensions['width']} x {product.dimensions['height']} x {product.dimensions['depth']} cm</li>
                    </ul>
                </section>

                <section className="col-span-6 p-5 bg-black bg-linear-to-b from-primary/5 to-card outline outline-primary/10">5</section>
            </div>
        </>
    );
}