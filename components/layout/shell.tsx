'use client'

import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { usePathname } from 'next/navigation'
import { PageTransition } from './page-transition'

const authPaths = ['/login']

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = authPaths.some(path => pathname.startsWith(path))

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
