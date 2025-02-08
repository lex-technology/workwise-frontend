/**
 * Provides sorting functionality for application data.
 * Implements various sorting strategies and maintains consistent sorting behavior.
 */

// Default sorting configuration that prioritizes the created date
export const DEFAULT_SORT_CONFIG = {
    key: 'created_at',
    direction: 'desc'
  }
  
  /**
   * Compares two values for sorting purposes.
   * Handles different data types appropriately (strings, dates, numbers).
   */
  function compareValues(a, b, direction) {
    // Handle undefined or null values by placing them at the end
    if (a == null) return 1
    if (b == null) return -1
    if (a == null && b == null) return 0
  
    // For date strings, convert to Date objects for comparison
    if (isDateString(a) && isDateString(b)) {
      return direction * (new Date(a) - new Date(b))
    }
  
    // For regular strings, use localeCompare for proper string comparison
    if (typeof a === 'string' && typeof b === 'string') {
      return direction * a.localeCompare(b)
    }
  
    // For numbers, use simple subtraction
    return direction * (a - b)
  }
  
  /**
   * Checks if a string represents a valid date.
   */
  function isDateString(str) {
    if (typeof str !== 'string') return false
    const date = new Date(str)
    return date instanceof Date && !isNaN(date)
  }
  
  /**
   * Creates a sorting function based on the provided configuration.
   * Supports complex sorting with multiple fields and different data types.
   */
  export function createSortFunction(sortConfig) {
    return (a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1
      const value1 = getValue(a, sortConfig.key)
      const value2 = getValue(b, sortConfig.key)
      
      return compareValues(value1, value2, direction)
    }
  }
  
  /**
   * Safely gets a value from an object using a key path.
   * Supports nested object properties using dot notation.
   */
  function getValue(obj, keyPath) {
    return keyPath.split('.').reduce((acc, key) => 
      acc && acc[key] !== undefined ? acc[key] : null
    , obj)
  }
  
  /**
   * Sort applications based on multiple criteria.
   * Provides stable sorting with consistent behavior.
   */
  export function sortApplications(applications, sortConfig = DEFAULT_SORT_CONFIG) {
    return [...applications].sort(createSortFunction(sortConfig))
  }
  
  // Export common sorting configurations for reuse
  export const SORT_CONFIGS = {
    CREATED_DESC: { key: 'created_at', direction: 'desc' },
    CREATED_ASC: { key: 'created_at', direction: 'asc' },
    COMPANY_ASC: { key: 'company', direction: 'asc' },
    COMPANY_DESC: { key: 'company', direction: 'desc' },
    STATUS_ASC: { key: 'status', direction: 'asc' },
    STATUS_DESC: { key: 'status', direction: 'desc' },
    DATE_APPLIED_DESC: { key: 'date', direction: 'desc' },
    DATE_APPLIED_ASC: { key: 'date', direction: 'asc' }
  }
  