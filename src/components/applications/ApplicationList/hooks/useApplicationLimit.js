// // ApplicationList/hooks/useApplicationLimit.js
// import { useUser } from './useUser'

// export function useApplicationLimit(applications = []) {
//     const { isPaidUser } = useUser()
//     const maxFreeApplications = 5
//     const currentApplicationCount = applications?.length || 0
    
//     const canCreateApplication = isPaidUser || currentApplicationCount < maxFreeApplications
//     const remainingSlots = maxFreeApplications - currentApplicationCount
    
//     return {
//       isPaidUser,
//       maxFreeApplications,
//       currentApplicationCount,
//       canCreateApplication,
//       remainingSlots
//     }
//   }