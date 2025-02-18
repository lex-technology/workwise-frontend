import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { useApi } from '@/utils/api'
import { cacheService } from '@/utils/cacheService'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import debounce from 'lodash/debounce'

export function useApplications(itemsPerPage = 10) {
  const router = useRouter()
  const { user, getToken } = useAuth()
  const { fetchWithAuth } = useApi()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState({})

  const fetchApplications = useCallback(async () => {
    try {
      if (!user?.id) return

      const token = getToken()
      if (!token) {
        router.push('/auth')
        return
      }

      const cacheKey = cacheService.generateCacheKey(user.id, 'applications')
      const cachedData = cacheService.getCache(cacheKey, token)

      if (cachedData) {
        setApplications(cachedData)
        setLoading(false)
        return
      }

      const data = await fetchWithAuth(`/api/get-all-applications/${user.id}`)
      setApplications(data.applications)
      cacheService.setCache(cacheKey, data.applications, token)
    } catch (err) {
      console.error('Error fetching applications:', err)
      setError('Failed to load applications')
      if (err.message === 'No authentication token available') {
        router.push('/auth')
      }
    } finally {
      setLoading(false)
    }
  }, [user?.id, fetchWithAuth, getToken, router])

  // Rate-limited status update
  const debouncedStatusUpdate = useCallback(
    debounce(async (newStatus, appId) => {
      const now = Date.now()
      const lastUpdate = lastUpdateTime[appId] || 0
      
      if (now - lastUpdate < 2000) {
        toast.error('Please wait before updating again')
        return
      }

      try {
        await fetchWithAuth(`/api/update-application-status/${appId}?status=${newStatus}`, {
          method: 'PUT'
        })
        
        setApplications(apps => 
          apps.map(app => 
            app.id === appId ? { ...app, status: newStatus } : app
          )
        )

        const token = getToken()
        if (token) {
          const cacheKey = cacheService.generateCacheKey(user.id, 'applications')
          cacheService.setCache(cacheKey, applications, token)
        }

        setLastUpdateTime(prev => ({ ...prev, [appId]: now }))
        toast.success('Status updated successfully')
      } catch (error) {
        console.error('Error updating status:', error)
        toast.error('Failed to update status')
      }
    }, 500),
    [fetchWithAuth, getToken, user?.id, applications, lastUpdateTime]
  )

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const getPaginatedData = useCallback((filteredData) => {
    if (showAll) return filteredData
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [currentPage, itemsPerPage, showAll])

  const handleDateChange = useCallback(async (date, appId) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd')
      
      await fetchWithAuth(`/api/update-application-date/${appId}`, {
        method: 'PUT',
        body: JSON.stringify({
          date_applied: formattedDate
        })
      })
  
      // Update applications state and cache atomically
      setApplications(apps => {
        const updatedApps = apps.map(app => 
          app.id === appId 
            ? { 
                ...app, 
                date: formattedDate,
                status: app.status === 'Writing CV' ? 'Applied' : app.status 
              }
            : app
        )
  
        // Update cache with the new state
        const token = getToken()
        if (token) {
          const cacheKey = cacheService.generateCacheKey(user.id, 'applications')
          cacheService.setCache(cacheKey, updatedApps, token)
        }
  
        return updatedApps
      })
  
      toast.success('Application date updated')
    } catch (error) {
      console.error('Error updating date:', error)
      toast.error('Failed to update date')
    }
  }, [fetchWithAuth, getToken, user?.id])

  return {
    applications,
    loading,
    error,
    currentPage,
    showAll,
    setCurrentPage,
    setShowAll,
    debouncedStatusUpdate,
    handleDateChange,
    getPaginatedData,
    fetchApplications
  }
}