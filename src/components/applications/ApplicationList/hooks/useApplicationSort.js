import { useState, useCallback } from 'react'
import { sortApplications, DEFAULT_SORT_CONFIG, SORT_CONFIGS } from '../utils/sortingUtils'

export function useApplicationSort() {
    // Initialize with the default sort config (created_at desc)
    const [sortConfig, setSortConfig] = useState(DEFAULT_SORT_CONFIG)
  
    const handleSort = useCallback((key) => {
      setSortConfig(current => ({
        key,
        direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
      }))
    }, [])
  
    // Use the utility function for sorting
    const sortApplicationsList = useCallback((applications) => {
      return sortApplications(applications, sortConfig)
    }, [sortConfig])
  
    return {
      sortConfig,
      handleSort,
      sortApplications: sortApplicationsList,
      // Export commonly used sort configurations
      sortConfigs: SORT_CONFIGS
    }
  }