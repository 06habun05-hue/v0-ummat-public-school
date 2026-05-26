'use client'

import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { usePathname } from 'next/navigation'
import { PageTransition } from './page-transition'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUIStore } from '@/lib/store/ui-store'

const authPaths = ['/login']

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useUIStore()
  const isAuthPage = authPaths.some(path => pathname.startsWith(path))

  useEffect(() => {
    if (!isAuthenticated && !isAuthPage) {
      router.push('/login')
    }
  }, [isAuthenticated, isAuthPage, router])

  if (isAuthPage) {
    return <>{children}</>
  }

  // Prevent flash of content while redirecting
  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
