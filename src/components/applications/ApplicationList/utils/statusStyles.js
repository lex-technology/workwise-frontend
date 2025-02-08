/**
 * Defines the visual styling for different application statuses.
 * Provides consistent color coding and styling across the application.
 */

// Base styles for status indicators
const BASE_STYLES = {
    text: 'font-medium',
    container: 'rounded-full px-2 py-1',
    transition: 'transition-colors duration-150'
  }
  
  // Color palette for different statuses
  export const STATUS_COLORS = {
    'Writing CV': {
      background: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-200'
    },
    'Applied': {
      background: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-200'
    },
    'Interview': {
      background: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-200'
    },
    'Rejected': {
      background: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      hover: 'hover:bg-red-200'
    },
    'Accepted': {
      background: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      hover: 'hover:bg-green-200'
    }
  }
  
  // Default fallback style for unknown statuses
  const DEFAULT_STYLE = {
    background: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-200'
  }
  
  /**
   * Gets the complete set of Tailwind classes for a given status.
   * Combines base styles with status-specific colors.
   */
  export function getStatusStyle(status, variant = 'default') {
    const statusColor = STATUS_COLORS[status] || DEFAULT_STYLE
    
    switch (variant) {
      case 'badge':
        return `${BASE_STYLES.text} ${BASE_STYLES.container} ${statusColor.background} ${statusColor.text}`
      
      case 'select':
        return `${BASE_STYLES.transition} ${statusColor.background} ${statusColor.text} ${statusColor.hover}`
      
      case 'table':
        return `${BASE_STYLES.text} ${statusColor.text}`
      
      default:
        return `${statusColor.background} ${statusColor.text}`
    }
  }
  
  /**
   * Determines if a status should be highlighted based on its importance.
   */
  export function isHighlightedStatus(status) {
    return ['Interview', 'Accepted'].includes(status)
  }
  
  /**
   * Gets the sort priority for a status.
   * Used for status-based sorting to show more important statuses first.
   */
  export const STATUS_PRIORITY = {
    'Interview': 1,
    'Applied': 2,
    'Writing CV': 3,
    'Accepted': 4,
    'Rejected': 5
  }
  
  export function getStatusPriority(status) {
    return STATUS_PRIORITY[status] || 999
  }