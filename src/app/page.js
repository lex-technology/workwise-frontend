// 'use client'
// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/components/auth/AuthContext'

// export default function Home() {
//   const router = useRouter()
//   const { user } = useAuth()

//   useEffect(() => {
//     if (!user) {
//       router.push('/auth')
//     } else {
//       router.push('/dashboard')
//     }
//   }, [user, router])

//   return null
// }

'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import LandingPage from '@/components/landing/LandingPage'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return !user ? <LandingPage /> : null
}