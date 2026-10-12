import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
})

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre es demasiado largo'),
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número'),
  passwordConfirm: z.string().min(1, 'Confirma tu contraseña'),
  profileType: z.enum(['parent', 'student', 'teacher'], {
    required_error: 'Selecciona tu tipo de perfil',
  }),
  consentAccepted: z
    .boolean()
    .refine((val) => val === true, 'Debes aceptar la política de datos personales'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirm'],
})

export const contactSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z
    .string()
    .email('Ingresa un correo válido'),
  subject: z
    .string()
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(200, 'El asunto es demasiado largo'),
  message: z
    .string()
    .min(20, 'El mensaje debe tener al menos 20 caracteres')
    .max(2000, 'El mensaje es demasiado largo'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número'),
  passwordConfirm: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirm'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ContactFormValues = z.infer<typeof contactSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
