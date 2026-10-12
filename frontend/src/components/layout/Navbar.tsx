import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Gamepad2, User, LogOut, LayoutDashboard,
  ChevronDown, Star, BookOpen, Video, Newspaper, Phone, DollarSign
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'

const navLinks = [
  { to: '/juegos', label: 'Juegos', icon: <Gamepad2 className="w-4 h-4" /> },
  { to: '/videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
  { to: '/articulos', label: 'Artículos', icon: <Newspaper className="w-4 h-4" /> },
  { to: '/docente', label: 'La Docente', icon: <BookOpen className="w-4 h-4" /> },
  { to: '/precios', label: 'Precios', icon: <DollarSign className="w-4 h-4" /> },
  { to: '/contacto', label: 'Contacto', icon: <Phone className="w-4 h-4" /> },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false)
    setUserMenuOpen(false)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white/90 backdrop-blur-sm'
        )}
      >
        <nav
          className="container-main flex items-center justify-between h-16"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-black text-xl text-primary
                       hover:scale-105 transition-transform"
          >
            <img
              src="/Logo.jpg"
              alt=""
              className="h-12 w-auto max-w-[120px] flex-shrink-0 object-contain"
              aria-hidden="true"
            />
            <span className="hidden sm:block">Aprendiendo y explorando</span>
          </Link>

          {/* Links de escritorio */}
          <div className="hidden lg:flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-display font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary'
                      : 'text-dark hover:bg-primary-50 hover:text-primary'
                  )
                }
                role="listitem"
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Acciones de usuario */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary-50 
                             transition-colors font-display font-semibold text-sm text-dark"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-card flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
                  {user.role === 'premium' && (
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  )}
                  <ChevronDown className={cn('w-4 h-4 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl 
                                 border border-gray-100 py-2 z-50"
                      role="menu"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-500">Conectado como</p>
                        <p className="text-sm font-display font-bold text-dark truncate">{user.email}</p>
                        <span className={cn('text-xs font-bold', user.role === 'premium' ? 'text-accent' : 'text-gray-400')}>
                          {user.role === 'premium' ? '⭐ PREMIUM' : user.role === 'admin' ? '🛡️ ADMIN' : 'FREE'}
                        </span>
                      </div>
                      <Link
                        to="/mi-cuenta"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-display font-semibold
                                   text-dark hover:bg-primary-50 hover:text-primary transition-colors"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Mi cuenta
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-display font-semibold
                                     text-dark hover:bg-primary-50 hover:text-primary transition-colors"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Panel admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-display font-semibold
                                   text-red-500 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn-primary text-sm py-2 px-4">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Botón hamburguesa */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors text-dark"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Menú móvil — slide in lateral */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              aria-hidden="true"
            />

            {/* Panel lateral */}
            <motion.nav
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-2xl 
                         flex flex-col lg:hidden"
              aria-label="Menú de navegación móvil"
            >
              {/* Header del panel */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-display font-black text-lg text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src="/Logo.jpg"
                    alt=""
                    className="h-10 w-auto max-w-[76px] flex-shrink-0 object-contain"
                    aria-hidden="true"
                  />
                  Aprendiendo y explorando
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Usuario info */}
              {isAuthenticated && user && (
                <div className="px-5 py-4 bg-primary-50 border-b border-primary-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-card flex items-center justify-center text-white font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-display font-bold text-dark text-sm">{user.fullName.split(' ')[0]}</p>
                      <span className={cn('text-xs font-bold', user.role === 'premium' ? 'text-accent' : 'text-gray-400')}>
                        {user.role === 'premium' ? '⭐ PREMIUM' : user.role === 'admin' ? '🛡️ ADMIN' : 'GRATIS'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Links de navegación */}
              <div className="flex-1 overflow-y-auto py-4 px-3">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 font-display font-semibold transition-all',
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-dark hover:bg-primary-50 hover:text-primary'
                        )
                      }
                    >
                      {link.icon}
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}

                {isAuthenticated && user && (
                  <>
                    <div className="border-t border-gray-100 my-3" />
                    <NavLink
                      to="/mi-cuenta"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 font-display font-semibold transition-all',
                          isActive ? 'bg-primary text-white' : 'text-dark hover:bg-primary-50 hover:text-primary'
                        )
                      }
                    >
                      <User className="w-4 h-4" />
                      Mi cuenta
                    </NavLink>
                    {user.role === 'admin' && (
                      <NavLink
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 font-display font-semibold transition-all',
                            isActive ? 'bg-primary text-white' : 'text-dark hover:bg-primary-50 hover:text-primary'
                          )
                        }
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Panel admin
                      </NavLink>
                    )}
                  </>
                )}
              </div>

              {/* Footer del panel */}
              <div className="p-4 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl
                               border-2 border-red-200 text-red-500 font-display font-bold
                               hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                ) : (
                  <>
                    <Link
                      to="/registro"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary w-full text-center"
                    >
                      Registrarse gratis
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="btn-outline w-full text-center"
                    >
                      Iniciar sesión
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
