// Root Page - Redirection and Splash
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // If middleware is active, it handles initial / -> /dashboard redirect.
    // This is a client-side fallback.
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
      </div>

      {/* Main Content */}
      <div className="text-center relative z-10">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl animate-pulse" />
              <span className="text-white text-5xl font-black relative z-10 tracking-tight">B</span>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl -z-10" />
          </div>
          
          {/* Brand Name */}
          <div className="space-y-2">
            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent tracking-tight">
              BillEasy
            </h1>
            <p className="text-gray-600 font-medium text-lg">
              Smart Billing for Every Business
            </p>
          </div>
          
          {/* Loading Dots */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-bounce shadow-lg" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }} />
          </div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <p className="text-gray-500 font-semibold uppercase tracking-wider text-sm">
              Initializing Your Workspace
            </p>
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-gray-400 text-xs font-medium mb-2">
          Powered by BillEasy™ 2026
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-300 transition-colors">About</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Features</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Pricing</a>
        </div>
      </div>
    </div>
  )
}
