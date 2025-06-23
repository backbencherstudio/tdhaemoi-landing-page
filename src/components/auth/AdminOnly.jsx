'use client'
import { useAuth } from '../../context/AuthContext'
import { canAccessAdminDashboard } from '../../utils/auth'

export default function AdminOnly({ children, fallback = null }) {
    const { user } = useAuth()

    if (!canAccessAdminDashboard(user)) {
        return fallback
    }

    return children
} 