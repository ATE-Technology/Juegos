import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { articleService } from '../../services/articleService'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import type { Article } from '../../types'
import { useForm } from 'react-hook-form'

type ArticleFormData = Pick<Article, 'title' | 'content' | 'excerpt' | 'category' | 'coverUrl' | 'isPublished'>

export default function ManageArticles() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey: ['admin-articles'], queryFn: () => articleService.getArticles({ limit: 50 }) })
  const createMutation = useMutation({ mutationFn: articleService.createArticle, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-articles'] }); setIsModalOpen(false) } })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Article> }) => articleService.updateArticle(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-articles'] }); setIsModalOpen(false) } })
  const deleteMutation = useMutation({ mutationFn: articleService.deleteArticle, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-articles'] }) })

  const { register, handleSubmit, reset } = useForm<ArticleFormData>()
  const openCreate = () => { setEditingArticle(null); reset({}); setIsModalOpen(true) }
  const openEdit = (a: Article) => { setEditingArticle(a); reset(a); setIsModalOpen(true) }
  const onSubmit = (data: ArticleFormData) => { editingArticle ? updateMutation.mutate({ id: editingArticle.id, data }) : createMutation.mutate(data) }
  const togglePublish = (article: Article) => updateMutation.mutate({ id: article.id, data: { isPublished: !article.isPublished } })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-dark">Gestión de Artículos</h1>
          <p className="text-gray-500">{data?.total ?? 0} artículos en total</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> Nuevo artículo</button>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div> : (
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-display font-bold text-dark">Artículo</th>
                <th className="text-left p-4 font-display font-bold text-dark">Categoría</th>
                <th className="text-left p-4 font-display font-bold text-dark">Estado</th>
                <th className="text-left p-4 font-display font-bold text-dark">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data?.data ?? []).map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-lg">📝</div>
                      <span className="font-display font-semibold text-dark line-clamp-1 max-w-[200px]">{article.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{article.category}</td>
                  <td className="p-4">
                    <button onClick={() => togglePublish(article)} className="flex items-center gap-1.5 text-sm" aria-label={article.isPublished ? 'Despublicar' : 'Publicar'}>
                      {article.isPublished ? <Eye className="w-4 h-4 text-accent" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      <span className={article.isPublished ? 'text-accent' : 'text-gray-400'}>{article.isPublished ? 'Publicado' : 'Borrador'}</span>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(article)} className="p-2 hover:bg-primary-50 rounded-xl text-primary"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(article.id) }} className="p-2 hover:bg-red-50 rounded-xl text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingArticle ? 'Editar artículo' : 'Nuevo artículo'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="label">Título</label><input type="text" className="input-field" placeholder="Título del artículo" {...register('title', { required: true })} /></div>
          <div><label className="label">Categoría</label><input type="text" className="input-field" placeholder="Para padres, Educación..." {...register('category')} /></div>
          <div><label className="label">Extracto (resumen corto)</label><textarea rows={2} className="input-field resize-none" placeholder="Breve descripción del artículo..." {...register('excerpt')} /></div>
          <div><label className="label">Contenido (HTML)</label><textarea rows={8} className="input-field resize-none font-mono text-xs" placeholder="<p>Contenido del artículo...</p>" {...register('content')} /></div>
          <div><label className="label">URL imagen de portada</label><input type="url" className="input-field" placeholder="https://..." {...register('coverUrl')} /></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded accent-primary w-4 h-4" {...register('isPublished')} /><span className="font-display font-semibold text-sm text-dark">Publicar inmediatamente</span></label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary flex-1">{editingArticle ? 'Guardar' : 'Crear artículo'}</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost flex-1">Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
