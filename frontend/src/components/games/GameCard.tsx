import { Link } from 'react-router-dom'
import { Gamepad2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Game } from '../../types'
import { cn } from '../../utils/cn'

interface GameCardProps {
  game: Game
  className?: string
}

const levelLabels = {
  preescolar: 'Preescolar',
  primaria: 'Primaria',
  secundaria: 'Secundaria',
}

export default function GameCard({ game, className }: GameCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn('card group', className)}
    >
      {/* Imagen de portada */}
      <div className="aspect-video rounded-2xl mb-4 overflow-hidden relative bg-primary-50">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={`Portada del juego ${game.title}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🎮
          </div>
        )}

        {/* Badge premium/free */}
        <div className="absolute top-3 right-3">
          {game.isPremium ? (
            <span className="badge-premium flex items-center gap-1">
              <Lock className="w-3 h-3" />
              PREMIUM
            </span>
          ) : (
            <span className="badge-free">🆓 GRATIS</span>
          )}
        </div>

        {/* Categoría */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-dark/70 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
            {game.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-bold text-dark text-lg leading-snug line-clamp-2">
          {game.title}
        </h3>
      </div>

      {game.level && (
        <p className="text-gray-500 text-sm mb-3">
          Nivel: <span className="font-semibold">{levelLabels[game.level]}</span>
        </p>
      )}

      {game.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {game.description}
        </p>
      )}

      {/* CTA */}
      <Link
        to={`/juegos/${game.slug}`}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl',
          'font-display font-bold text-sm transition-all duration-200',
          game.isPremium
            ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow hover:-translate-y-0.5'
            : 'bg-primary text-white hover:bg-primary-600 hover:-translate-y-0.5'
        )}
        aria-label={`Jugar ${game.title}`}
      >
        <Gamepad2 className="w-4 h-4" />
        {game.isPremium ? 'Ver juego' : 'Jugar gratis'}
      </Link>
    </motion.article>
  )
}
