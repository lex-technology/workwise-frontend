import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function useResumeData(id) {
  const [resumeData, setResumeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const { getToken } = useAuth()

  const getCacheKey = (id) => `resume_${id}`

  const getCachedData = () => {
    try {
      const cachedString = sessionStorage.getItem(getCacheKey(id))
      if (!cachedString) return null

      const cached = JSON.parse(cachedString)
      
      // Check if cache is expired or if there's a force refresh flag
      if (cached.timestamp && (
          Date.now() - cached.timestamp > CACHE_DURATION || 
          sessionStorage.getItem('force_refresh')
      )) {
        console.log('🕒 Cache expired or force refresh requested, removing old data')
        sessionStorage.removeItem(getCacheKey(id))
        sessionStorage.removeItem('force_refresh')
        return null
      }

      console.log('Found cached resume data:', cached.data)
      return cached.data
    } catch (error) {
      console.error('Error reading cache:', error)
      return null
    }
  }

  const setCachedData = (data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      }
      sessionStorage.setItem(getCacheKey(id), JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }

  const parseAISection = (data) => {
    if (typeof data.ai_improved_sections === 'string') {
      try {
        data.ai_improved_sections = JSON.parse(data.ai_improved_sections)
        console.log('🤖 Parsed AI sections successfully')
      } catch (e) {
        console.warn('⚠️ Failed to parse AI sections, using empty object')
        data.ai_improved_sections = {}
      }
    }
    return data
  }

  const fetchResume = async (skipCache = false) => {
    if (!id) {
      console.log('🔍 No resume ID provided')
      setIsLoading(false)
      return
    }

    console.log('🔄 Starting fetch process for resume:', id)

    try {
      // Check cache first if not skipping
      if (!skipCache) {
        const cachedData = getCachedData()
        if (cachedData) {
          console.log('✅ Found valid cached resume data')
          setResumeData(cachedData)
          setIsLoading(false)
          
          // Check if we need to do a background refresh
          if (!cachedData.professional_experience || sessionStorage.getItem('check_updates')) {
            console.log('Background refresh needed');
            sessionStorage.removeItem('check_updates');
            fetchResume(true).catch(console.error);
          }
          return
        }
      }

      console.log(skipCache ? '🔄 Forced refresh - Making API call' : '❌ No valid cache - Making API call')

      const token = getToken()
      if (!token) throw new Error('No token available')

      const startTime = performance.now()
      const response = await fetch(`http://localhost:8000/api/get-resume/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const endTime = performance.now()

      console.log(`⏱️ API call took ${(endTime - startTime).toFixed(2)}ms`)

      if (!response.ok) throw new Error('Failed to fetch resume data')

      const data = await response.json()
      console.log('📥 Received data from API')

      // Parse AI sections and set cache
      const parsedData = parseAISection(data)
      setCachedData(parsedData)
      
      setResumeData(parsedData)
      setIsError(false)
      console.log('✅ Resume data successfully cached and set')

    } catch (error) {
      console.error('❌ Error in fetch process:', error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchResume()
  }, [id])

  // Background refresh
  useEffect(() => {
    if (!id) return

    const backgroundRefresh = async () => {
      try {
        const cachedData = getCachedData()
        if (cachedData?.timestamp) {
          const age = Date.now() - cachedData.timestamp
          if (age > CACHE_DURATION) {
            console.log('🔄 Background refresh triggered')
            await fetchResume(true)
          }
        }
      } catch (error) {
        console.error('Background refresh error:', error)
      }
    }

    const interval = setInterval(backgroundRefresh, CACHE_DURATION / 2)
    return () => clearInterval(interval)
  }, [id])

  const refreshData = () => {
    // Set flag to force a refresh on next data access
    sessionStorage.setItem('force_refresh', 'true');
    return fetchResume(true);
  }

  return {
    resumeData,
    isLoading,
    isError,
    refreshData
  }
}