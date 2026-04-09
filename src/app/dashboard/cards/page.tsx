'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'
import React, { useState } from 'react'
import { CreditCard, Plus, Eye, EyeOff, Power, PowerOff } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardNav'
import { Button } from '@/components/ui/Button'

const cards = [
  { id: '1', type: 'Visa', last4: '4829', expiry: '12/26', isActive: true, balance: 25000 },
  { id: '2', type: 'Mastercard', last4: '7210', expiry: '08/25', isActive: true, balance: 5000 },
]

export default function CardsPage() {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <ScrollReveal>
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Cards</h1>
            <p className="text-gray-500">Manage your debit and credit cards</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Order New Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card: any) => (
            <div
              key={card.id}
              className="relative bg-gradient-to-br from-primary to-primary-700 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-white/80 text-sm">Balance</p>
                  <p className="text-2xl font-bold">
                    {showBalance ? `$${card.balance.toLocaleString()}` : '••••••'}
                  </p>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/80 text-sm mb-1">Card Number</p>
                  <p className="font-mono text-lg">•••• •••• •••• {card.last4}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">Expires</p>
                  <p className="font-medium">{card.expiry}</p>
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <CreditCard className="w-10 h-10 opacity-80" />
              </div>
            </div>
          ))}
        </div>

        {/* Card Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Card Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Power className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Card Status</p>
                  <p className="text-sm text-gray-500">Your card is currently active</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Active
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Virtual Card</p>
                  <p className="text-sm text-gray-500">Create a virtual card for online purchases</p>
                </div>
              </div>
              <Button variant="outline">Generate</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </ScrollReveal>
  )
}
