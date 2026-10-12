import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Star, Calendar, Mail, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../context/SubscriptionContext'
import { Link } from 'react-router-dom'

export default function Account() {
  const { user } = useAuth()
  const { subscription, isPremium } = useSubscription()
  const [deleteRequested, setDeleteRequested] = useState(false)

  if (!user) return null

  const planLabels = { monthly: 'Mensual', annual: 'Anual' }
  const statusLabels = {
    active: { label: 'Activa', color: 'text-accent' },
    pending: { label: 'Pendiente de activación', color: 'text-warning' },
    expired: { label: 'Expirada', color: 'text-red-500' },
    cancelled: { label: 'Cancelada', color: 'text-gray-500' },
  }

  return (
    <div className="py-12">
      <div className="container-main max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h1 className="text-3xl font-display font-black text-dark">Mi cuenta</h1>

          {/* Perfil */}
          <div className="bg-white rounded-3xl shadow-card p-8">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-card flex items-center justify-center text-white text-2xl font-black">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-display font-black text-dark">{user.fullName}</h2>
                <p className="text-gray-500 text-sm flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                <span className={`text-xs font-bold ${isPremium ? 'text-accent' : 'text-gray-400'}`}>
                  {user.role === 'admin' ? '🛡️ Administrador' : isPremium ? '⭐ PREMIUM' : '🆓 Plan gratuito'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Tipo de perfil</p>
                <p className="font-display font-bold text-dark">
                  {user.profileType === 'parent' ? '👨‍👩‍👧 Padre/Madre' :
                   user.profileType === 'student' ? '🎒 Estudiante' : '👩‍🏫 Docente'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Miembro desde</p>
                <p className="font-display font-bold text-dark">
                  {new Date(user.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>

          {/* Suscripción */}
          <div className="bg-white rounded-3xl shadow-card p-8">
            <h2 className="text-xl font-display font-black text-dark mb-5 flex items-center gap-2">
              <Star className="w-5 h-5 text-warning fill-warning" /> Mi suscripción
            </h2>

            {isPremium && subscription ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/10 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Plan</p>
                    <p className="font-display font-black text-dark">{planLabels[subscription.plan] ?? subscription.plan}</p>
                  </div>
                  <div className={`${subscription.status === 'active' ? 'bg-accent/10' : 'bg-warning/10'} rounded-2xl p-4`}>
                    <p className="text-xs text-gray-500 mb-1">Estado</p>
                    <p className={`font-display font-black ${statusLabels[subscription.status]?.color ?? 'text-dark'}`}>
                      {statusLabels[subscription.status]?.label ?? subscription.status}
                    </p>
                  </div>
                </div>
                {subscription.expiresAt && (
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Vence el</p>
                      <p className="font-display font-bold text-dark">
                        {new Date(subscription.expiresAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Para renovar o cancelar tu suscripción, escríbenos a{' '}
                  <a href="mailto:contacto@juegoseducativos.com" className="text-primary font-bold">
                    contacto@juegoseducativos.com
                  </a>
                </p>
              </div>
            ) : (
              <div>
                <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-center">
                  <p className="text-gray-600 mb-2">Actualmente en el <strong>plan gratuito</strong></p>
                  <p className="text-sm text-gray-500">Accede a los juegos y videos completos con el plan premium.</p>
                </div>
                <Link to="/precios" className="btn-primary w-full">
                  <Star className="w-4 h-4" /> Actualizar a premium
                </Link>
              </div>
            )}
          </div>

          {/* Privacidad y datos */}
          <div className="bg-white rounded-3xl shadow-card p-8">
            <h2 className="text-xl font-display font-black text-dark mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Privacidad y datos personales
            </h2>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              Tienes derecho a solicitar la eliminación o rectificación de tus datos personales conforme a la Ley 1581 de 2012.
            </p>

            {!deleteRequested ? (
              <button
                onClick={() => setDeleteRequested(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-red-200 
                           text-red-500 font-display font-bold text-sm hover:bg-red-50 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Solicitar eliminación de mis datos
              </button>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-display font-bold text-dark text-sm mb-1">Solicitud registrada</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Hemos registrado tu solicitud de eliminación de datos. Te contactaremos en los próximos{' '}
                      <strong>15 días hábiles</strong> para confirmar el proceso conforme a la Ley 1581 de 2012.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Link to="/privacidad" className="inline-flex items-center gap-1 text-primary text-sm hover:underline mt-4">
              Ver política de datos personales →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
