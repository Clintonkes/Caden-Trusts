'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Lock, CreditCard } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            <span>Bank with Confidence</span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Secure Banking for Your
                            <span className="text-primary"> Future</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Experience next-generation digital banking with enterprise-grade security.
                            Manage your finances with complete peace of mind.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-primary-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                Open Account
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg font-medium text-lg hover:bg-primary-50 transition-all duration-300"
                            >
                                Login
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-primary" />
                                <span>256-bit Encryption</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <span>FDIC Insured</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="relative animate-slide-up">
                        <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                            {/* Card Mockup */}
                            <div className="bg-gradient-to-br from-primary to-primary-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <p className="text-sm opacity-80">Account Balance</p>
                                        <p className="text-3xl font-bold">$125,430.00</p>
                                    </div>
                                    <CreditCard className="w-10 h-10 opacity-80" />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm opacity-80">Account Holder</p>
                                        <p className="font-medium">John Doe</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm opacity-80">**** 4829</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500">Monthly Income</p>
                                    <p className="text-xl font-bold text-gray-900">$8,450</p>
                                    <p className="text-xs text-green-600">+12% from last month</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500">Monthly Spending</p>
                                    <p className="text-xl font-bold text-gray-900">$3,210</p>
                                    <p className="text-xs text-red-500">-5% from last month</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-100 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-50 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
