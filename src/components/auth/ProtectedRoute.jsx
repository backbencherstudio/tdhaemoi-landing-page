'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            return
        }
        setIsAuthenticated(true)
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium text-gray-600">Loading...</p>
            </div>
        )
    }

    return children
}