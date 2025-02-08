'use client'
import { useAuth } from '@/components/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ApplicationList from '@/components/applications/ApplicationList'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ApplicationList />
    </div>
  )
} 