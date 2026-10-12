import api from './api'
import type { Subscription, PremiumRequestData } from '../types'

export const subscriptionService = {
  async getStatus(): Promise<Subscription> {
    const { data } = await api.get<Subscription>('/subscriptions/status')
    return data
  },

  async requestPremium(requestData: PremiumRequestData): Promise<Subscription> {
    const { data } = await api.post<Subscription>('/subscriptions/request', requestData)
    return data
  },

  // Admin
  async activateSubscription(subscriptionId: string): Promise<Subscription> {
    const { data } = await api.put<Subscription>(`/admin/subscriptions/${subscriptionId}/activate`)
    return data
  },

  async getPendingRequests(): Promise<Subscription[]> {
    const { data } = await api.get<Subscription[]>('/admin/subscriptions/pending')
    return data
  },
}
