import { Link } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'
import type { Article } from '../../types'
import { cn } from '../../utils/cn'

interface ArticleCardProps {
  article: Article
  className?: string
}

export default function ArticleCard({ article, className }: ArticleCardProps) {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <article className={cn('card group cursor-pointer h-full flex flex-col', className)}>
      {/* Imagen */}
      <div className="aspect-video rounded-2xl mb-4 overflow-hidden bg-primary-50 flex-shrink-0">
        {article.coverUrl ? (
          <img
            src={article.coverUrl}
            alt={`Imagen del artículo: ${article.title}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📚</div>
        )}
      </div>

      {/* Categoría */}
      {article.category && (
        <span className="inline-block text-xs font-display font-bold text-primary bg-primary-50 
                         px-3 py-1 rounded-full mb-3 self-start">
          {article.category}
        </span>
      )}

      {/* Título */}
      <h3 className="font-display font-bold text-dark text-lg leading-snug mb-2 flex-1">
        <Link
          to={`/articulos/${article.slug}`}
          className="hover:text-primary transition-colors line-clamp-3"
        >
          {article.title}
        </Link>
      </h3>

      {/* Extracto */}
      {article.excerpt && (
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-gray-400 text-xs mt-auto pt-3 border-t border-gray-100">
        {article.author && (
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" aria-hidden="true" />
            {article.author.fullName}
          </span>
        )}
        {formattedDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {formattedDate}
          </span>
        )}
      </div>
    </article>
  )
}
