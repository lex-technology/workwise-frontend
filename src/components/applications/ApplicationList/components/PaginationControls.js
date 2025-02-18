import { Button } from "@/components/ui/button"


// components/PaginationControls.js
export function PaginationControls({
    currentPage,
    totalPages,
    showAll,
    onPageChange,
    onShowAllToggle,
    totalItems,
    currentItems
  }) {
    return (
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {currentItems} of {totalItems} applications
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            size="sm"
            className="px-4"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || showAll}
            size="sm"
            className="px-4"
          >
            Next
          </Button>
          <Button
            variant="secondary"
            onClick={onShowAllToggle}
            size="sm"
            className="px-4"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </Button>
        </div>
      </div>
    )
  }