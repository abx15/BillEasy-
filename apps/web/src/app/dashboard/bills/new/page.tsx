'use client'

import { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  Calculator, 
  User, 
  Calendar, 
  ChevronLeft,
  Search,
  ShoppingCart,
  Zap,
  Save,
  Printer
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface BillItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

export default function NewBillPage() {
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', name: '', quantity: 1, price: 0, total: 0 }
  ])
  const [customerName, setCustomerName] = useState('')
  const [discount, setDiscount] = useState(0)

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', quantity: 1, price: 0, total: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof BillItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.price)
        }
        return updatedItem
      }
      return item
    }))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.18 // 18% GST mock
  const grandTotal = subtotal + tax - discount

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/bills" className="flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Invoices
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:flex">
            <Zap className="w-4 h-4 mr-2 text-amber-500" /> Draft
          </Button>
          <Button variant="outline" className="hidden sm:flex">
            <Printer className="w-4 h-4 mr-2" /> Print Preview
          </Button>
          <Button className="shadow-brand px-6">
            <Save className="w-4 h-4 mr-2" /> Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-premium p-0 overflow-hidden bg-white">
            <div className="p-6 border-b border-border/50 bg-slate-50/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-500" /> Invoice Creator
              </h2>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" /> Customer Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search existing or type new..." 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-input focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" /> Invoice Date
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border border-border rounded-input focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Line Items</h3>
                  <Button variant="ghost" size="sm" onClick={addItem} className="text-primary-600 font-bold hover:bg-primary-50">
                    <Plus className="w-4 h-4 mr-1" /> Add Row
                  </Button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-12 gap-3 items-center group"
                      >
                        <div className="col-span-12 md:col-span-5">
                          <input 
                            placeholder="Item description (e.g. Organic Sugar)" 
                            className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:border-primary-500 outline-none transition-all"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <input 
                            type="number"
                            placeholder="Qty" 
                            className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:border-primary-500 outline-none text-center"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <input 
                            type="number"
                            placeholder="Price" 
                            className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:border-primary-500 outline-none text-center"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          />
                        </div>
                        <div className="col-span-3 md:col-span-2 text-right">
                          <span className="text-sm font-bold text-foreground">₹{item.total.toFixed(2)}</span>
                        </div>
                        <div className="col-span-1 text-right">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Area */}
        <div className="space-y-6">
          <Card className="border-none shadow-premium p-6 bg-brand-gradient text-white relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 opacity-10">
              <Calculator className="w-32 h-32" />
            </div>
            
            <h3 className="text-lg font-bold mb-6">Bill Summary</h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Tax (GST 18%)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Apply Discount (₹)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all font-bold"
                    placeholder="0.00"
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Grand Total</p>
                    <p className="text-3xl font-extrabold mt-1">₹{grandTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-soft p-6 bg-white">
            <h4 className="font-bold text-sm mb-4">Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-primary-100 bg-primary-50 text-primary-600 font-bold transition-all">
                <span className="text-xs">UPI/Cash</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-slate-200 text-slate-500 font-bold transition-all">
                <span className="text-xs">Credit/Debit</span>
              </button>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-slate-50 text-xs text-muted-foreground">
              <p>Adding this bill will automatically update your inventory stocks and revenue reports. Please double check before saving.</p>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
