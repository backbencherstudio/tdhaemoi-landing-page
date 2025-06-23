'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { canAccessAdminDashboard } from '../../utils/auth'

export default function ProtectedRoute({ children }) {
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login')
            } else if (!canAccessAdminDashboard(user)) {
                router.push('/login')
            }
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium text-gray-600">Loading...</p>
            </div>
        )
    }

    if (!user || !canAccessAdminDashboard(user)) {
        // Don't show anything if not allowed, since router will redirect
        return null
    }

    return children
}