import api from './api'
import type { ContactFormData } from '../types'

export const contactService = {
  async sendMessage(data: ContactFormData): Promise<void> {
    await api.post('/contact', data)
  },
}
