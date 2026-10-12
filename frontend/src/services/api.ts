import axios from 'axios'
import type { AxiosError } from 'axios'
import type { ApiError } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Instancia principal de Axios
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // necesario para que las cookies HttpOnly (refresh token) se envíen
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token de acceso en memoria (no en localStorage por seguridad XSS)
let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

// Interceptor de request: agrega el access token a cada petición
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Interceptor de response: renueva el token automáticamente si expira (401)
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (reason: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers!.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await api.post<{ accessToken: string }>('/auth/refresh')
        const newToken = response.data.accessToken
        setAccessToken(newToken)
        processQueue(null, newToken)
        originalRequest.headers!.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        setAccessToken(null)
        // Redirigir al login si el refresh también falla
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
