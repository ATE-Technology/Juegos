import { motion } from 'framer-motion'
import { Users, Gamepad2, Star, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

interface Stats {
  totalUsers: number
  activeSubscriptions: number
  totalGames: number
  pendingRequests: number
}

export default function AdminDashboard() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get<Stats>('/admin/stats')
      return data
    },
  })

  const cards = [
    { title: 'Usuarios registrados', value: stats?.totalUsers ?? '—', icon: <Users className="w-6 h-6" />, color: 'bg-primary-50 text-primary' },
    { title: 'Suscripciones activas', value: stats?.activeSubscriptions ?? '—', icon: <Star className="w-6 h-6" />, color: 'bg-accent/10 text-accent' },
    { title: 'Juegos publicados', value: stats?.totalGames ?? '—', icon: <Gamepad2 className="w-6 h-6" />, color: 'bg-secondary/10 text-secondary' },
    { title: 'Solicitudes pendientes', value: stats?.pendingRequests ?? '—', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-warning/20 text-dark' },
  ]

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-black text-dark mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Resumen de la plataforma</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-3xl shadow-card p-6"
            >
              <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <p className="text-3xl font-display font-black text-dark">{card.value}</p>
              <p className="text-gray-500 text-sm mt-1">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-3xl shadow-card p-6">
          <h2 className="font-display font-black text-dark text-xl mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/admin/juegos', label: '+ Nuevo juego', color: 'btn-primary' },
              { href: '/admin/videos', label: '+ Nuevo video', color: 'btn-secondary' },
              { href: '/admin/articulos', label: '+ Nuevo artículo', color: 'btn-outline' },
              { href: '/admin/usuarios', label: 'Gestionar usuarios', color: 'btn-ghost' },
            ].map((action) => (
              <a key={action.label} href={action.href} className={`${action.color} text-sm py-2.5 text-center`}>
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
