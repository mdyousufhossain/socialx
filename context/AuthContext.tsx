'use client'
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

interface User {
  id?: string
  email: string
  username?: string
  [key: string]: any
}

interface LoginCredentials {
  email: string
  password: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<any>
  logout: () => Promise<void>
  register: (userData: User) => Promise<any>
  isAuthenticated: boolean
  refreshToken: () => Promise<any>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Get current user from API
  const fetchCurrentUser = useCallback(async (): Promise<User> => {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    return await response.json()
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const userData = await fetchCurrentUser()

      setUser(userData)
    } catch (error) {
      setUser(null)
    }
  }, [fetchCurrentUser])

  // Refresh token logic
  const refreshAuthToken = useCallback(async () => {
    const response = await fetch('/api/auth/refresh', { // 🔑 Make sure this endpoint exists
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    return await response.json()
  }, [])

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      const userData = await fetchCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Auth initialization error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [fetchCurrentUser])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      setUser(data.user)

      return data
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear client-side state immediately
      setUser(null)
    }
  }, [])

  const register = useCallback(async (userData: User) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    return response.json()
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    refreshToken: refreshAuthToken,
    refreshUser // 🔑 Expose the refresh function
  }), [user, loading, login, logout, register, refreshAuthToken, refreshUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
