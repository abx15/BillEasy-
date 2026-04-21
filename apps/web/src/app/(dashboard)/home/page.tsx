// Home Page - Main dashboard
'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    totalBills: 0,
    totalCustomers: 0,
    pendingPayments: 0,
  })

  useEffect(() => {
    // Placeholder for fetching dashboard stats
    const fetchStats = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats({
        todayRevenue: 12500,
        totalBills: 23,
        totalCustomers: 156,
        pendingPayments: 5,
      })
    }

    fetchStats()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-xl font-semibold text-gray-900">Rs. {stats.todayRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Bills</p>
              <p className="text-xl font-semibold text-gray-900">{stats.totalBills}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-xl font-semibold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-xl font-semibold text-gray-900">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-6 h-6 bg-primary-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Create Bill</p>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Add Customer</p>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Add Product</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
