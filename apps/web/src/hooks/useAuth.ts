// useAuth Hook - Auth state management
'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  businessName: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: RegisterData) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  businessName: string
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setToken(savedToken)
      // TODO: Validate token and fetch user data
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Placeholder for login API call
      console.log('Login attempt:', { email, password })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock response
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        businessName: 'Demo Business',
      }
      
      const mockToken = 'mock-jwt-token'
      
      setUser(mockUser)
      setToken(mockToken)
      localStorage.setItem('auth_token', mockToken)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      // Placeholder for registration API call
      console.log('Registration attempt:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Auto-login after registration
      await login(data.email, data.password)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
  }
}
