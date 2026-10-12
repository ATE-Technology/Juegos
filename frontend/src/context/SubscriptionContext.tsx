import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from './AuthContext'
import { subscriptionService } from '../services/subscriptionService'
import type { Subscription } from '../types'

interface SubscriptionContextType {
  subscription: Subscription | null
  isPremium: boolean
  isLoading: boolean
  refetch: () => void
}

export const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isPremium: false,
  isLoading: false,
  refetch: () => {},
})

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext)
  const [isPremium, setIsPremium] = useState(false)

  const { data: subscription, isLoading, refetch } = useQuery({
    queryKey: ['subscription', auth?.user?.id],
    queryFn: subscriptionService.getStatus,
    enabled: !!auth?.user,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })

  useEffect(() => {
    if (auth?.user?.role === 'premium' || auth?.user?.role === 'admin') {
      setIsPremium(true)
    } else if (subscription?.status === 'active') {
      setIsPremium(true)
    } else {
      setIsPremium(false)
    }
  }, [auth?.user, subscription])

  return (
    <SubscriptionContext.Provider value={{
      subscription: subscription ?? null,
      isPremium,
      isLoading,
      refetch,
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}
