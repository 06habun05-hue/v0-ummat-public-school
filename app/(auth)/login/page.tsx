import Image from 'next/image'
import { SignIn } from '@stackframe/stack'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary/80 flex-col justify-center items-center p-8 text-primary-foreground">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-xl">
            <Image src="/logo.jpg" alt="Ummat Logo" width={80} height={80} className="object-contain" />
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
              <Image src="/logo.jpg" alt="Ummat Logo" width={48} height={48} className="object-contain" />
            </div>
            <h1 className="text-2xl font-heading font-black text-foreground tracking-tight">Ummat</h1>
          </div>

          <SignIn fullPage />
        </div>
      </div>
    </div>
  )
}
