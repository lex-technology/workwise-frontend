'use client'
import { useAuth } from '@/components/auth/AuthContext'
import PricingCards from '@/components/pricing'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handlePlanSelect = (planId) => {
    if (!user) {
      router.push('/auth?redirect=/pricing')
      return
    }
    
    // TODO: Implement Stripe checkout
    console.log(`Selected plan: ${planId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose your plan
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Select the perfect plan for your job search journey
          </p>
        </div>
        <PricingCards onPlanSelect={handlePlanSelect} />
      </div>
    </div>
  )
}