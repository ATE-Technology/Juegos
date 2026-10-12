import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCookieForm } from '../../hooks/useCookieForm'
import { registerSchema, type RegisterFormData } from '../../utils/validators'
import type { AxiosError } from 'axios'
import type { ApiError } from '../../types'

const profileTypes = [
  { value: 'parent', label: '👨‍👩‍👧 Padre / Madre' },
  { value: 'student', label: '🎒 Estudiante' },
  { value: 'teacher', label: '👩‍🏫 Docente' },
]

const passwordRequirements = [
  { regex: /.{8,}/, label: 'Al menos 8 caracteres' },
  { regex: /[A-Z]/, label: 'Una letra mayúscula' },
  { regex: /[0-9]/, label: 'Un número' },
]

export default function Register() {
  const { register: registerUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      profileType: 'parent',
      consentAccepted: false,
    },
  })

  const { saveDraft, clearDraft } = useCookieForm(
    'reg_draft',
    { fullName: '', email: '', profileType: 'parent' } as Record<string, unknown>,
    setValue as (name: string, value: unknown) => void
  )

  const password = watch('password', '')

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        profileType: data.profileType,
        consentAccepted: data.consentAccepted,
      })
      clearDraft()
    } catch (err) {
      const error = err as AxiosError<ApiError>
      if (error.response?.status === 409) {
        setServerError('Ya existe una cuenta con este correo. ¿Deseas iniciar sesión?')
      } else {
        setServerError(error.response?.data?.message ?? 'Error al registrarse. Inténtalo de nuevo.')
      }
    }
  }

  // Guardar borrador en cada cambio (excepto contraseñas)
  const handleFieldChange = () => {
    const values = watch()
    saveDraft({
      fullName: values.fullName,
      email: values.email,
      profileType: values.profileType,
    })
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-4xl mb-3" aria-label="Ir al inicio">🎮</Link>
          <h1 className="text-3xl font-display font-black text-dark">Crea tu cuenta gratis</h1>
          <p className="text-gray-500 mt-1">Accede a demos gratuitas y mucho más</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          {serverError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 text-sm">
              {serverError}
              {serverError.includes('Ya existe') && (
                <Link to="/login" className="ml-2 font-bold underline">Iniciar sesión</Link>
              )}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={handleFieldChange}
            noValidate
            className="space-y-5"
          >
            {/* Nombre completo */}
            <div>
              <label htmlFor="fullName" className="label">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  className={`input-field pl-11 ${errors.fullName ? 'border-red-400' : ''}`}
                  placeholder="Tu nombre completo"
                  {...register('fullName')}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                />
              </div>
              {errors.fullName && (
                <p id="fullName-error" role="alert" className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  className={`input-field pl-11 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="tu@correo.com"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'reg-email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="reg-email-error" role="alert" className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="reg-password" className="label">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-requirements"
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
              {/* Indicador de requisitos */}
              {password && (
                <ul id="password-requirements" className="mt-2 space-y-1" aria-label="Requisitos de contraseña">
                  {passwordRequirements.map((req) => (
                    <li
                      key={req.label}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        req.regex.test(password) ? 'text-accent' : 'text-gray-400'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {req.label}
                    </li>
                  ))}
                </ul>
              )}
              {errors.password && (
                <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
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
                  aria-invalid={!!errors.passwordConfirm}
                  aria-describedby={errors.passwordConfirm ? 'confirm-error' : undefined}
                />
              </div>
              {errors.passwordConfirm && (
                <p id="confirm-error" role="alert" className="text-red-500 text-xs mt-1.5">{errors.passwordConfirm.message}</p>
              )}
            </div>

            {/* Tipo de perfil */}
            <div>
              <p className="label">¿Quién eres?</p>
              <div className="grid grid-cols-3 gap-3">
                {profileTypes.map((pt) => (
                  <label
                    key={pt.value}
                    className={`cursor-pointer rounded-2xl border-2 p-3 text-center text-sm font-display font-bold transition-all
                                ${watch('profileType') === pt.value
                                  ? 'border-primary bg-primary-50 text-primary'
                                  : 'border-gray-200 text-gray-600 hover:border-primary-200'
                                }`}
                  >
                    <input
                      type="radio"
                      value={pt.value}
                      className="sr-only"
                      {...register('profileType')}
                    />
                    {pt.label}
                  </label>
                ))}
              </div>
              {errors.profileType && (
                <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.profileType.message}</p>
              )}
            </div>

            {/* Consentimiento */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded accent-primary flex-shrink-0"
                  {...register('consentAccepted')}
                  aria-describedby={errors.consentAccepted ? 'consent-error' : undefined}
                  aria-invalid={!!errors.consentAccepted}
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  Acepto la{' '}
                  <Link
                    to="/privacidad"
                    target="_blank"
                    className="text-primary font-bold hover:underline"
                  >
                    Política de Tratamiento de Datos Personales
                  </Link>{' '}
                  conforme a la Ley 1581 de 2012. (Requerido)
                </span>
              </label>
              {errors.consentAccepted && (
                <p id="consent-error" role="alert" className="text-red-500 text-xs mt-1.5">
                  {errors.consentAccepted.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-base"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <UserPlus className="w-5 h-5" aria-hidden="true" />
              )}
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
