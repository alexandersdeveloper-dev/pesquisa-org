import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute() {
  const { session } = useAuth()

  // session === undefined: ainda carregando
  if (session === undefined) return null

  if (!session) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
