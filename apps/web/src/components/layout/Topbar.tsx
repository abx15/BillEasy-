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
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search bills, customers..."
            className="w-full bg-slate-100 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>
        
        <div className="h-8 w-px bg-border mx-2" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">Premium Account</p>
          </div>
          <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-border flex items-center justify-center overflow-hidden shadow-sm">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
