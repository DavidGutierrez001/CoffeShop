import { Star, MoveLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProduct } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";

function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    className={index < Math.floor(rating) ? "size-5 fill-yellow-500 text-transparent" : "size-5 text-muted-foreground/30"}
                />
            ))}
        </div>
    );
}

export default function DashboardDetalleProducto() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function getProductData() {
            try {
                setLoading(true);

                setError("");

                const data = await getProduct(id);

                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) getProductData();
    }, [id]);

    if (loading)
        return (
            <>
                <div className="grid grid-cols-6 w-full gap-5 min-h-[calc(100svh-135px)]">
                    <section className="col-span-6 md:col-span-3 rounded-lg gap-5 flex flex-col">
                        <Skeleton className="flex-1 w-full" />
                    </section>
                    <section className="col-span-6 md:col-span-3 rounded-lg gap-5 flex flex-col">
                        <Skeleton className="col-span-3 h-full" />
                    </section>

                    <section className="col-span-6 lg:col-span-4 rounded-lg ">
                        <Skeleton className="col-span-3 h-full" />
                    </section>

                    <section className="col-span-6 lg:col-span-2 rounded-md">
                        <Skeleton className="col-span-3 h-full" />
                    </section>
                </div>
            </>
        );


    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>No se encontró el producto</p>;

    const originalPrice =
        product.discountPercentage > 0
            ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
            : null;

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    return (
        <>
            <div className="grid grid-cols-6 w-full gap-5">
                <section className="col-span-6 md:col-span-3 w-full flex justify-center items-center p-5 rounded-lg bg-linear-to-b from-primary/2 to-card outline outline-primary/10">
                    <img src={product.images[0]} alt="" className="h-100 object-cover" />
                </section>
                <section className="col-span-6 md:col-span-3 rounded-lg p-5 gap-5 flex flex-col bg-linear-to-b from-primary/2 to-card outline outline-primary/10">
                    <h2 className="text-2xl">{product.title}</h2>
                    <p className="text-muted-foreground">Marca: {product.brand} · Categoría: {product.category}</p>
                    <p className="text-muted-foreground">{product.description}</p>
                    <div className="flex gap-3 flex-wrap">
                        {product.tags.map((tag, index) => (
                            <Badge variant="secondary" key={index} className="px-4 h-7">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <StarRating rating={product.rating} />
                        <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl">Precio: ${product.price.toFixed(2)} USD</h3>
                        {originalPrice && (
                            <span className="text-muted-foreground line-through">${originalPrice} USD</span>
                        )}
                        {product.discountPercentage > 0 && (
                            <Badge className="bg-green-500 text-green-900">
                                -{product.discountPercentage.toFixed(0)}%
                            </Badge>
                        )}
                    </div>
                    <h3 className={`px-4 py-1 w-fit rounded-full font-semibold text-sm ${product.availabilityStatus === "In Stock" ? "text-green-900 bg-green-500" : "text-red-500"}`}>
                        {product.availabilityStatus === "In Stock" ? "Stock disponible" : "Fuera de stock"}
                    </h3>
                    <h4 className="text-sm text-muted-foreground">Stock disponible: {product.stock} unidades</h4>
                    <h4 className="text-sm text-muted-foreground">SKU: {product.sku}</h4>
                    <div className="flex gap-3 flex-wrap">
                        <Button disabled className="px-5">Editar detalles</Button>
                        <Button disabled className="px-5">Agregar stock</Button>
                    </div>
                </section>

                <section className="col-span-6 lg:col-span-4 p-5 rounded-lg bg-linear-to-b from-primary/2 outline to-card outline-primary/10">
                    <h2 className="mb-5">Reseñas del producto ({product.reviews.length})</h2>
                    {product.reviews.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {product.reviews.map((review, index) => (
                                <article key={index} className="rounded-lg border border-primary/10 bg-card/50 p-4 flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {review.reviewerName.split(" ").map((word) => word[0]).slice(0, 2).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{review.reviewerName}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} />
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Este producto aún no tiene reseñas.</p>
                    )}
                </section>

                <section className="col-span-6 lg:col-span-2 p-5 rounded-md bg-linear-to-b from-primary/2 outline to-card outline-primary/10">
                    <h2>Especificaciones del producto</h2>
                    <ul className="list-disc pl-5 text-foreground">
                        <li>Peso: <span className="text-muted-foreground">{product.weight} g</span></li>
                        <li>Dimensiones: <span className="text-muted-foreground">{product.dimensions['width']} x {product.dimensions['height']} x {product.dimensions['depth']} cm</span></li>
                        <li>Garantía: <span className="text-muted-foreground">{product.warrantyInformation}</span></li>
                        <li>Envío: <span className="text-muted-foreground">{product.shippingInformation}</span></li>
                        <li>Devoluciones: <span className="text-muted-foreground">{product.returnPolicy}</span></li>
                        <li>Pedido mínimo: <span className="text-muted-foreground">{product.minimumOrderQuantity} unidades</span></li>
                        <li>Código de barras: <span className="text-muted-foreground">{product.meta.barcode}</span></li>
                    </ul>
                </section>
            </div>
        </>
    );
}
