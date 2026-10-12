import api from './api'
import type { Article, PaginatedResponse } from '../types'

export const articleService = {
  async getArticles(params?: { page?: number; limit?: number; category?: string }): Promise<PaginatedResponse<Article>> {
    const { data } = await api.get<PaginatedResponse<Article>>('/articles', { params })
    return data
  },

  async getArticleBySlug(slug: string): Promise<Article> {
    const { data } = await api.get<Article>(`/articles/${slug}`)
    return data
  },

  async createArticle(article: Partial<Article>): Promise<Article> {
    const { data } = await api.post<Article>('/articles', article)
    return data
  },

  async updateArticle(id: string, article: Partial<Article>): Promise<Article> {
    const { data } = await api.put<Article>(`/articles/${id}`, article)
    return data
  },

  async deleteArticle(id: string): Promise<void> {
    await api.delete(`/articles/${id}`)
  },
}
