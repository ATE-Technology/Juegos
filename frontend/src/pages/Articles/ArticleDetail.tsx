import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import DOMPurify from 'dompurify'
import { articleService } from '../../services/articleService'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleService.getArticleBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-display font-bold text-dark mb-3">Artículo no encontrado</h1>
        <Link to="/articulos" className="btn-primary">Ver todos los artículos</Link>
      </div>
    )
  }

  const sanitizedContent = DOMPurify.sanitize(article.content)

  return (
    <div className="py-12">
      <div className="container-main max-w-4xl">
        <Link to="/articulos" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-display font-semibold text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a artículos
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {article.coverUrl && (
            <img
              src={article.coverUrl}
              alt={article.title}
              className="w-full aspect-video object-cover rounded-3xl mb-8 shadow-card"
            />
          )}

          {article.category && (
            <span className="inline-block bg-primary-50 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              {article.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-display font-black text-dark leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-400 text-sm mb-8 pb-8 border-b border-gray-100">
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author.fullName}
              </span>
            )}
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>

          {/* Contenido HTML sanitizado */}
          <div
            className="prose prose-lg max-w-none
                       prose-headings:font-display prose-headings:font-bold
                       prose-p:text-gray-600 prose-p:leading-relaxed
                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </motion.article>
      </div>
    </div>
  )
}
