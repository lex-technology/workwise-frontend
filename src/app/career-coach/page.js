'use client'

import { useAuth } from '@/components/auth/AuthContext'
import CareerCoach from '@/components/career_coach'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CareerCoachPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('CareerCoachPage mounted')
    console.log('User state:', user)
  }, [user])

  if (typeof window !== 'undefined' && !user) {
    console.log('Redirecting to auth...')
    router.push('/auth?redirect=/career-coach')
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <CareerCoach />
      </div>
    </div>
  )
}