'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'
import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Send, Receipt, Filter, Download } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardNav'
import { useTransactionStore, Transaction } from '@/store'

export default function TransactionsPage() {
  const { transactions } = useTransactionStore()
  const [filter, setFilter] = useState('all')

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter((t: Transaction) => t.type === filter)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount))
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'withdrawal':
        return <TrendingDown className="w-5 h-5 text-red-500" />
      case 'transfer':
        return <Send className="w-5 h-5 text-blue-500" />
      case 'bill':
        return <Receipt className="w-5 h-5 text-orange-500" />
      default:
        return <Receipt className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'flagged':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <ScrollReveal>
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-500">View all your transaction history</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'deposit', 'withdrawal', 'transfer', 'bill'].map((type: string) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === type
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction: Transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500 capitalize">{transaction.type}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </ScrollReveal>
  )
}
