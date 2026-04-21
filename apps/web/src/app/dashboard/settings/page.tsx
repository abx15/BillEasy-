'use client'

import { useState } from 'react'
import { User, Bell, Shield, Palette, Globe, HelpCircle, Save } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({
    businessName: 'BillEasy Store',
    email: 'admin@billeasy.com',
    phone: '+91-98765-43210',
    address: '123 Main Street, Mumbai, Maharashtra 400001',
    gstin: '27AABCB1234C1Z5',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
    notifications: true,
    darkMode: false,
  })
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((state) => state.user)

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Globe },
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', formData)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card>
          <div className="card-content p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <div className="card-content">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        label="Business Name"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="Contact Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your business
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('notifications', !formData.notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.notifications ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-background transition-transform ${
                            formData.notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get SMS alerts for important updates
                        </p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors`}
                      >
                        <span className="inline-block h-4 w-4 rounded-full bg-background translate-x-1" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Browser push notifications for real-time updates
                        </p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors`}
                      >
                        <span className="inline-block h-4 w-4 rounded-full bg-background translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Input
                        label="Current Password"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline">Change Password</Button>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Appearance Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Use dark theme across the application
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('darkMode', !formData.darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.darkMode ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-background transition-transform ${
                            formData.darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Language
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="gu">ગુજરાતી</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Advanced Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Input
                        label="GSTIN"
                        value={formData.gstin}
                        onChange={(e) => handleInputChange('gstin', e.target.value)}
                        placeholder="Enter your GST Identification Number"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Timezone
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm"
                      >
                        <option value="Asia/Kolkata">India Standard Time (IST)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        Export Data
                      </Button>
                      <Button variant="outline" className="w-full">
                        Backup Settings
                      </Button>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Account Info */}
      <Card>
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
          <p className="text-sm text-muted-foreground">
            Your current account details and subscription status
          </p>
        </div>
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'admin@billeasy.com'}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge status="PAID" size="sm">Premium Plan</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
