// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to update user data in storage
export const updateStoredUser = (userData) => {
  const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage
  storage.setItem('user', JSON.stringify(userData))
  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent('userProfileUpdate', { 
    detail: userData 
  }))
}