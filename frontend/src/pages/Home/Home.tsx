import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Gamepad2, Video, BookOpen, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { gameService } from '../../services/gameService'
import { articleService } from '../../services/articleService'
import GameCard from '../../components/games/GameCard'
import ArticleCard from '../../components/articles/ArticleCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { localGames } from '../../data/localGames'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const floatingEmojis = ['🎮', '🧩', '📚', '🎯', '⭐', '🚀', '🎨', '🦄']

export default function Home() {
  const { data: gamesData, isLoading: gamesLoading } = useQuery({
    queryKey: ['games', { limit: 6 }],
    queryFn: () => gameService.getGames({ limit: 6 }),
  })

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles', { limit: 3 }],
    queryFn: () => articleService.getArticles({ limit: 3 }),
  })

  return (
    <div>
      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section
        className="bg-gradient-hero min-h-[90vh] flex items-center relative overflow-hidden"
        aria-label="Bienvenida"
      >
        {/* Emojis flotantes decorativos */}
        {floatingEmojis.map((emoji, i) => (
          <div
            key={i}
            className={`absolute text-4xl opacity-20 select-none pointer-events-none
                        ${i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
            style={{
              left: `${8 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              fontSize: `${2 + (i % 3) * 0.8}rem`,
            }}
            aria-hidden="true"
          >
            {emoji}
          </div>
        ))}

        {/* Círculos decorativos */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" aria-hidden="true" />

        <div className="container-main relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 
                         rounded-full text-sm font-display font-semibold mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-warning" />
              Aprende jugando — ¡Es gratis!
            </motion.div>

            <motion.h1
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-black text-white leading-tight mb-6"
            >
              Juegos que hacen{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-secondary">
                aprender divertido
              </span>
            </motion.h1>

            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/80 text-xl leading-relaxed mb-8 max-w-2xl"
            >
              Juegos educativos interactivos diseñados por docentes especializados.
              Demos gratuitas para todos y versiones completas para seguir aprendiendo.
            </motion.p>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/juegos" className="btn-primary text-lg px-8 py-4">
                <Gamepad2 className="w-5 h-5" />
                Explorar juegos
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/precios" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-dark">
                <Star className="w-5 h-5" />
                Ver planes
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-8 mt-12"
            >
              {[
                { value: '10+', label: 'Juegos disponibles' },
                { value: 'Gratis', label: 'Demos sin registro' },
                { value: '100%', label: 'Diseñado por docentes' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-display font-black text-white">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── QUÉ ES ESTA PLATAFORMA ────────────────────────────────── */}
      <section className="py-20 bg-white" aria-labelledby="about-title">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary px-4 py-2 
                              rounded-full text-sm font-display font-bold mb-4">
                <BookOpen className="w-4 h-4" />
                Nuestra misión
              </div>
              <h2 id="about-title" className="section-title mb-5">
                Educación que inspira a través del juego
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                Somos una plataforma educativa que cree que aprender debe ser una aventura.
                Combinamos pedagogía especializada con juegos interactivos para que niños
                de preescolar, primaria y secundaria desarrollen habilidades clave mientras se divierten.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Cada juego y recurso está diseñado y curado por nuestra docente especialista,
                garantizando contenido pedagógicamente valioso y alineado con los estándares educativos colombianos.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🎓', title: 'Pedagógico', desc: 'Contenido creado por docentes' },
                  { icon: '🆓', title: 'Demos gratis', desc: 'Sin necesidad de registro' },
                  { icon: '🔒', title: 'Seguro', desc: 'Ambiente protegido para niños' },
                  { icon: '📱', title: 'En cualquier dispositivo', desc: 'Móvil, tablet y PC' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4 rounded-2xl bg-light">
                    <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                    <div>
                      <p className="font-display font-bold text-dark text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary/20 
                              rounded-4xl flex items-center justify-center">
                <span className="text-[160px]" aria-hidden="true">🎓</span>
              </div>
              {/* Badges decorativas */}
              <div className="absolute -top-4 -right-4 bg-warning text-dark font-display font-black 
                              px-4 py-2 rounded-2xl shadow-lg text-sm rotate-3">
                ¡Gratis para empezar!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white font-display font-black 
                              px-4 py-2 rounded-2xl shadow-lg text-sm -rotate-2">
                +10 juegos 🎮
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── JUEGOS DESTACADOS ─────────────────────────────────────── */}
      <section className="py-20 bg-light" aria-labelledby="games-title">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="games-title" className="section-title">Juegos destacados</h2>
              <p className="section-subtitle">
                Explora nuestros juegos educativos. Todos tienen demo gratuita.
              </p>
            </div>
            <Link to="/juegos" className="btn-outline flex-shrink-0">
              Ver todos los juegos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {gamesLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          )}
          {gamesData?.data && gamesData.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {localGames.map((game) => <GameCard key={game.id} game={game} />)}
              {gamesData.data.map((game, i) => (
                !localGames.some((localGame) => localGame.slug === game.slug) && (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                )
              ))}
            </div>
          ) : (
            /* Estado vacío — útil durante desarrollo antes de tener datos reales */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {localGames.map((game) => <GameCard key={game.id} game={game} />)}
              {[
                { emoji: '📖', title: 'Lectura Aventurera', category: 'Lenguaje', level: 'preescolar', premium: false },
                { emoji: '🔬', title: 'Ciencias Exploradora', category: 'Ciencias', level: 'primaria', premium: true },
                { emoji: '🌍', title: 'Historia del Mundo', category: 'Sociales', level: 'secundaria', premium: true },
                { emoji: '🎨', title: 'Arte Creativo', category: 'Arte', level: 'preescolar', premium: false },
                { emoji: '💻', title: 'Coding para Niños', category: 'Tecnología', level: 'primaria', premium: true },
              ].map((demo, i) => (
                <motion.div
                  key={demo.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card group cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary/20 
                                  rounded-2xl mb-4 flex items-center justify-center text-6xl
                                  group-hover:scale-105 transition-transform duration-300">
                    {demo.emoji}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-dark">{demo.title}</h3>
                    <span className={demo.premium ? 'badge-premium' : 'badge-free'}>
                      {demo.premium ? '⭐ PREMIUM' : '🆓 GRATIS'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{demo.category} · {demo.level}</p>
                  <Link to="/juegos" className="btn-primary w-full text-sm py-2.5">
                    <Gamepad2 className="w-4 h-4" /> Jugar demo
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ARTÍCULOS RECIENTES ───────────────────────────────────── */}
      <section className="py-20 bg-white" aria-labelledby="articles-title">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="articles-title" className="section-title">Artículos para padres y estudiantes</h2>
              <p className="section-subtitle">
                Guías, consejos y recursos para apoyar el aprendizaje en casa.
              </p>
            </div>
            <Link to="/articulos" className="btn-outline flex-shrink-0">
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : articlesData?.data && articlesData.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articlesData.data.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { emoji: '📚', title: 'Cómo apoyar el aprendizaje en casa', category: 'Para padres', date: 'Julio 2026' },
                { emoji: '🧠', title: 'Beneficios del juego en el desarrollo cognitivo', category: 'Educación', date: 'Julio 2026' },
                { emoji: '🎯', title: 'Rutinas de estudio efectivas para niños', category: 'Para padres', date: 'Agosto 2026' },
              ].map((demo, i) => (
                <motion.div
                  key={demo.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card group cursor-pointer"
                >
                  <div className="h-40 bg-gradient-to-br from-primary-50 to-secondary/10 rounded-2xl 
                                  mb-4 flex items-center justify-center text-5xl
                                  group-hover:scale-105 transition-transform duration-300">
                    {demo.emoji}
                  </div>
                  <span className="text-xs font-display font-bold text-primary bg-primary-50 
                                   px-3 py-1 rounded-full">{demo.category}</span>
                  <h3 className="font-display font-bold text-dark mt-3 mb-2 leading-snug">{demo.title}</h3>
                  <p className="text-gray-400 text-xs">{demo.date}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BLOQUE CTA PREMIUM ───────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary" aria-labelledby="cta-title">
        <div className="container-main text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4" aria-hidden="true">⭐</div>
            <h2 id="cta-title" className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              ¿Listo para desbloquear todo el contenido?
            </h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-8">
              Accede a los juegos completos, todos los videos y contenido exclusivo
              con nuestro plan premium.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/precios" className="bg-white text-primary font-display font-black 
                                             px-8 py-4 rounded-2xl text-lg hover:bg-white/90 
                                             transition-all hover:-translate-y-0.5 shadow-lg">
                <Star className="w-5 h-5 inline mr-2" />
                Ver planes premium
              </Link>
              <Link to="/juegos" className="text-white font-display font-bold px-8 py-4 
                                            rounded-2xl border-2 border-white/50 hover:bg-white/10 
                                            transition-all text-lg flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Probar demos gratis
              </Link>
            </div>
            <p className="text-white/60 text-sm mt-6">
              Sin tarjeta de crédito requerida para las demos · Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── VIDEOS SECTION ─────────────────────────────────────────── */}
      <section className="py-20 bg-light" aria-labelledby="videos-title">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="videos-title" className="section-title">Videos educativos</h2>
              <p className="section-subtitle">
                Aprende con videos cortos y dinámicos sobre distintas materias.
              </p>
            </div>
            <Link to="/videos" className="btn-outline flex-shrink-0">
              Ver todos los videos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🎬', title: 'Introducción a las fracciones', category: 'Matemáticas', premium: false },
              { emoji: '🌿', title: 'El ciclo del agua explicado', category: 'Ciencias', premium: false },
              { emoji: '🏛️', title: 'Historia de Colombia para niños', category: 'Sociales', premium: true },
            ].map((video, i) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group cursor-pointer"
              >
                <div className="aspect-video bg-dark/90 rounded-2xl mb-4 relative overflow-hidden
                                flex items-center justify-center
                                group-hover:scale-105 transition-transform duration-300">
                  <span className="text-5xl" aria-hidden="true">{video.emoji}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-primary font-bold mb-1">{video.category}</p>
                    <h3 className="font-display font-bold text-dark leading-snug">{video.title}</h3>
                  </div>
                  <span className={video.premium ? 'badge-premium' : 'badge-free'}>
                    {video.premium ? '⭐' : '🆓'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
