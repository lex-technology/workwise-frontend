// components/PremiumOverlay.js
import Link from 'next/link'
import { LockIcon } from 'lucide-react'

export function PremiumOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-[2px] rounded-lg z-10">
      <div className="text-center px-4 max-w-sm mx-auto">
        <LockIcon className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 mx-auto mb-3" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Upgrade to Premium
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          View all your applications by upgrading to our premium plan
        </p>
        <Link 
          href="/pricing" 
          className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white text-sm sm:text-base rounded-md hover:bg-indigo-700 transition-colors"
        >
          View Pricing
        </Link>
      </div>
    </div>
  )
}