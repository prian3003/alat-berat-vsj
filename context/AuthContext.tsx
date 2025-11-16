'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: AdminUser | null
  isLoading: boolean
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cache configuration
let authCache: { user: AdminUser | null; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async (skipCache = false): Promise<boolean> => {
    try {
      // Check cache first (unless skipped)
      if (!skipCache && authCache && Date.now() - authCache.timestamp < CACHE_DURATION) {
        setUser(authCache.user)
        setIsAuthenticated(!!authCache.user)
        setIsLoading(false)
        return !!authCache.user
      }

      const response = await fetch('/api/admin/me', {
        credentials: 'include',
      })

      if (!response.ok) {
        // Auth failed, clear cache
        authCache = null
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        return false
      }

      const data = await response.json()
      const userData = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      }

      // Update cache
      authCache = {
        user: userData,
        timestamp: Date.now(),
      }

      setUser(userData)
      setIsAuthenticated(true)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Auth check failed:', error)
      authCache = null
      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear cache
      authCache = null
      setIsAuthenticated(false)
      setUser(null)
      router.push('/admin/login')
    }
  }

  // Check auth on mount and route changes
  useEffect(() => {
    checkAuth()
  }, [pathname])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
