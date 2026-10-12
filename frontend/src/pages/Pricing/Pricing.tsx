import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Gamepad2, Video, Newspaper, Headphones } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { subscriptionService } from '../../services/subscriptionService'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../context/SubscriptionContext'
import Modal from '../../components/common/Modal'
import { Link } from 'react-router-dom'
import type { SubscriptionPlan } from '../../types'

const requestSchema = z.object({
  paymentMethod: z.enum(['cash', 'nequi', 'transfer'], { required_error: 'Selecciona un método' }),
  notes: z.string().optional(),
})
type RequestFormData = z.infer<typeof requestSchema>

const plans = [
  {
    id: 'monthly' as SubscriptionPlan,
    name: 'Mensual',
    price: '25.000',
    period: 'mes',
    badge: null,
    description: 'Ideal para probar la plataforma',
  },
  {
    id: 'annual' as SubscriptionPlan,
    name: 'Anual',
    price: '200.000',
    period: 'año',
    badge: '¡Ahorra 33%!',
    description: 'El mejor valor para el año escolar',
  },
]

const features = {
  free: [
    { text: 'Demos de todos los juegos', included: true },
    { text: 'Videos gratuitos', included: true },
    { text: 'Artículos y guías', included: true },
    { text: 'Registro de progreso básico', included: true },
    { text: 'Juegos completos', included: false },
    { text: 'Videos premium', included: false },
    { text: 'Soporte prioritario', included: false },
  ],
  premium: [
    { text: 'Todo lo del plan gratuito', included: true },
    { text: 'Juegos completos (todos los niveles)', included: true },
    { text: 'Videos premium exclusivos', included: true },
    { text: 'Acceso a nuevo contenido primero', included: true },
    { text: 'Seguimiento de progreso completo', included: true },
    { text: 'Soporte prioritario por WhatsApp', included: true },
    { text: 'Descuentos en nuevos contenidos', included: true },
  ],
}

const paymentMethods = [
  { value: 'cash', label: '💵 Efectivo (presencial)' },
  { value: 'nequi', label: '📱 Nequi' },
  { value: 'transfer', label: '🏦 Transferencia bancaria' },
]

export default function Pricing() {
  const { isAuthenticated } = useAuth()
  const { isPremium, subscription } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [requestSent, setRequestSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: RequestFormData) =>
      subscriptionService.requestPremium({ plan: selectedPlan!, ...data }),
    onSuccess: () => setRequestSent(true),
  })

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) return
    setSelectedPlan(plan)
  }

  return (
    <div className="py-12">
      <div className="container-main">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-warning/20 text-dark px-4 py-2 rounded-full text-sm font-display font-bold mb-4">
            <Star className="w-4 h-4 text-warning fill-warning" /> Planes y precios
          </div>
          <h1 className="section-title mb-3">Elige tu plan</h1>
          <p className="section-subtitle mx-auto">
            Comienza gratis y actualiza cuando quieras para acceder al contenido completo.
          </p>
        </motion.div>

        {/* Estado actual */}
        {isPremium && (
          <div className="bg-accent/10 border border-accent/30 rounded-3xl p-6 mb-10 text-center">
            <Star className="w-8 h-8 text-accent mx-auto mb-2 fill-accent" />
            <p className="font-display font-black text-dark text-xl">¡Ya tienes acceso Premium!</p>
            {subscription?.expiresAt && (
              <p className="text-gray-600 text-sm mt-1">
                Tu suscripción está activa hasta el {new Date(subscription.expiresAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        )}

        {/* Comparativa de planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {/* Plan FREE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-card p-8 border-2 border-gray-100"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-display font-black text-dark mb-1">Gratis</h2>
              <p className="text-gray-500 text-sm">{features.free[0].text.split(',')[0]}</p>
              <div className="mt-4">
                <span className="text-5xl font-display font-black text-dark">$0</span>
                <span className="text-gray-400 ml-2">COP / siempre</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {features.free.map((f) => (
                <li key={f.text} className={`flex items-center gap-3 text-sm ${f.included ? 'text-dark' : 'text-gray-400 line-through'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${f.included ? 'bg-accent text-white' : 'bg-gray-100 text-gray-300'}`}>
                    <Check className="w-3 h-3" />
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
            <Link to="/registro" className="btn-outline w-full">Comenzar gratis</Link>
          </motion.div>

          {/* Plan PREMIUM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-xl p-8 text-white relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning text-dark text-xs font-black px-4 py-1.5 rounded-full">
              ⭐ MÁS POPULAR
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-display font-black mb-1">Premium</h2>
              <p className="text-white/70 text-sm">Acceso completo a todo el contenido</p>
              <div className="mt-4">
                <span className="text-5xl font-display font-black">Desde</span>
                <br />
                <span className="text-4xl font-display font-black">$25.000</span>
                <span className="text-white/70 ml-2">COP / mes</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {features.premium.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-white">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
            {!isPremium && (
              <button
                onClick={() => isAuthenticated ? setSelectedPlan('monthly') : undefined}
                className="w-full bg-white text-primary font-display font-black py-3.5 rounded-2xl hover:bg-white/90 transition-all"
              >
                {isAuthenticated ? 'Obtener premium' : (
                  <Link to="/registro" className="block">Registrarse y obtener premium</Link>
                )}
              </button>
            )}
          </motion.div>
        </div>

        {/* Selección de plan mensual/anual */}
        {!isPremium && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-black text-dark text-center mb-6">Elige tu período</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {plans.map((plan) => (
                <motion.button
                  key={plan.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`relative p-6 rounded-3xl border-2 text-left transition-all ${
                    selectedPlan === plan.id
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-200'
                  }`}
                  aria-pressed={selectedPlan === plan.id}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 right-4 bg-accent text-white text-xs font-black px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="font-display font-black text-dark text-xl mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{plan.description}</p>
                  <div>
                    <span className="text-3xl font-display font-black text-primary">${plan.price}</span>
                    <span className="text-gray-400 text-sm ml-1">COP / {plan.period}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Instrucciones de pago */}
            {selectedPlan && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white rounded-3xl shadow-card p-8"
              >
                <h3 className="text-xl font-display font-black text-dark mb-2">
                  Plan {plans.find(p => p.id === selectedPlan)?.name} — ${plans.find(p => p.id === selectedPlan)?.price} COP
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Selecciona cómo realizarás el pago y envía tu solicitud. Activaremos tu acceso en un plazo máximo de 24 horas hábiles.
                </p>

                <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                  <div>
                    <p className="label">Método de pago</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {paymentMethods.map((pm) => (
                        <label
                          key={pm.value}
                          className={`cursor-pointer rounded-2xl border-2 p-3 text-center text-sm font-display font-bold transition-all`}
                        >
                          <input type="radio" value={pm.value} className="sr-only" {...register('paymentMethod')} />
                          {pm.label}
                        </label>
                      ))}
                    </div>
                    {errors.paymentMethod && <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.paymentMethod.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="notes" className="label">Notas adicionales (opcional)</label>
                    <textarea id="notes" rows={3} className="input-field resize-none" placeholder="Cualquier información adicional..." {...register('notes')} />
                  </div>

                  <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4">
                    <p className="text-sm text-dark leading-relaxed">
                      📋 <strong>Proceso:</strong> Al enviar la solicitud te llegará un correo con los datos de pago.
                      Una vez confirmado el pago, activaremos tu acceso premium en menos de 24 horas.
                    </p>
                  </div>

                  <button type="submit" disabled={mutation.isPending} className="btn-primary w-full py-3.5">
                    {mutation.isPending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Star className="w-5 h-5" />}
                    {mutation.isPending ? 'Enviando...' : 'Solicitar acceso premium'}
                  </button>
                </form>
              </motion.div>
            )}

            {selectedPlan && !isAuthenticated && (
              <div className="bg-white rounded-3xl shadow-card p-8 text-center">
                <p className="text-gray-600 mb-5">Necesitas una cuenta para solicitar el plan premium.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/registro" className="btn-primary">Crear cuenta gratis</Link>
                  <Link to="/login" className="btn-outline">Ya tengo cuenta</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-display font-black text-dark text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                q: '¿Cuánto tiempo tarda en activarse mi acceso premium?',
                a: 'Una vez confirmado el pago, activamos tu acceso en un máximo de 24 horas hábiles. Te notificamos por correo cuando esté listo.',
              },
              {
                q: '¿Puedo cancelar mi suscripción?',
                a: 'Sí. Escríbenos antes de la fecha de renovación y no renovaremos el plan. No hacemos devoluciones de períodos ya facturados.',
              },
              {
                q: '¿Los niños pueden usar la plataforma solos?',
                a: 'Sí. La interfaz está diseñada para ser fácil de usar por niños desde preescolar. Sin embargo, recomendamos que los padres supervisen el tiempo de pantalla.',
              },
              {
                q: '¿En cuántos dispositivos puedo usar mi cuenta?',
                a: 'Tu cuenta premium puede usarse en todos tus dispositivos (computador, tablet, celular), pero no puede ser compartida con otras personas.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-dark mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What's included icons */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
          {[
            { icon: <Gamepad2 className="w-8 h-8" />, label: 'Juegos completos' },
            { icon: <Video className="w-8 h-8" />, label: 'Videos premium' },
            { icon: <Newspaper className="w-8 h-8" />, label: 'Artículos' },
            { icon: <Headphones className="w-8 h-8" />, label: 'Soporte prioritario' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3 p-5 bg-white rounded-3xl shadow-sm">
              <div className="text-primary">{item.icon}</div>
              <p className="font-display font-bold text-dark text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal confirmación */}
      <Modal isOpen={requestSent} onClose={() => setRequestSent(false)} title="¡Solicitud enviada!">
        <div className="text-center py-4">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Recibimos tu solicitud de plan premium. Te enviaremos un correo con los datos de pago y activaremos tu acceso en un máximo de <strong>24 horas hábiles</strong>.
          </p>
          <button onClick={() => setRequestSent(false)} className="btn-primary w-full">
            Entendido
          </button>
        </div>
      </Modal>
    </div>
  )
}
