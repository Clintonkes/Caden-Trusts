'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'
import React, { useState } from 'react'
import { Send, Building2, User, DollarSign, ArrowRight } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardNav'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTransactionStore } from '@/store'

const banks = [
  { id: '1', name: 'Chase Bank' },
  { id: '2', name: 'Bank of America' },
  { id: '3', name: 'Wells Fargo' },
  { id: '4', name: 'Citibank' },
  { id: '5', name: 'Other Banks' },
]

export default function TransfersPage() {
  const { addTransaction } = useTransactionStore()
  const [formData, setFormData] = useState({
    recipientName: '',
    accountNumber: '',
    bank: '',
    amount: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Add transaction
    addTransaction({
      id: Date.now().toString(),
      type: 'transfer',
      amount: -Number(formData.amount),
      description: `Transfer to ${formData.recipientName}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      recipient: formData.recipientName,
    })

    setSuccess(true)
    setLoading(false)
    
    // Reset form
    setFormData({
      recipientName: '',
      accountNumber: '',
      bank: '',
      amount: '',
      description: '',
    })

    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <ScrollReveal>
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Send Money</h1>
        <p className="text-gray-500 mb-8">Transfer funds to any bank account</p>

        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Transfer completed successfully!
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Recipient Name"
              placeholder="Enter recipient's full name"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              icon={<User className="w-5 h-5" />}
              required
            />

            <Input
              label="Account Number"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              icon={<Building2 className="w-5 h-5" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {banks.map((bank: any) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, bank: bank.name })}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      formData.bank === bank.name
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {bank.name}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              icon={<DollarSign className="w-5 h-5" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Add a note for this transfer"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Transfer Fee</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  ${Number(formData.amount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <Send className="w-5 h-5 mr-2" />
              Send Money
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
    </ScrollReveal>
  )
}
