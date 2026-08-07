import { request } from "./api";

async function registerUser(user) {
    return await request("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
}

export { registerUser };
