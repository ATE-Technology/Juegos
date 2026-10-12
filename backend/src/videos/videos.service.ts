import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Video } from './entities/video.entity'

@Injectable()
export class VideosService {
  constructor(@InjectRepository(Video) private repo: Repository<Video>) {}

  async findAll(query: { page?: number; limit?: number; category?: string }, userRole?: string) {
    const { page = 1, limit = 9, category } = query
    const where: Record<string, unknown> = {}
    if (category) where['category'] = category

    const [videos, total] = await this.repo.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    })

    const sanitized = videos.map(v => {
      if (v.isPremium && userRole !== 'premium' && userRole !== 'admin') {
        return { ...v, embedUrl: undefined }
      }
      return v
    })

    return { data: sanitized, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findBySlug(slug: string, userRole?: string) {
    const video = await this.repo.findOne({ where: { slug } })
    if (!video) throw new NotFoundException('Video no encontrado')
    if (video.isPremium && userRole !== 'premium' && userRole !== 'admin') {
      return { ...video, embedUrl: undefined }
    }
    return video
  }

  async create(data: Partial<Video>) {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
    return this.repo.save(this.repo.create(data))
  }

  async update(id: string, data: Partial<Video>) {
    const video = await this.repo.findOne({ where: { id } })
    if (!video) throw new NotFoundException()
    return this.repo.save(Object.assign(video, data))
  }

  async delete(id: string) {
    const video = await this.repo.findOne({ where: { id } })
    if (!video) throw new NotFoundException()
    await this.repo.remove(video)
  }
}
