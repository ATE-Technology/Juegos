import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Article } from './entities/article.entity'

@Injectable()
export class ArticlesService {
  constructor(@InjectRepository(Article) private repo: Repository<Article>) {}

  async findAll(query: { page?: number; limit?: number; category?: string }) {
    const { page = 1, limit = 9, category } = query
    const where: Record<string, unknown> = { isPublished: true }
    if (category) where['category'] = category

    const [articles, total] = await this.repo.findAndCount({
      where,
      relations: ['author'],
      take: limit,
      skip: (page - 1) * limit,
      order: { publishedAt: 'DESC' },
    })

    return { data: articles, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findBySlug(slug: string) {
    const article = await this.repo.findOne({ where: { slug, isPublished: true }, relations: ['author'] })
    if (!article) throw new NotFoundException('Artículo no encontrado')
    return article
  }

  async create(data: Partial<Article>) {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date()
    }
    return this.repo.save(this.repo.create(data))
  }

  async update(id: string, data: Partial<Article>) {
    const article = await this.repo.findOne({ where: { id } })
    if (!article) throw new NotFoundException()
    if (data.isPublished && !article.publishedAt && !data.publishedAt) {
      data.publishedAt = new Date()
    }
    return this.repo.save(Object.assign(article, data))
  }

  async delete(id: string) {
    const article = await this.repo.findOne({ where: { id } })
    if (!article) throw new NotFoundException()
    await this.repo.remove(article)
  }
}
