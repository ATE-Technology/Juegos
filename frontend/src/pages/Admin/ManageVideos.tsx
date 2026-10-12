import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { videoService } from '../../services/videoService'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import type { Video } from '../../types'
import { useForm } from 'react-hook-form'

type VideoFormData = Omit<Video, 'id' | 'createdAt'>

export default function ManageVideos() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey: ['admin-videos'], queryFn: () => videoService.getVideos({ limit: 50 } as Parameters<typeof videoService.getVideos>[0]) })
  const createMutation = useMutation({ mutationFn: videoService.createVideo, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-videos'] }); setIsModalOpen(false) } })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Video> }) => videoService.updateVideo(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-videos'] }); setIsModalOpen(false) } })
  const deleteMutation = useMutation({ mutationFn: videoService.deleteVideo, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-videos'] }) })

  const { register, handleSubmit, reset } = useForm<VideoFormData>()
  const openCreate = () => { setEditingVideo(null); reset({}); setIsModalOpen(true) }
  const openEdit = (v: Video) => { setEditingVideo(v); reset(v); setIsModalOpen(true) }
  const onSubmit = (data: VideoFormData) => { editingVideo ? updateMutation.mutate({ id: editingVideo.id, data }) : createMutation.mutate(data) }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-dark">Gestión de Videos</h1>
          <p className="text-gray-500">{data?.total ?? 0} videos en total</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> Nuevo video</button>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div> : (
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-display font-bold text-dark">Video</th>
                <th className="text-left p-4 font-display font-bold text-dark">Categoría</th>
                <th className="text-left p-4 font-display font-bold text-dark">Tipo</th>
                <th className="text-left p-4 font-display font-bold text-dark">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data?.data ?? []).map((video) => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-lg">🎬</div>
                      <span className="font-display font-semibold text-dark">{video.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{video.category}</td>
                  <td className="p-4"><span className={video.isPremium ? 'badge-premium' : 'badge-free'}>{video.isPremium ? 'Premium' : 'Gratis'}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(video)} className="p-2 hover:bg-primary-50 rounded-xl text-primary"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(video.id) }} className="p-2 hover:bg-red-50 rounded-xl text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVideo ? 'Editar video' : 'Nuevo video'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="label">Título</label><input type="text" className="input-field" placeholder="Título del video" {...register('title', { required: true })} /></div>
          <div><label className="label">Categoría</label><input type="text" className="input-field" placeholder="Categoría" {...register('category')} /></div>
          <div><label className="label">Descripción</label><textarea rows={3} className="input-field resize-none" {...register('description')} /></div>
          <div><label className="label">URL embed (YouTube/Vimeo)</label><input type="url" className="input-field" placeholder="https://youtube.com/embed/..." {...register('embedUrl')} /></div>
          <div><label className="label">URL miniatura</label><input type="url" className="input-field" placeholder="https://..." {...register('thumbnailUrl')} /></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded accent-primary w-4 h-4" {...register('isPremium')} /><span className="font-display font-semibold text-sm text-dark">Contenido Premium</span></label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary flex-1">{editingVideo ? 'Guardar' : 'Crear video'}</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost flex-1">Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
