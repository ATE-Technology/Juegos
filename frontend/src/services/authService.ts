import api, { setAccessToken } from './api'
import type { User } from '../types'
import type { RegisterData } from '../context/AuthContext'

interface LoginResponse {
  user: User
  accessToken: string
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
    setAccessToken(data.accessToken)
    return data.user
  },

  async register(registerData: RegisterData): Promise<User> {
    const { data } = await api.post<LoginResponse>('/auth/register', {
      fullName: registerData.fullName,
      email: registerData.email,
      password: registerData.password,
      profileType: registerData.profileType,
      consentAccepted: registerData.consentAccepted,
    })
    setAccessToken(data.accessToken)
    return data.user
  },

  async logout(): Promise<void> {
    try {
      await api.delete('/auth/logout')
    } finally {
      setAccessToken(null)
    }
  },

  async getMe(): Promise<User> {
    const { data } = await api.post<LoginResponse>('/auth/refresh')
    setAccessToken(data.accessToken)
    const meResponse = await api.get<User>('/auth/me')
    return meResponse.data
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password })
  },
}
