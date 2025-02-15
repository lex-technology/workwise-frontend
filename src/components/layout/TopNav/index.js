'use client'
import { useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, User, DollarSign, HeadphonesIcon } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'
import ProfileDropdown from './ProfileDropdown'

export default function TopNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const buttonRef = useRef(null)

  // TODO: Replace with actual API call
  const subscriptionStatus = {
    isPaid: true,
    credits: 100,
    plan: 'Pro'
  }

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    router.push(user ? '/dashboard' : '/')
  }

  return (
    <div className="w-full bg-[#2A2B3D] text-white h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <a 
            href="#" 
            onClick={handleLogoClick}
            className="text-xl font-semibold cursor-pointer"
          >
            WorkWise
          </a>

          <div className="flex items-center space-x-4">
            {/* Always visible navigation items */}
            <Link
              href="/pricing"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/pricing' ? 'bg-indigo-600' : 'hover:bg-gray-700'
              }`}
            >
              <DollarSign size={18} />
              <span>Pricing Plans</span>
            </Link>

            {user && (
              <Link
                href="/career-coach"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/career-coach' ? 'bg-indigo-600' : 'hover:bg-gray-700'
                }`}
              >
                <HeadphonesIcon size={18} />
                <span>Career Coach</span>
              </Link>
            )}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard' ? 'bg-indigo-600' : 'hover:bg-gray-700'
                  }`}
                >
                  <FileText size={18} />
                  <span>My Applications</span>
                </Link>
                
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={handleProfileClick}
                    onMouseEnter={() => setShowProfileMenu(true)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/profile' || showProfileMenu ? 'bg-indigo-600' : 'hover:bg-gray-700'
                    }`}
                  >
                    <User size={18} />
                  </button>

                  {showProfileMenu && (
                    <ProfileDropdown
                      user={user}
                      showProfileMenu={showProfileMenu}
                      setShowProfileMenu={setShowProfileMenu}
                      subscriptionStatus={subscriptionStatus}
                      buttonRef={buttonRef}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/auth' ? 'bg-indigo-600' : 'hover:bg-gray-700'
                  }`}
                >
                  <User size={18} />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}