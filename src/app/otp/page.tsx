'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore, User, AuthState } from '@/store'

export default function OTPPage() {
    const router = useRouter()
    const login = useAuthStore((state: AuthState) => state.login)
    const [otp, setOTP] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendTimer, setResendTimer] = useState(60)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const timer = setInterval(() => {
            setResendTimer((prev: number) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return

        const newOTP = [...otp]
        newOTP[index] = value
        setOTP(newOTP)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        const newOTP = pastedData.split('').map((char: string) => (isNaN(Number(char)) ? '' : char))
        setOTP([...newOTP, ...Array(6 - newOTP.length).fill('')])
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const otpValue = otp.join('')

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulate OTP verification (any 6-digit code works for demo)
        if (otpValue.length !== 6) {
            setError('Please enter a valid 6-digit OTP')
            setLoading(false)
            return
        }

        // Get pending user from session storage
        const pendingUserData = sessionStorage.getItem('pendingUser')
        if (pendingUserData) {
            const pendingUser = JSON.parse(pendingUserData) as User
            login(pendingUser)
            sessionStorage.removeItem('pendingUser')
            
            // Set auth cookie
            document.cookie = 'auth-token=true; path=/; max-age=86400'

            // Redirect based on role
            if (pendingUser.role === 'admin') {
                router.push('/admin')
            } else {
                router.push('/dashboard')
            }
        } else {
            // Default redirect if no pending user
            router.push('/dashboard')
        }

        setLoading(false)
    }

    const handleResend = () => {
        setResendTimer(60)
        // Simulate resend
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md">
                <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Login</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
                        <p className="text-gray-600">
                            We've sent a 6-digit code to your email. Enter it below to verify your identity.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            ))}
                        </div>

                        <Button type="submit" className="w-full" loading={loading}>
                            Verify Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        {resendTimer > 0 ? (
                            <p className="text-gray-500 text-sm">
                                Resend code in <span className="font-medium text-primary">{resendTimer}s</span>
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="text-primary font-medium hover:underline text-sm"
                            >
                                Resend Verification Code
                            </button>
                        )}
                    </div>
                </div>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Demo OTP: Enter any 6 digits
                </p>
            </div>
        </div>
    )
}
