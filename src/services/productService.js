import { request } from "./api";

async function getProducts() {
    const data = await request("/products");
    return data.products;
}

async function getProduct(id) {
    return request(`/products/${id}`);
}

export { getProducts, getProduct };
