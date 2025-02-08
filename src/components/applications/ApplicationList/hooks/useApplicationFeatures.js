// hooks/useApplicationFeatures.js
import { useMemo } from 'react'
import { useAuth } from '@/components/auth/AuthContext'

const FREE_TIER_LIMIT = 5

export function useApplicationFeatures(applications = []) {
  const { userProfile } = useAuth()
  const isPaidUser = userProfile?.is_paid_user || false

  const features = useMemo(() => {
    const totalApplications = applications?.length || 0
    
    return {
      // Feature flags
      isPaidUser,
      showPagination: isPaidUser,
      // showOverlay: !isPaidUser && totalApplications > FREE_TIER_LIMIT,
      
      // Application limits
      maxFreeApplications: FREE_TIER_LIMIT,
      currentApplicationCount: totalApplications,
      canCreateApplication: isPaidUser || totalApplications < FREE_TIER_LIMIT,
      remainingFreeSlots: Math.max(0, FREE_TIER_LIMIT - totalApplications),
      
      // Display helpers
      getVisibleApplications: (apps) => {
        if (!apps?.length) return []
        return isPaidUser ? apps : apps.slice(0, FREE_TIER_LIMIT)
      },
      
      // Messages
      getCreateButtonMessage: () => {
        if (isPaidUser) return "Create New Application"
        if (totalApplications >= FREE_TIER_LIMIT) {
          return "Upgrade to Create More Applications"
        }
        return `Create New Application (${FREE_TIER_LIMIT - totalApplications} remaining)`
      },
      
      // Navigation helpers
      getCreateButtonAction: () => {
        if (isPaidUser || totalApplications < FREE_TIER_LIMIT) {
          return '/applications/process'
        }
        return '/pricing'
      }
    }
  }, [isPaidUser, applications])

  return features
}