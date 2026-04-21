// Zustand Store - Global state management
import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  businessName: string
}

interface StoreState {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  clearAuth: () => void
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null }),
}))
