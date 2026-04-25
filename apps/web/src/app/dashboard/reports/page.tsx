'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Calendar, 
  Download, 
  Filter, 
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Package,
  Users
} from 'lucide-react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const revenueData = [
  { name: 'Week 1', revenue: 45000, expenses: 32000 },
  { name: 'Week 2', revenue: 52000, expenses: 38000 },
  { name: 'Week 3', revenue: 48000, expenses: 31000 },
  { name: 'Week 4', revenue: 61000, expenses: 42000 },
]

const categoryData = [
  { name: 'Spices', value: 400, color: '#4f66ff' },
  { name: 'Grains', value: 300, color: '#10b981' },
  { name: 'Essentials', value: 300, color: '#f59e0b' },
  { name: 'Others', value: 200, color: '#6366f1' },
]

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState('This Month')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Financial Intelligence</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your business metrics and performance analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" /> Custom Range
          </Button>
          <Button className="shadow-brand">
            <Download className="w-4 h-4 mr-2" /> Generate PDF Report
          </Button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportMetric 
          label="Net Profit" 
          value="₹42,850" 
          change="+18.4%" 
          isIncrease={true} 
          icon={DollarSign}
        />
        <ReportMetric 
          label="Total Expenses" 
          value="₹1,12,000" 
          change="+2.1%" 
          isIncrease={false} 
          icon={TrendingUp}
        />
        <ReportMetric 
          label="Inventory Turnover" 
          value="4.2x" 
          change="+0.5x" 
          isIncrease={true} 
          icon={Package}
        />
        <ReportMetric 
          label="New Leads" 
          value="156" 
          change="+22%" 
          isIncrease={true} 
          icon={Users}
        />
      </div>

      {/* Primary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue vs Expenses */}
        <Card className="lg:col-span-2 border-none shadow-premium bg-white p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Revenue vs Expenses</h3>
              <p className="text-sm text-muted-foreground">Weekly comparison for current month</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-500" /> Revenue</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Expenses</div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#4f66ff" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="border-none shadow-premium bg-white p-6">
          <h3 className="text-lg font-bold mb-8">Sales by Category</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</p>
                <p className="text-2xl font-black text-foreground">1.2K</p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-semibold text-slate-600">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{cat.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-soft bg-white p-6">
          <h3 className="font-bold mb-6">User Acquisition Trend</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-soft bg-white p-6 overflow-hidden">
          <h3 className="font-bold mb-6">Tax Liability Summary</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-medium">GST Collected (Output)</span>
                <span className="font-bold">₹12,450.00</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div className="h-full w-[65%] bg-primary-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-medium">GST Paid (Input)</span>
                <span className="font-bold">₹8,120.00</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div className="h-full w-[45%] bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Estimated Tax Payable</span>
              <span className="text-xl font-bold text-primary-600">₹4,330.00</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

function ReportMetric({ label, value, change, isIncrease, icon: Icon }: any) {
  return (
    <Card className="border-none shadow-soft bg-white p-5 hover:shadow-medium transition-all group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <div className={`flex items-center text-xs font-black ${isIncrease ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isIncrease ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      </div>
    </Card>
  )
}
