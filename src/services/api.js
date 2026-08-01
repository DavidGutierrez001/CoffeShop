const API_BASE_URL = "https://dummyjson.com";

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, options);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Error en la solicitud");
    }

    return data;
}

export { API_BASE_URL, request };
