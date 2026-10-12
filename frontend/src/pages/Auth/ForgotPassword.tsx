import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { authService } from '../../services/authService'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../utils/validators'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await authService.forgotPassword(data.email)
    setSentEmail(data.email)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-4xl mb-3">🎮</Link>
          <h1 className="text-3xl font-display font-black text-dark">Recuperar contraseña</h1>
          <p className="text-gray-500 mt-1">Te enviaremos un enlace por correo</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          {!sent ? (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className="label">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    className={`input-field pl-11 ${errors.email ? 'border-red-400' : ''}`}
                    placeholder="tu@correo.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
                )}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                {isSubmitting
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Send className="w-5 h-5" />
                }
                {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-display font-bold text-dark mb-2">¡Correo enviado!</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enviamos un enlace de recuperación a <strong>{sentEmail}</strong>.
                Revisa tu bandeja de entrada (y la carpeta de spam).
              </p>
              <p className="text-gray-400 text-xs mt-4">El enlace expira en 1 hora.</p>
            </motion.div>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-primary 
                       transition-colors text-sm font-display font-semibold mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
