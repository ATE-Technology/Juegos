import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema, type LoginFormData } from '../../utils/validators'
import type { AxiosError } from 'axios'
import type { ApiError } from '../../types'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    try {
      await login(data.email, data.password)
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const msg = error.response?.data?.message
      if (error.response?.status === 401) {
        setServerError('Correo o contraseña incorrectos.')
      } else if (error.response?.status === 429) {
        setServerError('Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo.')
      } else {
        setServerError(msg ?? 'Ocurrió un error. Inténtalo de nuevo.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-4xl mb-3" aria-label="Ir al inicio">🎮</Link>
          <h1 className="text-3xl font-display font-black text-dark">¡Bienvenido de nuevo!</h1>
          <p className="text-gray-500 mt-1">Ingresa a tu cuenta para continuar</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          {serverError && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 text-sm font-body"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`input-field pl-11 ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder="tu@correo.com"
                  {...register('email')}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p id="email-error" role="alert" className="text-red-500 text-xs mt-1.5 font-body">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="label !mb-0">Contraseña</label>
                <Link
                  to="/recuperar-contrasena"
                  className="text-xs text-primary hover:underline font-body"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder="Tu contraseña"
                  {...register('password')}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className="text-red-500 text-xs mt-1.5 font-body">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <LogIn className="w-5 h-5" aria-hidden="true" />
              )}
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Registro */}
          <p className="text-center text-gray-500 text-sm mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary font-bold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
