import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Star, Shield, UserX } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import type { User, UserRole } from '../../types'
import type { PaginatedResponse } from '../../types'

export default function ManageUsers() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>('/admin/users')
      return data
    },
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const roleLabels: Record<UserRole, string> = { free: '🆓 Free', premium: '⭐ Premium', admin: '🛡️ Admin' }
  const roleColors: Record<UserRole, string> = { free: 'text-gray-500', premium: 'text-accent', admin: 'text-primary' }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-dark">Gestión de Usuarios</h1>
        <p className="text-gray-500">{data?.total ?? 0} usuarios registrados</p>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div> : (
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-display font-bold text-dark">Usuario</th>
                <th className="text-left p-4 font-display font-bold text-dark">Perfil</th>
                <th className="text-left p-4 font-display font-bold text-dark">Rol actual</th>
                <th className="text-left p-4 font-display font-bold text-dark">Registro</th>
                <th className="text-left p-4 font-display font-bold text-dark">Cambiar rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data?.data ?? []).map((user) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-card flex items-center justify-center text-white text-sm font-black">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-dark">{user.fullName}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {user.profileType === 'parent' ? '👨‍👩‍👧 Padre' :
                     user.profileType === 'student' ? '🎒 Estudiante' : '👩‍🏫 Docente'}
                  </td>
                  <td className="p-4">
                    <span className={`font-display font-bold ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('es-CO')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {(['free', 'premium', 'admin'] as UserRole[]).filter(r => r !== user.role).map((role) => (
                        <button
                          key={role}
                          onClick={() => { if (confirm(`¿Cambiar a ${role}?`)) roleMutation.mutate({ id: user.id, role }) }}
                          className={`p-1.5 rounded-lg hover:scale-110 transition-transform ${
                            role === 'premium' ? 'text-accent hover:bg-accent/10' :
                            role === 'admin' ? 'text-primary hover:bg-primary-50' :
                            'text-gray-400 hover:bg-gray-100'
                          }`}
                          aria-label={`Cambiar rol a ${role}`}
                          title={`Cambiar a ${role}`}
                        >
                          {role === 'premium' ? <Star className="w-4 h-4" /> :
                           role === 'admin' ? <Shield className="w-4 h-4" /> :
                           <UserX className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
