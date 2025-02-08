import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  
  // List of public paths that don't require authentication
  const publicPaths = ['/auth', '/auth/login', '/auth/signup']
  
  // Check if the requested path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Redirect to login if accessing private route without token
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Redirect to dashboard if accessing auth pages with token
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /icons (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|fonts|icons|[\\w-]+\\.\\w+).*)',
  ],
}