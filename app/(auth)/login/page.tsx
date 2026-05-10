'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUIStore } from '@/lib/store/ui-store'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  branch: z.string().min(1, 'Please select a branch'),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setIsAuthenticated, setRole, setSelectedBranch } = useUIStore()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const [selectedBranchInForm, setSelectedBranchInForm] = useState('Main Campus')
  
  const setBranch = (b: string) => {
    setSelectedBranchInForm(b)
    setValue('branch', b)
  }

  const branches = ['Main Campus', 'North Campus', 'South Campus']

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      // Dummy authentication logic
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const { email, password, branch } = data
      
      if (email === 'admin@ummat.edu' && password === 'admin123') {
        setRole('SUPER_ADMIN')
      } else if (email === 'teacher@ummat.edu' && password === 'teacher123') {
        setRole('TEACHER')
      } else if (email === 'accountant@ummat.edu' && password === 'account123') {
        setRole('ACCOUNTANT')
      } else if (email === 'north.admin@ummat.edu' && password === 'admin123') {
        setRole('BRANCH_ADMIN')
      } else if (email === 'south.admin@ummat.edu' && password === 'admin123') {
        setRole('BRANCH_ADMIN')
      } else {
        toast.error('Invalid credentials. Try admin@ummat.edu / admin123')
        return
      }

      setIsAuthenticated(true)
      setSelectedBranch(branch)
      toast.success('Login successful!')
      router.push('/')
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary/80 flex-col justify-center items-center p-8 text-primary-foreground">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-xl">
            <Image src="/logo.png" alt="Ummat Logo" width={80} height={80} className="object-contain" />
          </div>
          <h1 className="text-4xl font-heading font-black mb-4 tracking-tight">Ummat Systems</h1>
          <p className="text-lg font-medium opacity-90 mb-8 leading-relaxed">
            Enterprise academic management platform for modern institutions
          </p>
          <div className="space-y-4 text-left">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs">✓</span>
              </div>
              <p>Comprehensive student and teacher management</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs">✓</span>
              </div>
              <p>Real-time attendance and assessment tracking</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs">✓</span>
              </div>
              <p>Advanced analytics and reporting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md border border-border">
              <Image src="/logo.png" alt="Ummat Logo" width={48} height={48} className="object-contain" />
            </div>
            <h1 className="text-2xl font-heading font-black text-foreground tracking-tight">Ummat</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-danger mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-4">
                Select Branch <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {branches.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 group",
                      selectedBranchInForm === b
                        ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      selectedBranchInForm === b ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <Building2 size={20} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-tighter text-center leading-tight",
                      selectedBranchInForm === b ? "text-primary" : "text-muted-foreground"
                    )}>
                      {b.split(' ')[0]}<br/>{b.split(' ')[1] || ''}
                    </span>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('branch')} value={selectedBranchInForm} />
              {errors.branch && (
                <p className="text-xs text-danger mt-1.5">{errors.branch.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background cursor-pointer"
                />
                <span className="text-sm text-foreground">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
