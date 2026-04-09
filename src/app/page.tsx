'use client'

import { CurrencyTicker } from '@/components/public/CurrencyTicker'
import { Navigation } from '@/components/public/Navigation'
import { Hero } from '@/components/public/Hero'
import { Services } from '@/components/public/Services'
import { Security } from '@/components/public/Security'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export default function Home() {
    return (
        <main className="min-h-screen">
            <CurrencyTicker />
            <Navigation />
            <ScrollReveal direction="up" delay={50}>
                <Hero />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={120}>
                <Services />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={180}>
                <Security />
            </ScrollReveal>

            {/* Footer */}
            <ScrollReveal direction="up" delay={220}>
                <footer className="bg-dark text-gray-400 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <h3 className="text-white font-bold text-lg mb-4">Caden Trusts</h3>
                                <p className="text-sm">Secure banking for your future. Experience the next generation of digital banking.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-4">Services</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Personal Banking</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Business Banking</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Loans</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Investments</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-4">Company</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-4">Legal</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-8 text-sm text-center">
                            <p>&copy; 2024 Caden Trusts Bank. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </ScrollReveal>
        </main>
    )
}

