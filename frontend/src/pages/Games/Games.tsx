import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Filter, Gamepad2 } from 'lucide-react'
import { gameService } from '../../services/gameService'
import GameCard from '../../components/games/GameCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { primeNumbersGame } from '../../data/localGames'

const categories = ['Todas', 'Matemáticas', 'Lenguaje', 'Ciencias', 'Sociales', 'Arte', 'Tecnología']
const levels = ['Todos', 'preescolar', 'primaria', 'secundaria']
const levelLabels: Record<string, string> = {
  preescolar: 'Preescolar',
  primaria: 'Primaria',
  secundaria: 'Secundaria',
}

export default function Games() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [level, setLevel] = useState('Todos')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['games', { page, category: category === 'Todas' ? undefined : category, level: level === 'Todos' ? undefined : level }],
    queryFn: () => gameService.getGames({
      page,
      limit: 9,
      category: category === 'Todas' ? undefined : category,
      level: level === 'Todos' ? undefined : level,
    }),
  })

  const games = [
    ...(data?.data ?? []).filter((game) => game.slug !== primeNumbersGame.slug),
    ...(page === 1 ? [primeNumbersGame] : []),
  ]
  const filteredGames = games.filter((game) => {
    const matchesSearch = search === ''
      || game.title.toLowerCase().includes(search.toLowerCase())
      || game.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'Todas' || game.category === category
    const matchesLevel = level === 'Todos' || game.level === level
    return matchesSearch && matchesCategory && matchesLevel
  })

  return (
    <div className="py-12">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary px-4 py-2 
                          rounded-full text-sm font-display font-bold mb-4">
            <Gamepad2 className="w-4 h-4" />
            Todos los juegos
          </div>
          <h1 className="section-title mb-3">Juegos educativos</h1>
          <p className="section-subtitle mx-auto">
            Juega las demos gratis. Desbloquea el contenido completo con el plan premium.
          </p>
        </motion.div>

        {/* Filtros */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-8 space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar juegos..."
              className="input-field pl-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar juegos"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-sm font-display font-semibold text-gray-500">
              <Filter className="w-4 h-4" /> Categoría:
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1) }}
                  className={`px-4 py-1.5 rounded-full text-sm font-display font-bold transition-all ${
                    category === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary'
                  }`}
                  aria-pressed={category === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-sm font-display font-semibold text-gray-500">
              Nivel:
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por nivel">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => { setLevel(lvl); setPage(1) }}
                  className={`px-4 py-1.5 rounded-full text-sm font-display font-bold transition-all ${
                    level === lvl
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-secondary/10 hover:text-secondary'
                  }`}
                  aria-pressed={level === lvl}
                >
                  {lvl === 'Todos' ? 'Todos los niveles' : levelLabels[lvl]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resultados */}
        {isError && (
          <div className="text-center py-6">
            <p className="text-gray-500">No se pudieron cargar otros juegos. Puedes jugar Matemáticas divertidas mientras tanto.</p>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {filteredGames.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
            <p className="text-xl font-display font-bold text-dark mb-2">No encontramos juegos</p>
            <p className="text-gray-500">Prueba con otros filtros o términos de búsqueda.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">
              Mostrando {filteredGames.length} juego{filteredGames.length !== 1 ? 's' : ''}
              {data?.total && data.total > filteredGames.length ? ` de ${data.total}` : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>

            {/* Paginación */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-outline px-5 py-2.5 text-sm disabled:opacity-40"
                  aria-label="Página anterior"
                >
                  ← Anterior
                </button>
                <span className="font-display font-bold text-dark">
                  Página {page} de {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="btn-outline px-5 py-2.5 text-sm disabled:opacity-40"
                  aria-label="Página siguiente"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
