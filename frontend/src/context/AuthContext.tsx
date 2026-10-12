import { createContext, useCallback, useEffect, useReducer } from 'react'
import { authService } from '../services/authService'
import type { User, AuthState } from '../types'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  profileType: 'parent' | 'student' | 'teacher'
  consentAccepted: boolean
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    default:
      return state
  }
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Al montar, intenta recuperar la sesión con el refresh token (cookie HttpOnly)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getMe()
        dispatch({ type: 'SET_USER', payload: user })
      } catch {
        dispatch({ type: 'SET_USER', payload: null })
      }
    }
    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const user = await authService.login(email, password)
      dispatch({ type: 'SET_USER', payload: user })
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const user = await authService.register(data)
      dispatch({ type: 'SET_USER', payload: user })
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    dispatch({ type: 'LOGOUT' })
  }, [])

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', payload: user })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
