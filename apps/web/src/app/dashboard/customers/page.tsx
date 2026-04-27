'use client'

import { useState } from 'react'
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

const mockCustomers = [
  { id: 'CUST-001', name: 'Arun Kumar', email: 'arun@example.com', phone: '+91 9876543210', address: 'New Delhi, India', status: 'ACTIVE', totalBills: 12, totalSpent: '₹24,500' },
  { id: 'CUST-002', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543211', address: 'Mumbai, India', status: 'ACTIVE', totalBills: 5, totalSpent: '₹8,200' },
  { id: 'CUST-003', name: 'Sita Gupta', email: 'sita@example.com', phone: '+91 9876543212', address: 'Bangalore, India', status: 'INACTIVE', totalBills: 2, totalSpent: '₹1,500' },
  { id: 'CUST-004', name: 'Priya Singh', email: 'priya@example.com', phone: '+91 9876543213', address: 'Chennai, India', status: 'ACTIVE', totalBills: 8, totalSpent: '₹15,700' },
  { id: 'CUST-005', name: 'Amit Patel', email: 'amit@example.com', phone: '+91 9876543214', address: 'Ahmedabad, India', status: 'ACTIVE', totalBills: 15, totalSpent: '₹42,000' },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Customer Directory</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships and their transaction history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button className="shadow-brand">
            <UserPlus className="w-4 h-4 mr-2" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 border-none shadow-soft bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-input text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="p-0 border-none shadow-premium overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border/50">
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Contact Information</th>
                <th className="px-6 py-5">Location</th>
                <th className="px-6 py-5">Activity</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <AnimatePresence>
                {mockCustomers.map((customer, index) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{customer.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{customer.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {customer.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-foreground">{customer.totalSpent}</span>
                        <p className="text-[10px] text-muted-foreground">{customer.totalBills} total bills</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider border ${
                        customer.status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">1-5</span> of <span className="font-bold text-foreground">124</span> customers
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
