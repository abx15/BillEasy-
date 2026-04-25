'use client'

import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Moon, 
  Sun,
  Layout,
  ChevronRight,
  LogOut,
  HelpCircle,
  Save,
  CheckCircle2
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [darkMode, setDarkMode] = useState(false)

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'business', label: 'Business Identity', icon: Building },
    { id: 'appearance', label: 'Theme & UX', icon: Layout },
    { id: 'notifications', label: 'Alert Center', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Globe },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-50 rounded-xl">
          <SettingsIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and business configuration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">
                    AK
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">Arun Kumar</h2>
                    <p className="text-gray-600 mt-1 font-medium">Platform Administrator</p>
                    <div className="flex items-center gap-2 mt-4">
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 capitalize">Verified Executive</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="h-10">
                    Change Avatar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Arun Kumar"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue="arun@billeasy.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>Administrator</option>
                      <option>Manager</option>
                      <option>Staff</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      defaultValue="BillEasy Solutions Pvt Ltd"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>Retail</option>
                      <option>Manufacturing</option>
                      <option>Services</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                      rows={3}
                      defaultValue="123 Business Park, Delhi, India 110001"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Theme Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
                      <div>
                        <p className="font-medium text-gray-900">Dark Mode</p>
                        <p className="text-sm text-gray-600">Toggle dark mode theme</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Other tabs with placeholder content */}
          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h3>
              <p className="text-gray-600">Configure your notification preferences here.</p>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>
              <p className="text-gray-600">Manage your security preferences and password.</p>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Information</h3>
              <p className="text-gray-600">View and manage your subscription and billing details.</p>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Integrations</h3>
              <p className="text-gray-600">Connect third-party services and APIs.</p>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" className="h-12">
              Cancel
            </Button>
            <Button variant="primary" className="h-12">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-600 transition-colors">API Reference</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Community</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">
              © 2026 BillEasy™. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-600 transition-colors">Cookie Policy</a>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Version 2.0.1 • Last updated: April 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
