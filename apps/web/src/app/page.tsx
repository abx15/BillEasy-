// Root Page - Redirect to /home or /login
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      router.push('/dashboard/home')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">BillEasy</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
