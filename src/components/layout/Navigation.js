'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FileText, BookOpen, User, LogIn, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { href: '/', icon: FileText, label: 'Applications' },
    { href: '/resources', icon: BookOpen, label: 'Resources' },
    { href: '/profile', icon: User, label: 'Profile' }
  ]

  return (
    <nav className="bg-[#00FFFF] text-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl flex-shrink-0">
            <span className="hidden sm:inline">Job Application Assistant</span>
            <span className="sm:hidden">WorkWise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex space-x-4">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link 
                  key={href}
                  href={href} 
                  className={`flex items-center space-x-2 hover:text-gray-600 transition-colors px-3 py-2 rounded-md
                    ${pathname === href ? 'text-gray-900 font-semibold bg-gray-200' : ''}`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
              onClick={() => console.log('Login clicked')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </div>

          {/* Tablet Navigation (Icon + Short Text) */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link 
                key={href}
                href={href} 
                className={`flex items-center space-x-1 hover:text-gray-600 transition-colors px-2 py-2 rounded-md text-sm
                  ${pathname === href ? 'text-gray-900 font-semibold bg-gray-200' : ''}`}
              >
                <Icon size={18} />
                <span className="hidden lg:inline">{label}</span>
                <span className="lg:hidden">{label.split(' ')[0]}</span>
              </Link>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
              onClick={() => console.log('Login clicked')}
            >
              <LogIn className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-200 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#00FFFF] border-t border-gray-300">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium hover:bg-gray-200 transition-colors
                    ${pathname === href ? 'text-gray-900 font-semibold bg-gray-100' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="px-3 py-3">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                  onClick={() => {
                    console.log('Login clicked')
                    closeMobileMenu()
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}