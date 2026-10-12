import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Game } from './entities/game.entity'
import { GameProgress } from './entities/game-progress.entity'

interface GamesQuery {
  page?: number
  limit?: number
  category?: string
  level?: string
  search?: string
}

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gamesRepo: Repository<Game>,
    @InjectRepository(GameProgress) private progressRepo: Repository<GameProgress>,
  ) {}

  async findAll(query: GamesQuery, userRole?: string) {
    const { page = 1, limit = 9, category, level, search } = query
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { isActive: true }
    if (category) where['category'] = category
    if (level) where['level'] = level
    if (search) where['title'] = Like(`%${search}%`)

    const [games, total] = await this.gamesRepo.findAndCount({
      where,
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    })

    // Ocultar embedUrlFull para usuarios no premium
    const sanitized = games.map(game => {
      if (game.isPremium && userRole !== 'premium' && userRole !== 'admin') {
        return { ...game, embedUrlFull: undefined }
      }
      return game
    })

    return {
      data: sanitized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findBySlug(slug: string, userRole?: string) {
    const game = await this.gamesRepo.findOne({ where: { slug, isActive: true } })
    if (!game) throw new NotFoundException('Juego no encontrado')

    if (game.isPremium && userRole !== 'premium' && userRole !== 'admin') {
      return { ...game, embedUrlFull: undefined }
    }

    return game
  }

  async getProgress(gameId: string, userId: string) {
    const progress = await this.progressRepo.findOne({ where: { gameId, userId } })
    return progress ?? { gameId, userId, score: 0, levelReached: 0, playTimeSeconds: 0 }
  }

  async updateProgress(gameId: string, userId: string, data: Partial<GameProgress>) {
    let progress = await this.progressRepo.findOne({ where: { gameId, userId } })

    if (!progress) {
      progress = this.progressRepo.create({ gameId, userId, ...data })
    } else {
      Object.assign(progress, data)
    }

    return this.progressRepo.save(progress)
  }

  async create(data: Partial<Game>) {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
    const game = this.gamesRepo.create(data)
    return this.gamesRepo.save(game)
  }

  async update(id: string, data: Partial<Game>) {
    const game = await this.gamesRepo.findOne({ where: { id } })
    if (!game) throw new NotFoundException()
    Object.assign(game, data)
    return this.gamesRepo.save(game)
  }

  async delete(id: string) {
    const game = await this.gamesRepo.findOne({ where: { id } })
    if (!game) throw new NotFoundException()
    await this.gamesRepo.remove(game)
  }
}
