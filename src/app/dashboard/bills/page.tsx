'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'
import React, { useState } from 'react'
import { Receipt, Zap, Wifi, Phone, Home, Car, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardNav'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const billers = [
  { id: '1', name: 'Electricity', icon: Zap, category: 'Utilities' },
  { id: '2', name: 'Internet', icon: Wifi, category: 'Services' },
  { id: '3', name: 'Mobile', icon: Phone, category: 'Services' },
  { id: '4', name: 'Rent', icon: Home, category: 'Housing' },
  { id: '5', name: 'Insurance', icon: Car, category: 'Insurance' },
]

export default function BillsPage() {
  const [selectedBiller, setSelectedBiller] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      setSuccess(false)
      setSelectedBiller('')
      setAmount('')
    }, 3000)
  }

  return (
    <ScrollReveal>
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pay Bills</h1>
          <p className="text-gray-500">Pay your bills quickly and easily</p>
        </div>

        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Bill payment successful!
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Billers List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Biller</h2>
            <div className="space-y-3">
              {billers.map((biller: any) => (
                <button
                  key={biller.id}
                  onClick={() => setSelectedBiller(biller.name)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    selectedBiller === biller.name
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedBiller === biller.name ? 'bg-white/20' : 'bg-primary/10'
                  }`}>
                    <biller.icon className={`w-5 h-5 ${selectedBiller === biller.name ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${selectedBiller === biller.name ? 'text-white' : 'text-gray-900'}`}>
                      {biller.name}
                    </p>
                    <p className={`text-sm ${selectedBiller === biller.name ? 'text-white/80' : 'text-gray-500'}`}>
                      {biller.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Details</h2>
            <form onSubmit={handlePay} className="space-y-4">
              <Input
                label="Biller"
                value={selectedBiller || 'Select a biller'}
                disabled
              />
              <Input
                label="Amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Input
                label="Account Number"
                placeholder="Enter your account number"
              />
              <Input
                label="Meter Number / Phone / ID"
                placeholder="Enter biller-specific ID"
              />

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">$1.00</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ${(Number(amount) || 0 + 1).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button type="submit" className="w-full" loading={loading} disabled={!selectedBiller || !amount}>
                <Receipt className="w-4 h-4 mr-2" />
                Pay Bill
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </ScrollReveal>
  )
}
