import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Video, Lock, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { videoService } from '../../services/videoService'
import { useSubscription } from '../../context/SubscriptionContext'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const categories = ['Todas', 'Matemáticas', 'Lenguaje', 'Ciencias', 'Sociales', 'Arte']

export default function Videos() {
  const [category, setCategory] = useState('Todas')
  const { isPremium } = useSubscription()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['videos', { category: category === 'Todas' ? undefined : category }],
    queryFn: () => videoService.getVideos({ category: category === 'Todas' ? undefined : category }),
  })

  const handlePlay = (videoId: string, isPremiumVideo: boolean) => {
    if (isPremiumVideo && !isPremium) {
      setUpgradeOpen(true)
      return
    }
    setSelectedVideo(videoId)
  }

  return (
    <div className="py-12">
      <div className="container-main">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 
                          rounded-full text-sm font-display font-bold mb-4">
            <Video className="w-4 h-4" />
            Videos educativos
          </div>
          <h1 className="section-title mb-3">Aprende con videos</h1>
          <p className="section-subtitle mx-auto">Videos cortos y dinámicos sobre distintas materias.</p>
        </motion.div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 justify-center mb-10" role="group" aria-label="Filtrar por categoría">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-display font-bold transition-all ${
                category === cat
                  ? 'bg-secondary text-white'
                  : 'bg-white text-gray-600 hover:bg-secondary/10 hover:text-secondary shadow-sm'
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
            <div className="text-6xl mb-4">📹</div>
            <p className="text-xl font-display font-bold text-dark mb-2">Próximamente</p>
            <p className="text-gray-500">Estamos preparando nuevos videos educativos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.data ?? []).map((video, i) => (
              <motion.article
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card group"
              >
                {/* Thumbnail */}
                <button
                  className="w-full aspect-video bg-dark/90 rounded-2xl mb-4 relative overflow-hidden
                             group-hover:scale-[1.02] transition-transform duration-300 block"
                  onClick={() => handlePlay(video.id, video.isPremium)}
                  aria-label={`Reproducir: ${video.title}`}
                >
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🎬</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                      {video.isPremium && !isPremium
                        ? <Lock className="w-6 h-6 text-primary" />
                        : <Play className="w-6 h-6 text-primary ml-1" />
                      }
                    </div>
                  </div>
                  {video.isPremium && (
                    <div className="absolute top-3 right-3">
                      <span className="badge-premium">⭐ PREMIUM</span>
                    </div>
                  )}
                </button>

                <p className="text-xs font-bold text-secondary mb-1">{video.category}</p>
                <h3 className="font-display font-bold text-dark leading-snug mb-3 line-clamp-2">{video.title}</h3>

                <button
                  onClick={() => handlePlay(video.id, video.isPremium)}
                  className={`w-full py-2.5 px-4 rounded-2xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    video.isPremium && !isPremium
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow'
                      : 'bg-primary text-white hover:bg-primary-600'
                  }`}
                >
                  {video.isPremium && !isPremium ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {video.isPremium && !isPremium ? 'Desbloquear' : 'Ver video'}
                </button>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Modal de video */}
      <Modal isOpen={!!selectedVideo} onClose={() => setSelectedVideo(null)} size="xl">
        {selectedVideo && (
          <div className="aspect-video bg-dark rounded-2xl overflow-hidden">
            {(data?.data ?? []).find(v => v.id === selectedVideo)?.embedUrl ? (
              <iframe
                src={(data?.data ?? []).find(v => v.id === selectedVideo)?.embedUrl}
                className="w-full h-full"
                title="Video educativo"
                allow="autoplay; fullscreen"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60">
                <p>Video no disponible</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal upgrade */}
      <Modal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} title="Video Premium">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-600 mb-6">Suscríbete al plan premium para acceder a todos los videos completos.</p>
          <Link to="/precios" className="btn-primary w-full" onClick={() => setUpgradeOpen(false)}>
            Ver planes premium
          </Link>
        </div>
      </Modal>
    </div>
  )
}
