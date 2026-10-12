import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { gameService } from '../../services/gameService'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import type { Game } from '../../types'
import { useForm } from 'react-hook-form'

type GameFormData = Omit<Game, 'id' | 'createdAt'>

export default function ManageGames() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-games'],
    queryFn: () => gameService.getGames({ limit: 50 }),
  })

  const createMutation = useMutation({
    mutationFn: gameService.createGame,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-games'] }); setIsModalOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Game> }) => gameService.updateGame(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-games'] }); setIsModalOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: gameService.deleteGame,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-games'] }),
  })

  const { register, handleSubmit, reset } = useForm<GameFormData>()

  const openCreate = () => { setEditingGame(null); reset({}); setIsModalOpen(true) }
  const openEdit = (game: Game) => { setEditingGame(game); reset(game); setIsModalOpen(true) }

  const onSubmit = (data: GameFormData) => {
    if (editingGame) {
      updateMutation.mutate({ id: editingGame.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const toggleActive = (game: Game) => {
    updateMutation.mutate({ id: game.id, data: { isActive: !game.isActive } })
  }

  const levels = ['preescolar', 'primaria', 'secundaria']

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-dark">Gestión de Juegos</h1>
          <p className="text-gray-500">{data?.total ?? 0} juegos en total</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Nuevo juego
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-display font-bold text-dark">Juego</th>
                <th className="text-left p-4 font-display font-bold text-dark">Categoría</th>
                <th className="text-left p-4 font-display font-bold text-dark">Nivel</th>
                <th className="text-left p-4 font-display font-bold text-dark">Tipo</th>
                <th className="text-left p-4 font-display font-bold text-dark">Estado</th>
                <th className="text-left p-4 font-display font-bold text-dark">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data?.data ?? []).map((game) => (
                <motion.tr key={game.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">🎮</div>
                      <span className="font-display font-semibold text-dark">{game.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{game.category}</td>
                  <td className="p-4 text-gray-600">{game.level}</td>
                  <td className="p-4">
                    <span className={game.isPremium ? 'badge-premium' : 'badge-free'}>
                      {game.isPremium ? 'Premium' : 'Gratis'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(game)} className="flex items-center gap-1 text-sm" aria-label={game.isActive ? 'Desactivar juego' : 'Activar juego'}>
                      {game.isActive
                        ? <ToggleRight className="w-6 h-6 text-accent" />
                        : <ToggleLeft className="w-6 h-6 text-gray-400" />
                      }
                      <span className={game.isActive ? 'text-accent' : 'text-gray-400'}>{game.isActive ? 'Activo' : 'Inactivo'}</span>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(game)} className="p-2 hover:bg-primary-50 rounded-xl text-primary transition-colors" aria-label="Editar juego">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (confirm('¿Eliminar este juego?')) deleteMutation.mutate(game.id) }} className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors" aria-label="Eliminar juego">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de creación/edición */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGame ? 'Editar juego' : 'Nuevo juego'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input type="text" className="input-field" placeholder="Nombre del juego" {...register('title', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Categoría</label>
              <input type="text" className="input-field" placeholder="Matemáticas, Lenguaje..." {...register('category')} />
            </div>
            <div>
              <label className="label">Nivel</label>
              <select className="input-field" {...register('level')}>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea rows={3} className="input-field resize-none" placeholder="Descripción del juego..." {...register('description')} />
          </div>
          <div>
            <label className="label">URL demo (iframe src)</label>
            <input type="url" className="input-field" placeholder="https://..." {...register('embedUrlDemo')} />
          </div>
          <div>
            <label className="label">URL completo (solo premium — opcional)</label>
            <input type="url" className="input-field" placeholder="https://..." {...register('embedUrlFull')} />
          </div>
          <div>
            <label className="label">URL imagen de portada</label>
            <input type="url" className="input-field" placeholder="https://..." {...register('coverUrl')} />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-primary w-4 h-4" {...register('isPremium')} />
              <span className="font-display font-semibold text-sm text-dark">Contenido Premium</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-primary w-4 h-4" defaultChecked {...register('isActive')} />
              <span className="font-display font-semibold text-sm text-dark">Activo</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary flex-1">
              {(createMutation.isPending || updateMutation.isPending) ? 'Guardando...' : editingGame ? 'Guardar cambios' : 'Crear juego'}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost flex-1">Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
