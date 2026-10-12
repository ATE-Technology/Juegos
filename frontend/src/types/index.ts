// ── Usuarios ──────────────────────────────────────────────────────────────────

export type UserRole = 'free' | 'premium' | 'admin'
export type ProfileType = 'parent' | 'student' | 'teacher'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  profileType: ProfileType
  avatarUrl?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// ── Suscripciones ─────────────────────────────────────────────────────────────

export type SubscriptionPlan = 'monthly' | 'annual'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending'

export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startedAt: string
  expiresAt: string
  paymentRef?: string
}

// ── Juegos ────────────────────────────────────────────────────────────────────

export interface Game {
  id: string
  title: string
  slug: string
  description: string
  category: string
  level: 'preescolar' | 'primaria' | 'secundaria'
  coverUrl: string
  embedUrlDemo: string
  embedUrlFull?: string // solo para usuarios premium
  isActive: boolean
  isPremium: boolean
  createdAt: string
}

export interface GameProgress {
  gameId: string
  score: number
  levelReached: number
  playTimeSeconds: number
  updatedAt: string
}

// ── Videos ────────────────────────────────────────────────────────────────────

export interface Video {
  id: string
  title: string
  slug: string
  description: string
  embedUrl: string
  isPremium: boolean
  category: string
  thumbnailUrl: string
  createdAt: string
}

// ── Artículos ─────────────────────────────────────────────────────────────────

export interface Article {
  id: string
  title: string
  slug: string
  content: string    // HTML sanitizado
  excerpt: string
  coverUrl: string
  category: string
  author: Pick<User, 'id' | 'fullName' | 'avatarUrl'>
  isPublished: boolean
  publishedAt: string
  createdAt: string
}

// ── Formularios ───────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface PremiumRequestData {
  plan: SubscriptionPlan
  paymentMethod: 'cash' | 'nequi' | 'transfer'
  notes?: string
}

// ── API genérico ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
