import { request } from "./api";

const TOKEN_KEY = "token";

async function readProducts() {
    return await request("/productos");
}

async function createProduct(product) {
    const token = localStorage.getItem(TOKEN_KEY);

    return await request("/productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(product),
    });
}

async function updateProduct(productId, product) {
    const token = localStorage.getItem(TOKEN_KEY);

    return await request(`/productos/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(product),
    });
}

async function deleteProduct(productId) {
    const token = localStorage.getItem(TOKEN_KEY);
    return await request(`/productos/${productId}`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

export { readProducts, createProduct, updateProduct, deleteProduct };