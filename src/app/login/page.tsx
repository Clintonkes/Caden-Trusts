'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore, useUIStore, AuthState, UIState } from '@/store'
import { loginUser, ApiError, tokenManager } from '@/lib/token'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state: AuthState) => state.login)
  const addToast = useUIStore((state: UIState) => state.addToast)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginUser(email, password)

      tokenManager.setToken(response.token!)
      tokenManager.setUser(response.user!)

      login({
        id: String(response.user!.id),
        name: response.user!.name,
        email: response.user!.email,
        role: response.user!.role,
        accountNumber: response.user!.accountNumber,
        balance: response.user!.balance,
        isActive: true,
      })

      addToast({
        id: Date.now().toString(),
        message: 'Login successful!',
        type: 'success',
      })

      if (response.user!.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          sessionStorage.setItem('pendingEmail', email)
          addToast({
            id: Date.now().toString(),
            message: err.detail,
            type: 'warning',
          })
          router.push('/otp')
          return
        }
        setError(err.detail)
        addToast({
          id: Date.now().toString(),
          message: err.detail,
          type: 'error',
        })
      } else {
        const msg = 'An unexpected error occurred. Please try again.'
        setError(msg)
        addToast({
          id: Date.now().toString(),
          message: msg,
          type: 'error',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollReveal>
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 animate-fade-in">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary">Caden Trusts</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" 
            alt="Banking" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-700/80"></div>
        <div className="max-w-lg text-white animate-fade-in relative z-10">
          <h2 className="text-4xl font-bold mb-6">Secure Banking Experience</h2>
          <p className="text-lg opacity-90 mb-8">
            Access your accounts securely with our advanced encryption and two-factor authentication.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-3xl font-bold">256-bit</p>
              <p className="text-sm opacity-80">SSL Encryption</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm opacity-80">Fraud Monitoring</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-3xl font-bold">$0</p>
              <p className="text-sm opacity-80">Liability Coverage</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-3xl font-bold">Instant</p>
              <p className="text-sm opacity-80">Alerts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ScrollReveal>
  )
}
