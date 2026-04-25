'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Package, 
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Activity
} from 'lucide-react'
// import { motion } from 'framer-motion'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'

const data = [
  { name: 'Jan', revenue: 4000, bills: 240 },
  { name: 'Feb', revenue: 3000, bills: 198 },
  { name: 'Mar', revenue: 5000, bills: 300 },
  { name: 'Apr', revenue: 2780, bills: 208 },
  { name: 'May', revenue: 1890, bills: 150 },
  { name: 'Jun', revenue: 6390, bills: 430 },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-slate-100 rounded-card" />
          <div className="h-[400px] bg-slate-100 rounded-card" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Welcome back! Today is {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-gray-600">All systems operational</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="hidden sm:flex bg-gray-100 hover:bg-gray-200 text-gray-700">
              <Activity className="w-4 h-4 mr-2" /> Activity Log
            </Button>
            <Button variant="outline" className="hidden sm:flex border-gray-200 text-gray-700 hover:bg-gray-50">
              <ArrowDownRight className="w-4 h-4 mr-2" /> Export Report
            </Button>
            <Link href="/dashboard/bills/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-4 h-4 mr-2" /> Create Bill
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="₹1,28,450" 
          change="+12.5%" 
          isIncrease={true}
          icon={DollarSign}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Total Invoices" 
          value="156" 
          change="+8.2%" 
          isIncrease={true}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatCard 
          title="New Customers" 
          value="24" 
          change="-3.1%" 
          isIncrease={false}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard 
          title="Avg. Bill Value" 
          value="₹823.40" 
          change="+5.4%" 
          isIncrease={true}
          icon={ShoppingCart}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 shadow-premium border-none overflow-hidden bg-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground">Revenue Dynamics</h3>
              <p className="text-sm text-muted-foreground">Historical performance over 6 months</p>
            </div>
            <select className="bg-surface-100 border-none rounded-button px-3 py-1.5 text-sm font-medium focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f66ff" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f66ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f66ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Sidebar Components */}
        <div className="space-y-6">
          {/* Low Stock Card */}
          <Card className="border-none shadow-soft overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Inventory Alerts</h3>
              <Badge status="destructive">Critical</Badge>
            </div>
            <div className="space-y-4">
              <InventoryItem name="Organic Turmeric" stock={12} min={20} />
              <InventoryItem name="Refined Sugar (1kg)" stock={4} min={15} />
              <InventoryItem name="Sunflower Oil (5L)" stock={2} min={10} />
              <Button variant="outline" fullWidth className="mt-2 text-xs">Manage Inventory</Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-brand-gradient border-none text-white shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <TrendingUp className="w-24 h-24 rotate-12" />
            </div>
            <div className="relative z-10">
              <h4 className="text-white/80 font-medium mb-1">Weekly Target</h4>
              <p className="text-3xl font-bold mb-4">78% Achieved</p>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[78%] transition-all duration-1000" />
              </div>
              <p className="text-xs text-white/60 mt-3 italic">₹22,450 left to hit goal</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Bills Table Section */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-soft p-0">
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <h3 className="font-bold text-lg">Transaction History</h3>
            <Button variant="ghost" size="sm">View Detailed Report</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-100 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Inovice ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <BillRow id="INV-8821" customer="Arun Kumar" date="20 Apr, 12:45" amount="₹2,450.00" status="PAID" />
                <BillRow id="INV-8820" customer="Rahul Sharma" date="19 Apr, 15:20" amount="₹450.00" status="PENDING" />
                <BillRow id="INV-8819" customer="Sita Gupta" date="19 Apr, 10:15" amount="₹12,200.00" status="PAID" />
                <BillRow id="INV-8818" customer="Priya Singh" date="18 Apr, 16:30" amount="₹1,800.00" status="CANCELLED" />
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, isIncrease, icon: Icon, color }: any) {
  return (
    <Card className="group hover:-translate-y-1 transition-all duration-300 border-none shadow-lg bg-white overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">{value}</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${isIncrease ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isIncrease ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {change}
            <span className="ml-1 text-xs">vs last month</span>
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
      {/* Bottom decoration */}
      <div className={`h-1 mt-4 bg-gradient-to-r ${isIncrease ? 'from-emerald-500 to-emerald-400' : 'from-rose-500 to-rose-400'}`} />
    </Card>
  )
}

function InventoryItem({ name, stock, min }: any) {
  const percent = (stock / min) * 100
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-muted-foreground font-bold">{stock} / {min} left</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${percent < 25 ? 'bg-rose-500' : 'bg-orange-500'}`} 
          style={{ width: `${percent}%` }} 
        />
      </div>
    </div>
  )
}

function BillRow({ id, customer, date, amount, status }: any) {
  const statusColors: any = {
    PAID: 'bg-emerald-100 text-emerald-700',
    PENDING: 'bg-orange-100 text-orange-700',
    CANCELLED: 'bg-slate-100 text-slate-700'
  }
  return (
    <tr className="hover:bg-surface-100 transition-colors cursor-pointer group">
      <td className="px-6 py-4">
        <span className="font-bold text-primary-600 group-hover:underline">{id}</span>
      </td>
      <td className="px-6 py-4 font-semibold text-foreground">{customer}</td>
      <td className="px-6 py-4 text-muted-foreground text-sm">{date}</td>
      <td className="px-6 py-4 font-bold text-foreground">{amount}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${statusColors[status]}`}>
          {status}
        </span>
      </td>
    </tr>
  )
}
