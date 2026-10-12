import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { articleService } from '../../services/articleService'
import ArticleCard from '../../components/articles/ArticleCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const categories = ['Todas', 'Para padres', 'Para estudiantes', 'Educación', 'Consejos']

export default function Articles() {
  const [category, setCategory] = useState('Todas')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['articles', { page, category: category === 'Todas' ? undefined : category }],
    queryFn: () => articleService.getArticles({
      page, limit: 9,
      category: category === 'Todas' ? undefined : category,
    }),
  })

  return (
    <div className="py-12">
      <div className="container-main">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 
                          rounded-full text-sm font-display font-bold mb-4">
            <Newspaper className="w-4 h-4" />
            Artículos y guías
          </div>
          <h1 className="section-title mb-3">Artículos para padres y estudiantes</h1>
          <p className="section-subtitle mx-auto">
            Guías, consejos y recursos pedagógicos para apoyar el aprendizaje.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center mb-10" role="group" aria-label="Filtrar por categoría">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1) }}
              className={`px-5 py-2 rounded-full text-sm font-display font-bold transition-all ${
                category === cat
                  ? 'bg-accent text-white'
                  : 'bg-white text-gray-600 hover:bg-accent/10 hover:text-accent shadow-sm'
              }`}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : (data?.data ?? []).length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl font-display font-bold text-dark mb-2">Próximamente</p>
            <p className="text-gray-500">Estamos preparando nuevos artículos.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data?.data ?? []).map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline px-5 py-2.5 text-sm disabled:opacity-40">← Anterior</button>
                <span className="font-display font-bold text-dark">Página {page} de {data.totalPages}</span>
                <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="btn-outline px-5 py-2.5 text-sm disabled:opacity-40">Siguiente →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
