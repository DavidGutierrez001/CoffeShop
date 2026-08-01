import { createContext, useContext, useState } from "react"
import { request } from "@/services/api"

const STORAGE_TOKEN_KEY = "token";
const STORAGE_USER_KEY = "user";

// Solo se permite iniciar sesión con el primer usuario de dummyjson (id 1)
const DEFAULT_USER_ID = 1;

const AuthContext = createContext(undefined)

// Proveedor de contexto de autenticación
export function AuthProvider({
    children,
}) {
    const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY))
    const [user, setUser] = useState(
        () => {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || "null")
            } catch {
                return null
            }
        }
    )

    async function login(username, password) {
        const data = await request("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, expiresInMins: 60 }),
        })

        if (data.id !== DEFAULT_USER_ID) {
            throw new Error("Solo se permite iniciar sesión con el primer usuario de dummyjson")
        }

        localStorage.setItem(STORAGE_TOKEN_KEY, data.accessToken)
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data))

        setToken(data.accessToken)
        setUser(data)

        return data
    }

    function logout() {
        localStorage.removeItem(STORAGE_TOKEN_KEY)
        localStorage.removeItem(STORAGE_USER_KEY)

        setToken(null)
        setUser(null)
    }

    const value = {
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext)

    if (context === undefined)
        throw new Error("useAuth must be used within an AuthProvider")

    return context
}
