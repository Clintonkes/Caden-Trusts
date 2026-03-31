'use client'

import React from 'react'
import Link from 'next/link'
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Send,
    CreditCard,
    Receipt,
    ArrowRight,
    Plus
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardNav'
import { useAuthStore, useTransactionStore } from '@/store'

export default function DashboardPage() {
    const { user } = useAuthStore()
    const { transactions } = useTransactionStore()

    const balance = user?.balance || 25000
    const recentTransactions = transactions.slice(0, 5)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
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
                return <Wallet className="w-5 h-5 text-gray-500" />
        }
    }

    const quickActions = [
        { name: 'Send Money', icon: Send, href: '/dashboard/transfers', color: 'bg-blue-500' },
        { name: 'Pay Bills', icon: Receipt, href: '/dashboard/bills', color: 'bg-orange-500' },
        { name: 'My Cards', icon: CreditCard, href: '/dashboard/cards', color: 'bg-purple-500' },
        { name: 'Deposit', icon: Plus, href: '/dashboard/deposit', color: 'bg-green-500' },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user?.name || 'User'}!
                        </h1>
                        <p className="text-gray-500">Here's your financial overview</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-500">Current Date</p>
                        <p className="font-medium">{new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                </div>

                {/* Balance Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Balance Card */}
                    <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-700 rounded-2xl p-6 text-white">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-white/80 text-sm">Total Balance</p>
                                <p className="text-4xl font-bold mt-1">{formatCurrency(balance)}</p>
                            </div>
                            <CreditCard className="w-10 h-10 opacity-80" />
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-white/80 text-sm">Account Number</p>
                                <p className="font-medium">{user?.accountNumber || '1234 5678 9010'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/80 text-sm">Account Type</p>
                                <p className="font-medium">Savings</p>
                            </div>
                        </div>
                    </div>

                    {/* Income/Expense Summary */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Income</p>
                                    <p className="text-xl font-bold text-green-600">{formatCurrency(8500)}</p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Expenses</p>
                                    <p className="text-xl font-bold text-red-600">{formatCurrency(3210)}</p>
                                </div>
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-red-600" />
                                </div>
                            </div>
                            <p className="text-xs text-red-600 mt-2">-5% from last month</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.name}
                                href={action.href}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{action.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                        <Link href="/dashboard/transactions" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        {getTransactionIcon(transaction.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{transaction.description}</p>
                                        <p className="text-sm text-gray-500">{transaction.date}</p>
                                    </div>
                                </div>
                                <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
