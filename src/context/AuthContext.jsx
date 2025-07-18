'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { canAccessAdminDashboard } from '../utils/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const userData = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (userData && token) {
            setUser(JSON.parse(userData))
        }
        setLoading(false)
    }, [])

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
        router.push('/login')
    }

    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
    }

    const isAdmin = () => {
        return canAccessAdminDashboard(user)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}