import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Gamepad2, Sparkles } from 'lucide-react'
import { localGames } from '../../data/localGames'

interface LocalGameDetailProps {
  slug: string
}

export default function LocalGameDetail({ slug }: LocalGameDetailProps) {
  const selectedGame = localGames.find((game) => game.slug === slug)

  if (!selectedGame) {
    return (
      <div className="container-main py-12 text-center">
        <h1 className="text-2xl font-display font-black text-dark mb-3">Juego no encontrado</h1>
        <Link to="/juegos" className="btn-primary">Ver todos los juegos</Link>
      </div>
    )
  }

  return (
    <div className="py-4 sm:py-6">
      <div className="container-main">
        <Link
          to="/juegos"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary
                     transition-colors font-display font-semibold text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a juegos
        </Link>

        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-display font-black text-dark mb-2">
            {selectedGame.title}
          </h1>
          <p className="text-gray-600">{selectedGame.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-5 items-start">
          <aside className="rounded-3xl bg-white shadow-card p-5" aria-labelledby="available-games-title">
            <div className="flex items-center gap-2 mb-1">
              <Gamepad2 className="w-5 h-5 text-primary" aria-hidden="true" />
              <h2 id="available-games-title" className="font-display font-black text-dark">
                Juegos disponibles
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Selecciona un juego para comenzar.
            </p>

            <nav aria-label="Seleccionar juego">
              <ul className="space-y-2">
                {localGames.map((game) => {
                  const isSelected = game.slug === selectedGame.slug

                  return (
                    <li key={game.id}>
                      <Link
                        to={`/juegos/${game.slug}`}
                        aria-current={isSelected ? 'page' : undefined}
                        className={`flex items-start gap-3 rounded-2xl border p-3 transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary-50 text-primary'
                            : 'border-gray-100 text-dark hover:border-primary/40 hover:bg-primary-50'
                        }`}
                      >
                        <span className="text-xl" aria-hidden="true">🧮</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display font-bold leading-snug">{game.title}</span>
                          <span className="mt-1 block text-xs text-gray-500">
                            {game.category} · {game.level}
                          </span>
                        </span>
                        {isSelected && <Check className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary/10 p-3 text-sm text-gray-600">
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" aria-hidden="true" />
              <p>Estos juegos están disponibles gratis. Se añadirán más a medida que se integren.</p>
            </div>
          </aside>

          <div className="min-w-0 overflow-hidden rounded-3xl bg-dark shadow-xl">
            <iframe
              src={selectedGame.embedUrlDemo}
              title={selectedGame.title}
              className="block h-[min(66vh,760px)] min-h-[420px] w-full border-0"
              allow="fullscreen; autoplay"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
