'use client'

import { useState } from 'react'
import { 
  Search, 
  Bell, 
  Menu,
  ChevronDown,
  User 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface TopbarProps {
  onMenuClick?: () => void
  onSidebarToggle?: () => void
}

export function Topbar({ onMenuClick, onSidebarToggle }: TopbarProps) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSidebarToggle}
          className="hidden lg:flex hover:bg-neutral-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full bg-neutral-100 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative hover:bg-neutral-100 transition-colors">
          <Bell className="w-5 h-5 text-neutral-500" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
        </Button>
        
        <div className="h-8 w-px bg-neutral-100 mx-1" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-neutral-900">John Doe</p>
            <p className="text-[10px] font-black tracking-widest uppercase text-primary">PRO PLAN</p>
          </div>
          <button className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-200 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-all">
              <User className="w-6 h-6 text-neutral-500" />
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  )
}
