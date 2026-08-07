import { createContext, useContext, useState } from "react"
import { request } from "@/services/api"

const STORAGE_TOKEN_KEY = "token";
const STORAGE_USER_KEY = "user";

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

    async function login(email, password) {
        const body = new URLSearchParams()
        body.append("username", email)
        body.append("password", password)

        const data = await request("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
        })

        const userData = await request("/auth/me", {
            headers: { Authorization: `Bearer ${data.access_token}` },
        })

        localStorage.setItem(STORAGE_TOKEN_KEY, data.access_token)
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData))

        setToken(data.access_token)
        setUser(userData)

        return userData
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
