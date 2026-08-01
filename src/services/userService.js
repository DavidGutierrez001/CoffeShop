import { request } from "./api";

async function getUsers(limit = 20) {
    const data = await request(`/users?limit=${limit}`);
    return data.users;
}

export { getUsers };
