import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/authService'
import { resetPasswordSchema, type ResetPasswordFormData } from '../../utils/validators'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const token = searchParams.get('token') || ''

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(null)
    try {
      await authService.resetPassword(token, data.password)
      navigate('/login', { state: { message: 'Contraseña restablecida. Inicia sesión con tu nueva contraseña.' } })
    } catch {
      setServerError('El enlace es inválido o ha expirado. Solicita un nuevo enlace.')
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Enlace inválido.</p>
          <Link to="/recuperar-contrasena" className="btn-primary">Solicitar nuevo enlace</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-4xl mb-3">🎮</Link>
          <h1 className="text-3xl font-display font-black text-dark">Nueva contraseña</h1>
          <p className="text-gray-500 mt-1">Elige una contraseña segura</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          {serverError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label htmlFor="new-password" className="label">Nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark"
                  aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="label">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="passwordConfirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pl-11 ${errors.passwordConfirm ? 'border-red-400' : ''}`}
                  placeholder="Repite tu contraseña"
                  {...register('passwordConfirm')}
                />
              </div>
              {errors.passwordConfirm && <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.passwordConfirm.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
              {isSubmitting
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <CheckCircle className="w-5 h-5" />
              }
              {isSubmitting ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
