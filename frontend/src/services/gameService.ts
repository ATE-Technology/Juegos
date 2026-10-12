import api from './api'
import type { Game, GameProgress, PaginatedResponse } from '../types'

interface GamesParams {
  page?: number
  limit?: number
  category?: string
  level?: string
  search?: string
}

export const gameService = {
  async getGames(params?: GamesParams): Promise<PaginatedResponse<Game>> {
    const { data } = await api.get<PaginatedResponse<Game>>('/games', { params })
    return data
  },

  async getGameBySlug(slug: string): Promise<Game> {
    const { data } = await api.get<Game>(`/games/${slug}`)
    return data
  },

  async getProgress(gameId: string): Promise<GameProgress> {
    const { data } = await api.get<GameProgress>(`/games/${gameId}/progress`)
    return data
  },

  async updateProgress(gameId: string, progress: Partial<GameProgress>): Promise<GameProgress> {
    const { data } = await api.put<GameProgress>(`/games/${gameId}/progress`, progress)
    return data
  },

  // Admin
  async createGame(game: Partial<Game>): Promise<Game> {
    const { data } = await api.post<Game>('/games', game)
    return data
  },

  async updateGame(id: string, game: Partial<Game>): Promise<Game> {
    const { data } = await api.put<Game>(`/games/${id}`, game)
    return data
  },

  async deleteGame(id: string): Promise<void> {
    await api.delete(`/games/${id}`)
  },
}
