'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { verifyOtp, ApiError, resendOtp } from '@/lib/token'

export default function OTPPage() {
    const router = useRouter()
    const [otp, setOTP] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [resendTimer, setResendTimer] = useState(60)
    const [resending, setResending] = useState(false)
    const [email, setEmail] = useState('')
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const pendingEmail = sessionStorage.getItem('pendingEmail')
        if (pendingEmail) {
            setEmail(pendingEmail)
        } else {
            router.push('/signup')
        }

        const timer = setInterval(() => {
            setResendTimer((prev: number) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [router])

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
        setSuccess('')

        const otpValue = otp.join('')

        if (otpValue.length !== 6) {
            setError('Please enter a valid 6-digit OTP')
            setLoading(false)
            return
        }

        try {
            await verifyOtp(email, otpValue)
            setSuccess('Email verified successfully! Redirecting to login...')
            sessionStorage.removeItem('pendingEmail')
            setTimeout(() => {
                router.push('/login')
            }, 1500)
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.detail)
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResendTimer(60)
        setError('')
        setResending(true)

        try {
            await resendOtp(email)
            setSuccess('A new OTP has been sent to your email.')
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.detail)
            } else {
                setError('Failed to resend OTP. Please try again.')
            }
        } finally {
            setResending(false)
        }
    }

    return (
    <ScrollReveal>
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
                            We&apos;ve sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify your identity.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm mb-6">
                                {success}
                            </div>
                        )}

                        <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
                            {otp.map((digit: string, index: number) => (
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
                                className="text-primary font-medium hover:underline text-sm disabled:opacity-50"
                                disabled={resending}
                            >
                                {resending ? 'Resending OTP...' : 'Resend Verification Code'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </ScrollReveal>
    )
}
