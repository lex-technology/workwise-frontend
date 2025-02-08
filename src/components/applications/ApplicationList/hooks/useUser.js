// hooks/useUser.js
import { useAuth } from '@/components/auth/AuthContext'

export function useUser() {
  const { user, userProfile } = useAuth()
  
  return {
    user,
    profile: userProfile,
    isAuthenticated: !!user,
    isPaidUser: userProfile?.is_paid_user || false,
    remainingCredits: userProfile?.remaining_ai_credits || 0,
    subscriptionStatus: userProfile?.subscription_status || 'free',
    // Add more derived state as needed
  }
}