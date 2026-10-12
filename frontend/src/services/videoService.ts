import api from './api'
import type { Video, PaginatedResponse } from '../types'

export const videoService = {
  async getVideos(params?: { page?: number; limit?: number; category?: string }): Promise<PaginatedResponse<Video>> {
    const { data } = await api.get<PaginatedResponse<Video>>('/videos', { params })
    return data
  },

  async getVideoBySlug(slug: string): Promise<Video> {
    const { data } = await api.get<Video>(`/videos/${slug}`)
    return data
  },

  async createVideo(video: Partial<Video>): Promise<Video> {
    const { data } = await api.post<Video>('/videos', video)
    return data
  },

  async updateVideo(id: string, video: Partial<Video>): Promise<Video> {
    const { data } = await api.put<Video>(`/videos/${id}`, video)
    return data
  },

  async deleteVideo(id: string): Promise<void> {
    await api.delete(`/videos/${id}`)
  },
}
