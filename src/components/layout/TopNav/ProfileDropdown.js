'use client'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, Settings, CreditCard, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'

export default function ProfileDropdown({ 
  showProfileMenu, 
  setShowProfileMenu, 
  buttonRef 
}) {
  const menuRef = useRef(null)
  const { user, userProfile, logout } = useAuth() 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setShowProfileMenu])

  return (
    <div
      ref={menuRef}
      onMouseLeave={() => !buttonRef.current.contains(document.activeElement) && setShowProfileMenu(false)}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
    >
      {/* User Info Section */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-cyan-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <User size={24} />
          </div>
          <div>
            <div className="font-medium">{userProfile?.full_name || user?.email}</div>
            <div className="text-sm text-white/80">Manage your account</div>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-900">
            {userProfile?.is_paid_user ? 'Pro Plan' : 'Free Plan'}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            userProfile?.is_paid_user 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-200 text-gray-800'
          }`}>
            {userProfile?.subscription_status || 'Free'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Available Credits</div>
          <div className="text-sm font-medium text-indigo-600">
            {userProfile?.remaining_ai_credits || 0} credits
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <Link
          href="/account"
          className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 group"
        >
          <div className="flex items-center">
            <Settings size={16} className="mr-3 group-hover:text-indigo-600" />
            Account Settings
          </div>
          <ChevronRight size={14} className="text-gray-400 group-hover:text-indigo-600" />
        </Link>
        <Link
          href="/subscription"
          className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 group"
        >
          <div className="flex items-center">
            <CreditCard size={16} className="mr-3 group-hover:text-indigo-600" />
            Manage Subscription
          </div>
          <ChevronRight size={14} className="text-gray-400 group-hover:text-indigo-600" />
        </Link>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-100 mt-1">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 group"
        >
          <LogOut size={16} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}