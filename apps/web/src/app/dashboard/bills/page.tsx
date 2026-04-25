'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Printer,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

const mockBills = [
  { id: 'INV-8821', customer: 'Arun Kumar', date: '21 Apr 2026', amount: '₹2,450.00', status: 'PAID', type: 'Retail' },
  { id: 'INV-8820', customer: 'Rahul Sharma', date: '20 Apr 2026', amount: '₹450.00', status: 'PENDING', type: 'Wholesale' },
  { id: 'INV-8819', customer: 'Sita Gupta', date: '19 Apr 2026', amount: '₹12,200.00', status: 'PAID', type: 'Retail' },
  { id: 'INV-8818', customer: 'Priya Singh', date: '18 Apr 2026', amount: '₹1,800.00', status: 'CANCELLED', type: 'Retail' },
  { id: 'INV-8817', customer: 'Amit Patel', date: '17 Apr 2026', amount: '₹5,500.00', status: 'PAID', type: 'Wholesale' },
  { id: 'INV-8816', customer: 'Vikram Seth', date: '16 Apr 2026', amount: '₹920.00', status: 'PENDING', type: 'Retail' },
]

export default function BillsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your business transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Link href="/dashboard/bills/new">
            <Button className="shadow-brand">
              <Plus className="w-4 h-4 mr-2" /> New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border-none shadow-soft bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by ID, customer name..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-input text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['ALL', 'PAID', 'PENDING', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                    filterStatus === status 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="w-4 h-4 mr-2" /> More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="p-0 border-none shadow-premium overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border/50">
                <th className="px-6 py-5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                    Invoice ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Issue Date</th>
                <th className="px-6 py-5">Total Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <AnimatePresence>
                {mockBills.map((bill, index) => (
                  <motion.tr 
                    key={bill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-600 group-hover:underline">{bill.id}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{bill.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {bill.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-foreground">{bill.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm font-medium">
                      {bill.date}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {bill.amount}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={bill.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:shadow-soft">
                          <Eye className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:shadow-soft">
                          <Printer className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-50">
                          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        </Button>
                      </div>
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
            Showing <span className="font-bold text-foreground">1-10</span> of <span className="font-bold text-foreground">156</span> invoices
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Button size="sm" className="h-8 w-8 p-0">1</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
            </div>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PAID: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PENDING: 'bg-orange-100 text-orange-700 border-orange-200',
    CANCELLED: 'bg-slate-100 text-slate-700 border-slate-200'
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  )
}
