import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

interface ProtectedRouteProps {
  requiredRole?: 'free' | 'premium' | 'admin'
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    // Guardar la ruta intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  if (requiredRole === 'premium' && user.role === 'free') {
    return <Navigate to="/precios" state={{ upgrade: true }} replace />
  }

  return <Outlet />
}
