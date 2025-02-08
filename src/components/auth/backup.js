'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleTokenExpiration = () => {
    console.log('Token expired, logging out user')
    setUser(null)
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    toast.error('Your session has expired. Please log in again.')
    router.push('/auth')
  }

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token)
      console.log('Token validation:', {
        exp: new Date(decoded.exp * 1000),
        isValid: decoded.exp * 1000 > Date.now()
      })
      const isValid = decoded.exp * 1000 > Date.now()
      if (!isValid) {
        handleTokenExpiration()
      }
      return isValid
    } catch (error) {
      console.error('Token validation failed:', error)
      handleTokenExpiration()
      return false
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication state...')
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token')
      console.log('Found token:', token ? 'Yes' : 'No')
      
      if (token && isTokenValid(token)) {
        try {
          const userData = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'))
          console.log('Restored user data:', userData)
          if (userData) {
            setUser(userData)
          }
        } catch (error) {
          console.error('Error restoring auth state:', error)
          sessionStorage.removeItem('auth_token')
          sessionStorage.removeItem('user')
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
        }
      } else {
        console.log('No valid token found, clearing storage')
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('user')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password, rememberMe = false) => {
    console.log('Login attempt:', { email, rememberMe })
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      console.log('Login response status:', response.status)
      
      if (!response.ok) {
        const error = await response.json()
        console.error('Login failed:', error)
        throw new Error(error.detail)
      }

      const data = await response.json()
      console.log('Login response data:', data)
      
      // Create a user object with the ID
      const userData = {
        id: data.user_id,  // Store the user_id as id
        email,
        access_token: data.access_token
      }
      
      // Set user state and storage with the complete user object
      setUser(userData)
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('auth_token', data.access_token)
      storage.setItem('user', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const signup = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail)
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    // Clear both storages
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const getToken = () => {
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token')
    console.log('Getting token:', token ? 'Token found' : 'No token')
    if (token && !isTokenValid(token)) {
      handleTokenExpiration()
      return null
    }
    return token
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, getToken }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 