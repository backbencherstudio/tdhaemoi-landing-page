'use client'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import ProtectedRoute from '../../components/auth/ProtectedRoute'


const Layout = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Layout