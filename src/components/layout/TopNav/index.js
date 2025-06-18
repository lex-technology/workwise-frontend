'use client'
import { useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, User, DollarSign, HeadphonesIcon, Menu, X, Settings, CreditCard, LogOut } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'
import ProfileDropdown from './ProfileDropdown'

export default function TopNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setShowProfileMenu(false)
  }

  return (
    <div className="w-full bg-[#2A2B3D] text-white">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <a 
            href="#" 
            onClick={handleLogoClick}
            className="text-lg sm:text-xl font-semibold flex-shrink-0 cursor-pointer"
          >
            WorkWise
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
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
              <Link
                href="/auth"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/auth' ? 'bg-indigo-600' : 'hover:bg-gray-700'
                }`}
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#2A2B3D] border-t border-gray-600">
              <Link
                href="/pricing"
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium hover:bg-gray-700 transition-colors ${
                  pathname === '/pricing' ? 'bg-indigo-600' : ''
                }`}
                onClick={closeMobileMenu}
              >
                <DollarSign size={20} />
                <span>Pricing Plans</span>
              </Link>

              {user && (
                <Link
                  href="/career-coach"
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium hover:bg-gray-700 transition-colors ${
                    pathname === '/career-coach' ? 'bg-indigo-600' : ''
                  }`}
                  onClick={closeMobileMenu}
                >
                  <HeadphonesIcon size={20} />
                  <span>Career Coach</span>
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium hover:bg-gray-700 transition-colors ${
                      pathname === '/dashboard' ? 'bg-indigo-600' : ''
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <FileText size={20} />
                    <span>My Applications</span>
                  </Link>
                  
                  <div className="px-3 py-3 border-t border-gray-600 mt-2">
                    <div className="flex items-center space-x-3 text-gray-300 mb-3">
                      <User size={20} />
                      <div>
                        <div className="text-sm font-medium text-white">{user?.email}</div>
                        <div className="text-xs text-gray-400">Manage your account</div>
                      </div>
                    </div>
                    
                    {/* Mobile Profile Menu Items */}
                    <div className="space-y-2 pl-8">
                      <Link
                        href="/account"
                        className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <Settings size={16} />
                        <span>Account Settings</span>
                      </Link>
                      <Link
                        href="/subscription"
                        className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <CreditCard size={16} />
                        <span>Manage Subscription</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          closeMobileMenu()
                        }}
                        className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth"
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium hover:bg-gray-700 transition-colors ${
                    pathname === '/auth' ? 'bg-indigo-600' : ''
                  }`}
                  onClick={closeMobileMenu}
                >
                  <User size={20} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}