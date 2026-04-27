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
  ShieldCheck,
  Zap,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

function Tooltip({ children, text, isVisible }: { children: React.ReactNode, text: string, isVisible: boolean }) {
  if (!isVisible) return children
  
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-neutral-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {text}
        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-neutral-900" />
      </div>
    </div>
  )
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bills', href: '/dashboard/bills', icon: FileText },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'AI Insights', href: '/dashboard/ai', icon: Zap },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar({ 
  onClose, 
  isCollapsed = false, 
  onToggle 
}: { 
  onClose?: () => void
  isCollapsed?: boolean
  onToggle?: () => void 
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    // Clear cookies if needed
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push('/login')
  }

  return (
    <div className={cn(
      "h-full flex flex-col bg-white border-r border-neutral-100 shadow-premium transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[80px]" : "w-[280px]"
    )}>
      {/* Brand Header */}
      <div className={cn(
        "flex items-center transition-all duration-300",
        isCollapsed ? "p-4 justify-center" : "p-8 justify-between"
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
            <span className="text-white font-black text-xl">B</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-black text-neutral-900 tracking-tight transition-all duration-300">BillEasy</span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className={cn(
            "p-2.5 rounded-xl transition-all duration-300 hover:bg-neutral-100 hover:shadow-md",
            isCollapsed ? "mx-auto bg-neutral-50 hover:bg-neutral-100" : "hover:bg-neutral-50"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-neutral-600 hover:text-neutral-900 transition-colors" />
          ) : (
            <X className="w-5 h-5 text-neutral-600 hover:text-neutral-900 transition-colors" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto custom-scrollbar transition-all duration-300",
        isCollapsed ? "px-2 space-y-2" : "px-4 space-y-1.5"
      )}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          
          return (
            <Tooltip text={item.name} isVisible={isCollapsed}>
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose?.()}
                className={cn(
                  'flex items-center justify-center lg:justify-between transition-all duration-300 relative overflow-hidden',
                  isCollapsed ? 'px-3 py-3.5 rounded-xl' : 'px-4 py-3.5 rounded-2xl',
                  isActive 
                    ? 'bg-primary-light text-primary shadow-sm' 
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 hover:shadow-sm'
                )}
              >
              <div className={cn(
                "flex items-center transition-all duration-300",
                isCollapsed ? "justify-center" : "gap-3"
              )}>
                <item.icon className={cn(
                  'w-5 h-5 transition-all duration-300',
                  isActive ? 'text-primary scale-110' : 'text-neutral-300 group-hover:text-neutral-500 group-hover:scale-105'
                )} />
                {!isCollapsed && (
                  <span className="font-bold text-sm tracking-tight transition-all duration-300">{item.name}</span>
                )}
              </div>
              {!isCollapsed && isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.div>
              )}
              {isCollapsed && isActive && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full" />
              )}
              </Link>
            </Tooltip>
          )
        })}
      </nav>

      {/* Upgrade Banner - Hidden in collapsed state */}
      {!isCollapsed && (
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
      )}

      {/* Logout */}
      <div className={cn(
        "border-t border-neutral-100 transition-all duration-300",
        isCollapsed ? "p-3" : "p-6"
      )}>
        <Tooltip text="Sign Out" isVisible={isCollapsed}>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center transition-all duration-300 font-bold text-sm",
              isCollapsed 
                ? "justify-center p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl w-full" 
                : "gap-3 px-4 py-3 w-full text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
