// utils/cacheService.js
import { jwtDecode } from 'jwt-decode'

class SecureCacheService {
  constructor() {
    this.CACHE_PREFIX = 'secure_cache_'
    this.CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  }

  generateCacheKey(userId, resourceType) {
    return `${this.CACHE_PREFIX}${userId}_${resourceType}`
  }

  isTokenValid(token) {
    try {
      const decoded = jwtDecode(token)
      return decoded.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }

  setCache(key, data, token) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        tokenExp: jwtDecode(token).exp,
        userId: jwtDecode(token).sub
      }
      sessionStorage.setItem(key, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Cache storage failed:', error)
    }
  }

  getCache(key, token) {
    try {
      const cachedData = sessionStorage.getItem(key)
      if (!cachedData) return null

      const { data, timestamp, tokenExp, userId } = JSON.parse(cachedData)
      const currentUserId = jwtDecode(token).sub

      const isValid = 
        Date.now() - timestamp < this.CACHE_DURATION &&
        tokenExp === jwtDecode(token).exp &&
        userId === currentUserId &&
        this.isTokenValid(token)

      return isValid ? data : null
    } catch {
      return null
    }
  }

  clearCache() {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        sessionStorage.removeItem(key)
      }
    })
  }
}

export const cacheService = new SecureCacheService()