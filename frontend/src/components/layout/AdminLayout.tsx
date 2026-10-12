import { Outlet, NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Gamepad2, Video, Newspaper, Users, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
  { to: '/admin/juegos', label: 'Juegos', icon: <Gamepad2 className="w-4 h-4" /> },
  { to: '/admin/videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
  { to: '/admin/articulos', label: 'Artículos', icon: <Newspaper className="w-4 h-4" /> },
  { to: '/admin/usuarios', label: 'Usuarios', icon: <Users className="w-4 h-4" /> },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-dark flex-shrink-0 flex flex-col" aria-label="Panel de administración">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 text-white font-display font-black text-lg">
            <span>🎮</span> Admin
          </Link>
          {user && (
            <p className="text-white/50 text-xs mt-1 truncate">{user.email}</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-display font-semibold text-sm transition-all',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 
                       hover:bg-white/10 hover:text-white font-display font-semibold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Ir al sitio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 
                       hover:bg-red-500/10 hover:text-red-300 font-display font-semibold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
