'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Grid, 
  List, 
  Package, 
  Tag, 
  Layers,
  ArrowUpRight,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const mockProducts = [
  { id: 1, name: 'Organic Turmeric Powder', category: 'Spices', price: '₹450', stock: 12, minStock: 20, sku: 'SPI-TUR-001', trend: '+12%', image: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Premium Basmati Rice', category: 'Grains', price: '₹850', stock: 45, minStock: 15, sku: 'GRA-BAS-005', trend: '+5%', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: 'Refined Sugar (1kg)', category: 'Essentials', price: '₹45', stock: 4, minStock: 50, sku: 'ESS-SUG-012', trend: '-2%', image: 'https://images.unsplash.com/photo-1622484210800-06cd547900d6?auto=format&fit=crop&q=80&w=200' },
  { id: 4, name: 'Sunflower Oil (5L)', category: 'Oils', price: '₹720', stock: 8, minStock: 10, sku: 'OIL-SUN-008', trend: '+24%', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200' },
  { id: 5, name: 'Whole Wheat Flour', category: 'Grains', price: '₹340', stock: 120, minStock: 30, sku: 'GRA-WHE-002', trend: '+8%', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
  { id: 6, name: 'Green Moong Dal', category: 'Pulses', price: '₹140', stock: 65, minStock: 25, sku: 'PUL-MOO-015', trend: '+15%', image: 'https://images.unsplash.com/photo-1585994192739-ec9860701bc2?auto=format&fit=crop&q=80&w=200' },
]

export default function ProductsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Inventory Vault</h1>
          <p className="text-muted-foreground mt-1">Real-time stock monitoring and product lifecycle management.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            Bulk Import
          </Button>
          <Button className="shadow-brand">
            <Plus className="w-4 h-4 mr-2" /> Add New Item
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InventoryStat label="Active Items" value="482" icon={Package} color="text-primary-500" />
        <InventoryStat label="Low Stock" value="12" icon={AlertCircle} color="text-rose-500" />
        <InventoryStat label="Total Categories" value="14" icon={Layers} color="text-amber-500" />
        <InventoryStat label="Total Value" value="₹14.2L" icon={Tag} color="text-emerald-500" />
      </div>

      {/* Toolbar */}
      <Card className="p-4 border-none shadow-soft bg-white/50 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by product name, SKU or category..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-input text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-muted-foreground'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-muted-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.map((product, index) => (
            <div key={product.id}>
              <Card className="group hover:-translate-y-1 hover:shadow-premium transition-all duration-300 border-none bg-white p-0 overflow-hidden h-full flex flex-col">
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3">
                    <Badge status={product.stock <= product.minStock ? 'destructive' : 'secondary'} className="backdrop-blur-md shadow-soft">
                      {product.stock <= product.minStock ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="font-bold text-foreground group-hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Price</p>
                        <p className="text-xl font-bold text-foreground">{product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Stock</p>
                        <p className={`font-bold ${product.stock <= product.minStock ? 'text-rose-500' : 'text-slate-700'}`}>{product.stock}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                      <Button variant="outline" size="sm" className="flex-1 h-9 rounded-lg">
                        <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
      </div>
    </div>
  )
}

function InventoryStat({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-soft bg-white p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      </div>
    </Card>
  )
}
