'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, BookOpen, User, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#00FFFF] text-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            Job Application Assistant
          </Link>
          <div className="flex items-center space-x-6">
            <div className="flex space-x-4">
              <Link 
                href="/" 
                className={`flex items-center space-x-1 hover:text-gray-600 transition-colors
                  ${pathname === '/' ? 'text-gray-900 font-semibold' : ''}`}
              >
                <FileText size={20} />
                <span>Applications</span>
              </Link>
              <Link 
                href="/resources" 
                className={`flex items-center space-x-1 hover:text-gray-600 transition-colors
                  ${pathname === '/resources' ? 'text-gray-900 font-semibold' : ''}`}
              >
                <BookOpen size={20} />
                <span>Resources</span>
              </Link>
              <Link 
                href="/profile" 
                className={`flex items-center space-x-1 hover:text-gray-600 transition-colors
                  ${pathname === '/profile' ? 'text-gray-900 font-semibold' : ''}`}
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
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
        </div>
      </div>
    </nav>
  )
}