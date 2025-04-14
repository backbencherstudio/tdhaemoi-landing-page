'use client'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Toaster } from 'react-hot-toast'

const Layout = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
        <Toaster position="top-right" />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Layout