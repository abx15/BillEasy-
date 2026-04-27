'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bills', href: '/dashboard/bills', icon: FileText },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    // Clear cookies if needed
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push('/login')
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-neutral-100 shadow-premium w-[280px]">
      {/* Brand Header */}
      <div className="p-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <span className="text-xl font-black text-neutral-900 tracking-tight">BillEasy</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onClose?.()}
              className={cn(
                'group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300',
                isActive 
                  ? 'bg-primary-light text-primary shadow-sm' 
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  'w-5 h-5 transition-colors duration-300',
                  isActive ? 'text-primary' : 'text-neutral-300 group-hover:text-neutral-500'
                )} />
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade Banner */}
      <div className="p-4 mx-4 mb-4 rounded-2xl bg-neutral-900 text-white relative overflow-hidden group shadow-xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl -mr-12 -mt-12" />
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-black tracking-widest uppercase text-white/50">PRO VERSION</span>
          </div>
          <p className="text-sm font-bold">Unlimited Invoicing</p>
          <button className="text-[10px] uppercase font-black tracking-widest py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-neutral-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
