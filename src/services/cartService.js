import { request } from "./api";

async function getCarts(limit = 10) {
    const data = await request(`/carts?limit=${limit}`);
    return data.carts;
}

async function addCart({ userId, products }) {
    return request("/carts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, products }),
    });
}

export { getCarts, addCart };
