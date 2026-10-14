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

export const divisionsGame: Game = {
  id: 'local-basic-divisions-jungle',
  title: 'Aventura de divisiones',
  slug: 'divisiones',
  description: 'Recorre la selva, supera obstáculos y resuelve divisiones en cinco tableros progresivos.',
  category: 'Matemáticas',
  level: 'primaria',
  coverUrl: '',
  embedUrlDemo: '/games/Divisiones/index.html',
  isActive: true,
  isPremium: false,
  createdAt: '',
}

export const jungleMultiplicationGame: Game = {
  id: 'local-jungle-multiplications',
  title: 'Aventura de multiplicaciones',
  slug: 'multiplicaciones-en-la-selva',
  description: 'Explora la selva, supera obstáculos y practica las tablas de multiplicar en cinco tableros.',
  category: 'Matemáticas',
  level: 'primaria',
  coverUrl: '',
  embedUrlDemo: '/games/multiplicaciones-selva/index.html',
  isActive: true,
  isPremium: false,
  createdAt: '',
}

export const localGames = [primeNumbersGame, divisionsGame, jungleMultiplicationGame]
