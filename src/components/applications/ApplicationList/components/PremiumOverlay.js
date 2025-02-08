// components/PremiumOverlay.js
import Link from 'next/link'
import { LockIcon } from 'lucide-react'

export function PremiumOverlay() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100/80 backdrop-blur-[2px]">
      <div className="text-center px-4">
        <LockIcon className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upgrade to Premium
        </h3>
        <p className="text-gray-600 mb-4">
          View all your applications by upgrading to our premium plan
        </p>
        <Link 
          href="/pricing" 
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          View Pricing
        </Link>
      </div>
    </div>
  )
}