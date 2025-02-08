import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { toast } from "sonner"

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function useCoverLetter(resumeId) {
  const [coverLetterData, setCoverLetterData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { getToken } = useAuth()

  const getCacheKey = (id) => `cover_letter_${id}`

  const getCachedData = () => {
    try {
      const cachedString = sessionStorage.getItem(getCacheKey(resumeId))
      if (!cachedString) return null

      const cached = JSON.parse(cachedString)
      
      // Check if cache is expired
      if (cached.timestamp && Date.now() - cached.timestamp > CACHE_DURATION) {
        console.log('🕒 Cache expired, removing old data')
        sessionStorage.removeItem(getCacheKey(resumeId))
        return null
      }

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
      sessionStorage.setItem(getCacheKey(resumeId), JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }

  const fetchCoverLetter = async (skipCache = false) => {
    if (!resumeId) {
      console.log('🔍 No resume ID provided for cover letter')
      setIsLoading(false)
      return
    }

    console.log('🔄 Starting fetch process for cover letter of resume:', resumeId)

    try {
      // Check cache first if not skipping
      if (!skipCache) {
        const cachedData = getCachedData()
        if (cachedData) {
          console.log('✅ Found valid cached cover letter data')
          setCoverLetterData(cachedData)
          setIsLoading(false)
          return
        }
      }

      console.log(skipCache ? '🔄 Forced refresh - Making API call' : '❌ No valid cache - Making API call')

      const token = getToken()
      if (!token) throw new Error('No token available')

      const response = await fetch(`http://localhost:8000/api/get-cover-letter/${resumeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch cover letter data')

      const data = await response.json()
      console.log('📥 Received cover letter data from API')

      // Cache the new data
      setCachedData(data)
      
      setCoverLetterData(data)
      setIsError(false)
      console.log('✅ Cover letter data successfully cached and set')

    } catch (error) {
      console.error('❌ Error in cover letter fetch process:', error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchCoverLetter()
  }, [resumeId])

  // Background refresh
  useEffect(() => {
    if (!resumeId) return

    const backgroundRefresh = async () => {
      try {
        const cachedData = getCachedData()
        if (cachedData?.timestamp) {
          const age = Date.now() - cachedData.timestamp
          if (age > CACHE_DURATION) {
            console.log('🔄 Background refresh triggered')
            await fetchCoverLetter(true)
          }
        }
      } catch (error) {
        console.error('Background refresh error:', error)
      }
    }

    const interval = setInterval(backgroundRefresh, CACHE_DURATION / 2)
    return () => clearInterval(interval)
  }, [resumeId])

  const saveCoverLetter = async (editedLetter) => {
    console.log('🔄 Starting save process for cover letter')
    setIsSaving(true)
    
    try {
      const token = getToken()
      if (!token) throw new Error('No token available')

      const response = await fetch(
        `http://localhost:8000/api/save-cover-letter/${resumeId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ edited_letter: editedLetter })
        }
      )

      if (!response.ok) throw new Error('Failed to save cover letter')

      const savedData = await response.json()

      // Update cache with new data
      const currentCache = getCachedData()
      const updatedData = {
        ...currentCache,
        cover_letter: editedLetter
      }
      setCachedData(updatedData)
      
      setCoverLetterData(updatedData)
      toast.success('Cover letter saved successfully')
      
      return true
    } catch (error) {
      console.error('❌ Error saving cover letter:', error)
      toast.error('Failed to save cover letter')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const refreshData = () => fetchCoverLetter(true)

  return {
    coverLetterData,
    isLoading,
    isError,
    isSaving,
    saveCoverLetter,
    refreshData
  }
}