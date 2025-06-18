// components/common/CreditGate.js
import { useProfileUpdate } from '@/hooks/useProfileUpdate'
import Link from 'next/link'

export const CreditGate = ({ 
  children, 
  showCredits = true,
  className = "" 
}) => {
  const { remainingCredits, hasCredits } = useProfileUpdate()

  return (
    <div className={className}>
      {showCredits && (
        <div className="text-sm text-gray-600 mb-4">
          Credits remaining: {remainingCredits}
        </div>
      )}
      
      {hasCredits ? (
        children
      ) : (
        <div className="text-center p-4">
          <p className="text-gray-600 mb-4">
            You&apos;ve run out of credits. Upgrade your plan to continue.
          </p>
          <Link 
            href="/pricing" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View Pricing Plans
          </Link>
        </div>
      )}
    </div>
  )
}