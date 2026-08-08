import { request } from "./api";

const TOKEN_KEY = "token";

// Devuelve la lista de productos desde el backend
async function readProducts() {
    return await request("/productos");
}

// Crea un nuevo producto en el backend
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

// Actualiza un producto existente en el backend
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

// Elimina un producto existente en el backend
async function deleteProduct(productId) {
    const token = localStorage.getItem(TOKEN_KEY);
    return await request(`/productos/${productId}`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

// Sube la imagen de un producto al backend
async function uploadProductImage(productId, file) {
    const token = localStorage.getItem(TOKEN_KEY);

    const formData = new FormData();
    formData.append("archivo", file);

    return await request(`/productos/${productId}/imagen`, {
        method: "POST",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });
}

async function deleteProductImage(productId) {
    const token = localStorage.getItem(TOKEN_KEY);

    return await request(`/productos/${productId}/imagen`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

export { readProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage };