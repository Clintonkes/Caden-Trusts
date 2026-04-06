'use client'

import React from 'react'
import { Shield, Lock, Eye, Bell, Server, UserCheck } from 'lucide-react'

const securityFeatures = [
    {
        icon: Lock,
        title: 'SSL Encryption',
        description: 'All data is encrypted using industry-standard 256-bit SSL encryption.',
    },
    {
        icon: UserCheck,
        title: 'Two-Factor Authentication',
        description: 'Add an extra layer of security with 2FA for all your transactions.',
    },
    {
        icon: Eye,
        title: 'Fraud Detection',
        description: 'AI-powered fraud detection system monitors your account 24/7.',
    },
    {
        icon: Server,
        title: 'Secure Servers',
        description: 'Your data is stored in highly secure, redundant data centers.',
    },
    {
        icon: Shield,
        title: 'Account Protection',
        description: 'Instant alerts and freeze options to protect your account.',
    },
    {
        icon: Bell,
        title: 'Real-time Notifications',
        description: 'Get instant notifications for all account activities.',
    },
]

export function Security() {
    return (
        <section id="security" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Bank-Grade Security
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your security is our top priority. We use advanced technology to keep your money safe.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {securityFeatures.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className="flex gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors duration-300 hover:-translate-y-1 animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center animate-scale-in" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Shield className="w-6 h-6" />
                        <span className="font-medium">FDIC Insured</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Lock className="w-6 h-6" />
                        <span className="font-medium">256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <UserCheck className="w-6 h-6" />
                        <span className="font-medium">PCI Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Server className="w-6 h-6" />
                        <span className="font-medium">SOC 2 Certified</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
