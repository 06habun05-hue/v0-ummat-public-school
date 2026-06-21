"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShieldAlert, GraduationCap, Wallet, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useUIStore, UserRole } from '@/lib/store/ui-store'

const demoPortals: { role: UserRole; label: string; icon: any; color: string; bg: string; border: string }[] = [
  { role: 'SUPER_ADMIN',  label: 'Admin Portal',      icon: ShieldAlert,    color: 'text-rose-500',    bg: 'hover:bg-rose-50',    border: 'border-rose-100' },
  { role: 'TEACHER',      label: 'Teacher Portal',    icon: GraduationCap,  color: 'text-emerald-600', bg: 'hover:bg-emerald-50', border: 'border-emerald-100' },
  { role: 'ACCOUNTANT',   label: 'Accountant Portal', icon: Wallet,         color: 'text-amber-500',   bg: 'hover:bg-amber-50',   border: 'border-amber-100' },
]

export default function LoginPage() {
  const router = useRouter()
  const setAuthDetails = useUIStore((s) => s.setAuthDetails)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleDemoLogin(role: UserRole) {
    setAuthDetails({
      role,
      name: role === 'SUPER_ADMIN' ? 'Admin User' : role === 'TEACHER' ? 'Teacher User' : 'Accountant User',
      email: `demo@ummat.edu`,
      avatar: '',
      isAuthenticated: true,
    })
    router.push('/')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    // Simulate a brief load then login as admin
    setTimeout(() => { handleDemoLogin('SUPER_ADMIN') }, 1200)
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left: Green Branding Panel ────────────────────────────── */}
      <div className="hidden lg:flex w-[46%] flex-shrink-0 bg-[hsl(133,48%,31%)] flex-col justify-center items-center p-10 text-white">
        <div className="max-w-sm w-full text-center">
          {/* Logo */}
          <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-xl">
            <Image src="/logo.jpg" alt="Ummat Logo" width={88} height={88} className="object-contain rounded-xl" />
          </div>

          <h1 className="text-4xl font-heading font-black mb-3 tracking-tight">Ummat Systems</h1>
          <p className="text-base font-medium opacity-80 mb-10 leading-relaxed">
            Enterprise academic management platform for modern institutions
          </p>

          <div className="space-y-4 text-left">
            {[
              'Comprehensive student and teacher management',
              'Real-time attendance and assessment tracking',
              'Advanced analytics and financial reporting',
            ].map((text) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <p className="text-sm leading-snug opacity-90">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow border border-gray-100">
              <Image src="/logo.jpg" alt="Ummat Logo" width={48} height={48} className="object-contain" />
            </div>
            <p className="text-xl font-heading font-black text-gray-900">Ummat Systems</p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-heading font-black text-gray-900 tracking-tight mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(133,48%,31%)] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-[hsl(133,48%,31%)] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(133,48%,31%)] focus:border-transparent transition"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[hsl(133,48%,31%)] hover:bg-[hsl(133,48%,27%)] text-white text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400 font-semibold uppercase tracking-widest">
                Or demo a portal
              </span>
            </div>
          </div>

          {/* Demo portals */}
          <div className="space-y-2.5">
            {demoPortals.map(({ role, label, icon: Icon, color, bg, border }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoLogin(role)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border ${border} bg-white ${bg} transition-all duration-200 group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:text-gray-700 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
