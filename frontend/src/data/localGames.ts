import type { Game } from '../types'

export const primeNumbersGame: Game = {
  id: 'local-prime-numbers-jungle',
  title: 'Matemáticas divertidas',
  slug: 'matematicas-divertidas',
  description: 'Explora la selva, resuelve desafíos y aprende sobre los números primos.',
  category: 'Matemáticas',
  level: 'primaria',
  coverUrl: '',
  embedUrlDemo: '/games/numeros-primos/index.html',
  isActive: true,
  isPremium: false,
  createdAt: '',
}

export const localGames = [primeNumbersGame]
