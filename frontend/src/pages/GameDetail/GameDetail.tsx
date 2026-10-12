import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Star, Maximize2, Minimize2 } from 'lucide-react'
import { gameService } from '../../services/gameService'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../context/SubscriptionContext'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function GameDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useAuth()
  const { isPremium } = useSubscription()
  const [fullscreen, setFullscreen] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [playingFull, setPlayingFull] = useState(false)

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', slug],
    queryFn: () => gameService.getGameBySlug(slug!),
    enabled: !!slug,
  })

  const progressMutation = useMutation({
    mutationFn: (progress: { score?: number; levelReached?: number }) =>
      gameService.updateProgress(game!.id, progress),
  })

  const handlePlayFull = () => {
    if (!isAuthenticated) {
      setShowUpgradeModal(true)
      return
    }
    if (!isPremium) {
      setShowUpgradeModal(true)
      return
    }
    setPlayingFull(true)
    progressMutation.mutate({ levelReached: 1 })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-2xl font-display font-bold text-dark mb-3">Juego no encontrado</h1>
        <Link to="/juegos" className="btn-primary">Ver todos los juegos</Link>
      </div>
    )
  }

  const embedUrl = (playingFull && isPremium && game.embedUrlFull) ? game.embedUrlFull : game.embedUrlDemo
  const canPlayFull = isPremium && !!game.embedUrlFull

  return (
    <div className="py-8">
      <div className="container-main">
        {/* Breadcrumb */}
        <Link
          to="/juegos"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary 
                     transition-colors font-display font-semibold text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a juegos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel del juego */}
          <div className="lg:col-span-2">
            {/* Área del juego */}
            <div className={`bg-dark rounded-3xl overflow-hidden relative ${fullscreen ? 'fixed inset-4 z-50' : ''}`}>
              {embedUrl ? (
                <div className="aspect-video relative">
                  <iframe
                    src={embedUrl}
                    title={game.title}
                    className="w-full h-full border-0"
                    allow="fullscreen; autoplay"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                  />
                  {/* Botón fullscreen */}
                  <button
                    onClick={() => setFullscreen(!fullscreen)}
                    className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white 
                               p-2 rounded-xl transition-colors backdrop-blur-sm"
                    aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                  >
                    {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center text-white/60 gap-4">
                  <div className="text-6xl">🎮</div>
                  <p className="font-display font-semibold">El juego se cargará aquí</p>
                </div>
              )}
            </div>

            {/* Tabs demo / completo */}
            {game.embedUrlFull && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setPlayingFull(false)}
                  className={`flex-1 py-3 px-5 rounded-2xl font-display font-bold text-sm transition-all ${
                    !playingFull ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={!playingFull}
                >
                  🆓 Demo gratuita
                </button>
                <button
                  onClick={handlePlayFull}
                  className={`flex-1 py-3 px-5 rounded-2xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    playingFull && isPremium
                      ? 'bg-accent text-white'
                      : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow'
                  }`}
                  aria-pressed={playingFull && isPremium}
                >
                  {isPremium ? <Star className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {isPremium ? '⭐ Versión completa' : '🔒 Desbloquear versión completa'}
                </button>
              </div>
            )}
          </div>

          {/* Info del juego */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="bg-white rounded-3xl shadow-card p-6">
              {game.coverUrl && (
                <img
                  src={game.coverUrl}
                  alt={`Portada de ${game.title}`}
                  className="w-full aspect-video object-cover rounded-2xl mb-4"
                />
              )}
              <div className="flex items-start gap-2 mb-3">
                <h1 className="text-2xl font-display font-black text-dark flex-1">{game.title}</h1>
                <span className={game.isPremium ? 'badge-premium' : 'badge-free'}>
                  {game.isPremium ? '⭐ PREMIUM' : '🆓 GRATIS'}
                </span>
              </div>

              {game.category && (
                <span className="inline-block bg-primary-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {game.category}
                </span>
              )}

              {game.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{game.description}</p>
              )}

              {!canPlayFull && (
                <div className="bg-gradient-to-br from-primary-50 to-secondary/10 rounded-2xl p-4 border border-primary-100">
                  <p className="font-display font-bold text-dark text-sm mb-2">
                    🔒 Versión completa disponible en Premium
                  </p>
                  <p className="text-gray-600 text-xs mb-3">
                    Accede a la versión completa con más niveles, desafíos y contenido educativo.
                  </p>
                  <Link to="/precios" className="btn-primary w-full text-sm py-2.5">
                    <Star className="w-4 h-4" />
                    Ver planes premium
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal de upgrade */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Contenido Premium"
      >
        <div className="text-center">
          <div className="text-6xl mb-4" aria-hidden="true">⭐</div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {!isAuthenticated
              ? 'Crea una cuenta gratuita y suscríbete al plan premium para acceder a la versión completa de todos los juegos.'
              : 'Actualiza al plan premium para acceder a la versión completa de este y todos los juegos.'
            }
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/precios"
              className="btn-primary w-full"
              onClick={() => setShowUpgradeModal(false)}
            >
              <Star className="w-4 h-4" />
              Ver planes premium
            </Link>
            {!isAuthenticated && (
              <Link
                to="/registro"
                className="btn-outline w-full"
                onClick={() => setShowUpgradeModal(false)}
              >
                Registrarse gratis
              </Link>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
