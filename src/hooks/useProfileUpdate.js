// hooks/useProfileUpdate.js
import { useAuth } from '@/components/auth/AuthContext'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useProfileUpdate = () => {
  const { user, userProfile, supabase } = useAuth()

  const checkCredits = () => {
    if (!userProfile?.remaining_ai_credits || userProfile.remaining_ai_credits <= 0) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return false
    }
    return true
  }

  const refreshProfile = async () => {
    if (!user?.id) return null
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
        
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error refreshing profile:', error)
      return null
    }
  }

  // Monitor credit updates
  useEffect(() => {
    if (userProfile) {
      console.log('Credits updated:', userProfile.remaining_ai_credits)
    }
  }, [userProfile?.remaining_ai_credits])

  return {
    userProfile,
    checkCredits,
    refreshProfile,
    hasCredits: userProfile?.remaining_ai_credits > 0,
    remainingCredits: userProfile?.remaining_ai_credits || 0
  }
}