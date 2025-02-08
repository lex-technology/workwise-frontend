'use client'
import { useAuth } from '@/components/auth/AuthContext'
import { useMemo } from 'react'

export function useApi() {
  const { user } = useAuth()

  const fetchWithAuth = useMemo(() => {
    return async (url, options = {}) => {
      // Get token from storage
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token')
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorJson = JSON.parse(errorText)
          throw new Error(errorJson.detail || `API call failed: ${response.status}`)
        } catch (e) {
          throw new Error(`API call failed: ${response.status} ${errorText}`)
        }
      }

      return response.json()
    }
  }, []) // Removed getToken from dependencies since we're not using it anymore

  return { fetchWithAuth }
}