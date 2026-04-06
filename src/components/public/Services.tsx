'use client'

import React from 'react'
import { Wallet, Send, CreditCard, Receipt, PiggyBank, Building2 } from 'lucide-react'

const services = [
    {
        icon: Wallet,
        title: 'Savings Account',
        description: 'High-yield savings with competitive interest rates and no hidden fees.',
        color: 'bg-blue-500',
    },
    {
        icon: Send,
        title: 'Money Transfers',
        description: 'Send money locally and internationally with real-time tracking.',
        color: 'bg-green-500',
    },
    {
        icon: CreditCard,
        title: 'Credit Cards',
        description: 'Premium credit cards with exclusive rewards and cashback offers.',
        color: 'bg-purple-500',
    },
    {
        icon: Receipt,
        title: 'Bill Payments',
        description: 'Pay all your bills in one place with automatic payment scheduling.',
        color: 'bg-orange-500',
    },
    {
        icon: PiggyBank,
        title: 'Personal Loans',
        description: 'Quick approvals with low interest rates for all your needs.',
        color: 'bg-pink-500',
    },
    {
        icon: Building2,
        title: 'Business Banking',
        description: 'Comprehensive solutions for businesses of all sizes.',
        color: 'bg-indigo-500',
    },
]

export function Services() {
    return (
        <section id="services" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Our Banking Services
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to manage your finances efficiently in one place.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service: any, index: number) => (
                        <div
                            key={index}
                            className="service-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-6 animate-scale-in`} style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
                                <service.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
