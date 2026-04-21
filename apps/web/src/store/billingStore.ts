'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface BillItem {
  id: string
  productId: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  gstPercentage: number
  gstAmount: number
  totalAmount: number
  stock: number
}

export interface BillingState {
  // State
  items: BillItem[]
  customerId: string | null
  customerPhone: string
  discountAmount: number
  paymentMethod: 'cash' | 'upi' | 'card' | 'credit'
  notes: string

  // Computed getters (as methods)
  getSubtotal: () => number
  getTotalGST: () => number
  getTotalAmount: () => number
  getItemCount: () => number

  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updatePrice: (productId: string, price: number) => void
  setCustomer: (customerId: string | null, customerPhone: string) => void
  setDiscount: (amount: number) => void
  setPaymentMethod: (method: 'cash' | 'upi' | 'card' | 'credit') => void
  setNotes: (notes: string) => void
  clearBill: () => void
  getBillData: () => BillData
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  gstPercentage: number
  stock: number
  category: string
  unit: string
}

export interface BillData {
  items: BillItem[]
  customerId: string | null
  customerPhone: string
  discountAmount: number
  paymentMethod: 'cash' | 'upi' | 'card' | 'credit'
  notes: string
  subtotal: number
  totalGST: number
  totalAmount: number
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      customerId: null,
      customerPhone: '',
      discountAmount: 0,
      paymentMethod: 'cash',
      notes: '',

      // Computed getters
      getSubtotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
      },

      getTotalGST: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.gstAmount, 0)
      },

      getTotalAmount: () => {
        const { getSubtotal, getTotalGST, discountAmount } = get()
        return getSubtotal() + getTotalGST() - discountAmount
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },

      // Actions
      addItem: (product: Product) => {
        const { items } = get()
        
        // Check if item already exists
        const existingItemIndex = items.findIndex(item => item.productId === product.id)
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const newItems = [...items]
          const existingItem = newItems[existingItemIndex]
          const newQuantity = existingItem.quantity + 1
          
          // Check if enough stock is available
          if (newQuantity > product.stock) {
            throw new Error(`Only ${product.stock} units available in stock`)
          }
          
          existingItem.quantity = newQuantity
          existingItem.gstAmount = (existingItem.unitPrice * newQuantity * product.gstPercentage) / 100
          existingItem.totalAmount = existingItem.unitPrice * newQuantity + existingItem.gstAmount
          
          set({ items: newItems })
        } else {
          // Add new item
          const gstAmount = (product.price * product.gstPercentage) / 100
          const totalAmount = product.price + gstAmount
          
          const newItem: BillItem = {
            id: `${product.id}_${Date.now()}`,
            productId: product.id,
            name: product.name,
            sku: product.sku,
            quantity: 1,
            unitPrice: product.price,
            gstPercentage: product.gstPercentage,
            gstAmount,
            totalAmount,
            stock: product.stock,
          }
          
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (productId: string) => {
        const { items } = get()
        const newItems = items.filter(item => item.productId !== productId)
        set({ items: newItems })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const { items } = get()
        const newItems = [...items]
        const itemIndex = newItems.findIndex(item => item.productId === productId)
        
        if (itemIndex >= 0) {
          const item = newItems[itemIndex]
          
          // Check if enough stock is available
          if (quantity > item.stock) {
            throw new Error(`Only ${item.stock} units available in stock`)
          }
          
          item.quantity = quantity
          item.gstAmount = (item.unitPrice * quantity * item.gstPercentage) / 100
          item.totalAmount = item.unitPrice * quantity + item.gstAmount
          
          set({ items: newItems })
        }
      },

      updatePrice: (productId: string, price: number) => {
        if (price < 0) {
          throw new Error('Price cannot be negative')
        }

        const { items } = get()
        const newItems = [...items]
        const itemIndex = newItems.findIndex(item => item.productId === productId)
        
        if (itemIndex >= 0) {
          const item = newItems[itemIndex]
          item.unitPrice = price
          item.gstAmount = (price * item.quantity * item.gstPercentage) / 100
          item.totalAmount = price * item.quantity + item.gstAmount
          
          set({ items: newItems })
        }
      },

      setCustomer: (customerId: string | null, customerPhone: string) => {
        set({ customerId, customerPhone })
      },

      setDiscount: (amount: number) => {
        if (amount < 0) {
          throw new Error('Discount cannot be negative')
        }
        
        const subtotal = get().getSubtotal()
        if (amount > subtotal) {
          throw new Error('Discount cannot exceed subtotal')
        }
        
        set({ discountAmount: amount })
      },

      setPaymentMethod: (method: 'cash' | 'upi' | 'card' | 'credit') => {
        set({ paymentMethod: method })
      },

      setNotes: (notes: string) => {
        set({ notes })
      },

      clearBill: () => {
        set({
          items: [],
          customerId: null,
          customerPhone: '',
          discountAmount: 0,
          paymentMethod: 'cash',
          notes: '',
        })
      },

      getBillData: (): BillData => {
        const { items, customerId, customerPhone, discountAmount, paymentMethod, notes, getSubtotal, getTotalGST, getTotalAmount } = get()
        
        return {
          items,
          customerId,
          customerPhone,
          discountAmount,
          paymentMethod,
          notes,
          subtotal: getSubtotal(),
          totalGST: getTotalGST(),
          totalAmount: getTotalAmount(),
        }
      },
    }),
    {
      name: 'billing-storage',
      partialize: (state) => ({
        items: state.items,
        customerId: state.customerId,
        customerPhone: state.customerPhone,
        discountAmount: state.discountAmount,
        paymentMethod: state.paymentMethod,
        notes: state.notes,
      }),
    }
  )
)
