'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/lib/api'

// Types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  business: {
    id: string
    name: string
    gst: string
    address: string
    phone: string
    email: string
    invoicePrefix: string
  }
}

export interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
  loadUser: () => Promise<void>
  setLoading: (loading: boolean) => void
}

export interface RegisterData {
  businessName: string
  gst: string
  address: string
  ownerName: string
  phone: string
  email: string
  password: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post('/auth/login', {
            email,
            password,
          })

          const { accessToken, refreshToken, user } = response.data.data

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })

          // Store tokens in localStorage for axios interceptors
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post('/auth/register', data)

          const { accessToken, refreshToken, user } = response.data.data

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })

          // Store tokens in localStorage for axios interceptors
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        // Clear state
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        })

        // Clear localStorage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        try {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken,
          })

          const { accessToken: newAccessToken } = response.data.data

          set({ accessToken: newAccessToken })
          localStorage.setItem('accessToken', newAccessToken)
        } catch (error) {
          // Refresh failed, logout
          get().logout()
          throw error
        }
      },

      loadUser: async () => {
        const { accessToken } = get()
        if (!accessToken) {
          return
        }

        set({ isLoading: true })
        try {
          const response = await apiClient.get('/auth/me')
          const user = response.data.data

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Invalid token, clear auth
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, sync with localStorage
        if (state?.accessToken) {
          localStorage.setItem('accessToken', state.accessToken)
        }
        if (state?.refreshToken) {
          localStorage.setItem('refreshToken', state.refreshToken)
        }
      },
    }
  )
)
