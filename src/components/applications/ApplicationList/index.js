// components/applications/ApplicationList/index.js
'use client'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Custom Components
import { StatusFilter } from './components/StatusFilter'
import { SearchBar } from './components/SearchBar'
import { PaginationControls } from './components/PaginationControls'
import { ApplicationTable } from './components/ApplicationTable'

// Custom Hooks
import { useApplications } from './hooks/useApplications'
import { useApplicationFilters } from './hooks/useApplicationFilters'
import { useApplicationSort } from './hooks/useApplicationSort'
import { useApplicationFeatures } from './hooks/useApplicationFeatures'
// Constants
const STATUS_OPTIONS = ["All", "Writing CV", "Applied", "Interview", "Rejected", "Accepted"]
const ITEMS_PER_PAGE = 10

export default function ApplicationList() {
  const router = useRouter()
  
  // Initialize our custom hooks for data management
  const {
    applications,
    loading,
    error,
    currentPage,
    showAll,
    setCurrentPage,
    setShowAll,
    debouncedStatusUpdate,
    getPaginatedData,
    handleDateChange
  } = useApplications()

  const {
    isPaidUser,
    showPagination,
    showOverlay,
    canCreateApplication,
    getVisibleApplications,
    getCreateButtonMessage,
    getCreateButtonAction,
    maxFreeApplications
  } = useApplicationFeatures(applications)

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredApplications,
    statusCounts,
    totalFilteredCount
  } = useApplicationFilters(applications, isPaidUser, maxFreeApplications)



//   const { sortConfig, handleSort, sortApplications } = useApplicationSort()


  const { sortConfig, handleSort, sortApplications } = useApplicationSort()

  // Process applications through filters, sorting, and pagination
  const sortedApplications = sortApplications(filteredApplications)
  const displayedApplications = isPaidUser && !showAll 
  ? getPaginatedData(sortedApplications)
  : sortedApplications

    console.log('Pagination Debug:', {
        currentPage,
        showAll,
        isPaidUser,
        showPagination,
        totalApplications: sortedApplications.length,
        filteredLength: filteredApplications.length,
        itemsPerPage: ITEMS_PER_PAGE,
        totalPages: Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)
      })
      
      // Let's also log what happens when page changes
      const handlePageChange = (newPage) => {
        console.log('Page Change:', {
          oldPage: currentPage,
          newPage,
          showAll
        })
        setCurrentPage(newPage)
      }

    // Handle navigation to application details
  const handleViewDetails = (appId) => {
        router.push(`/applications/viewer?id=${appId}`)
    }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Loading applications...</span>
        </div>
      </div>
    )
  }

  console.log({
    applicationsLength: applications.length,
    isPaidUser,
    maxFreeApplications,
    displayedApplicationsLength: displayedApplications.length
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">List of Applications</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track your job applications</p>
        </div>

        {/* Search and Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center gap-4">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <Button 
            onClick={() => router.push(getCreateButtonAction())}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={!canCreateApplication}
            >
            <PlusCircle className="mr-2 h-4 w-4" />
            {getCreateButtonMessage()}
            </Button>
          </div>
          
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <StatusFilter
                key={status}
                status={status}
                currentFilter={statusFilter}
                onChange={setStatusFilter}
                count={statusCounts[status] || 0}
              />
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        ) : (
        <div className="relative bg-white rounded-lg shadow mt-6">

            <ApplicationTable
              applications={displayedApplications}
              totalFilteredCount={totalFilteredCount}
              onStatusChange={debouncedStatusUpdate}
              onDateChange={handleDateChange}
              onViewDetails={handleViewDetails}
              onSort={handleSort}
              STATUS_OPTIONS={STATUS_OPTIONS}
              isPaidUser={isPaidUser}
              maxFreeApplications={maxFreeApplications}
              onPricingClick={() => router.push('/pricing')}
              onCreateClick={() => router.push('/applications/process')}
              statusFilter={statusFilter}
            />
            
            {/* {showOverlay && <PremiumOverlay />} */}
            
            {/* Pagination - Only show for paid users */}
            {isPaidUser && filteredApplications.length > ITEMS_PER_PAGE && (
              <div className="border-t border-gray-200 px-4 py-4">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)}
                  showAll={showAll}
                  onPageChange={(newPage) => {
                    setCurrentPage(newPage)
                    setShowAll(false)  // Reset showAll when changing pages
                    }}
                    onShowAllToggle={() => {
                    setShowAll(!showAll)
                    if (!showAll) {
                        setCurrentPage(1)  // Reset to first page when showing all
                    }
                    }}
                totalItems={filteredApplications.length}
                currentItems={displayedApplications.length}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}