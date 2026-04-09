'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { registerUser, resendOtp, ApiError } from '@/lib/token'

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            await registerUser(formData.name, formData.email, formData.password)
            sessionStorage.setItem('pendingEmail', formData.email)
            router.push('/otp')
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 400 && err.detail.toLowerCase().includes('already registered')) {
                    sessionStorage.setItem('pendingEmail', formData.email)
                    try {
                        await resendOtp(formData.email)
                    } catch (resendErr) {
                        console.error('Failed to resend OTP for existing user', resendErr)
                    }
                    setError(err.detail)
                    router.push('/otp')
                    return
                }
                setError(err.detail)
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
    <ScrollReveal>
        <div className="min-h-screen flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-700 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img 
                        src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80" 
                        alt="Banking" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-700/80"></div>
                <div className="max-w-lg text-white animate-fade-in relative z-10">
                    <h2 className="text-4xl font-bold mb-6">Join Caden Trusts</h2>
                    <p className="text-lg opacity-90 mb-8">
                        Start your journey to financial freedom with our secure and innovative banking platform.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold">Secure Account</p>
                                <p className="text-sm opacity-80">Your data is protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold">Easy Setup</p>
                                <p className="text-sm opacity-80">Get started in minutes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 animate-fade-in">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <Shield className="w-8 h-8 text-primary" />
                            <span className="text-xl font-bold text-primary">Caden Trusts</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Enter your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            icon={<User className="w-5 h-5" />}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            icon={<Mail className="w-5 h-5" />}
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            icon={<Lock className="w-5 h-5" />}
                            required
                        />

                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>
                            </span>
                        </div>

                        <Button type="submit" className="w-full" loading={loading}>
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </ScrollReveal>
  )
}


