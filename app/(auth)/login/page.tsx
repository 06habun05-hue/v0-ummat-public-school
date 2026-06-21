"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShieldAlert, GraduationCap, Wallet, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useUIStore, UserRole } from '@/lib/store/ui-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const demoRoles: { role: UserRole, label: string, icon: any, color: string, bg: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Admin Portal', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10 hover:bg-rose-500/20' },
  { role: 'TEACHER', label: 'Teacher Portal', icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20' },
  { role: 'ACCOUNTANT', label: 'Accountant Portal', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-500/10 hover:bg-amber-500/20' },
]

export default function LoginPage() {
  const router = useRouter()
  const setAuthDetails = useUIStore((state) => state.setAuthDetails)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API delay, then default to Admin
    setTimeout(() => {
      handleDemoLogin('SUPER_ADMIN')
    }, 1500)
  }

  const handleDemoLogin = (role: UserRole) => {
    setAuthDetails({
      role,
      name: 'Demo ' + role.replace('_', ' '),
      email: `demo.${role.toLowerCase()}@ummat.edu`,
      avatar: '',
      isAuthenticated: true
    })
    router.push('/')
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary/80 flex-col justify-center items-center p-8 text-primary-foreground relative overflow-hidden">
        {/* Subtle background patterns could go here */}
        <div className="max-w-md text-center z-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-2xl"
          >
            <Image src="/logo.jpg" alt="Ummat Logo" width={80} height={80} className="object-contain" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl font-heading font-black mb-4 tracking-tight">Ummat Systems</h1>
            <p className="text-lg font-medium opacity-90 mb-8 leading-relaxed text-primary-foreground/90">
              Enterprise academic management platform for modern institutions
            </p>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5 text-left"
          >
            {[
              "Comprehensive student and teacher management",
              "Real-time attendance and assessment tracking",
              "Advanced analytics and financial reporting"
            ].map((text, i) => (
              <div key={i} className="flex gap-4 items-center bg-black/10 p-4 rounded-2xl backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">✓</span>
                </div>
                <p className="font-medium">{text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md border border-border">
              <Image src="/logo.jpg" alt="Ummat Logo" width={48} height={48} className="object-contain" />
            </div>
            <h1 className="text-2xl font-heading font-black text-foreground tracking-tight">Ummat Systems</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-heading font-black tracking-tight mb-2">Welcome Back</h2>
            <p className="text-muted-foreground font-medium">Please sign in to your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 mb-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold">Password</Label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </Button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-black tracking-widest">Or test a demo portal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {demoRoles.map((demo) => {
              const Icon = demo.icon
              return (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleDemoLogin(demo.role)}
                  className={`flex items-center justify-between p-4 rounded-xl border border-transparent transition-all duration-300 group ${demo.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm ${demo.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-foreground">{demo.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
