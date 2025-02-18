import { useState, useMemo } from 'react'


export function useApplicationFilters(applications = [], isPaidUser = false, maxFreeApplications = 5) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const { filteredApplications, statusCounts, totalCount } = useMemo(() => {
    // First, limit applications for free users
    const limitedApplications = isPaidUser 
      ? applications 
      : applications.slice(0, maxFreeApplications)

    // Calculate status counts for the limited set
    const counts = limitedApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      acc['All'] = (acc['All'] || 0) + 1
      return acc
    }, {})

    // Then apply filters to the limited set
    const filtered = limitedApplications.filter(app => {
      const matchesSearch = 
        app.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role_applied?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Calculate total count from all applications (for teaser)
    const fullFiltered = applications.filter(app => {
      const matchesSearch = 
        app.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role_applied?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return {
      filteredApplications: filtered,
      totalCount: fullFiltered.length, // Total count after filtering all applications
      statusCounts: counts
    }
  }, [applications, searchTerm, statusFilter, isPaidUser, maxFreeApplications])

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredApplications,
    statusCounts,
    totalFilteredCount: totalCount
  }
}