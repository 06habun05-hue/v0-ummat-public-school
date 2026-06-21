"use client"

import { NeonAuthUIProvider as BaseNeonAuthUIProvider } from '@neondatabase/neon-js/auth/react/ui'
import { neonAuthClient } from '@/lib/auth'

export function NeonAuthUIProvider({ 
  children
}: { 
  children: React.ReactNode
}) {
  return (
    <BaseNeonAuthUIProvider authClient={neonAuthClient}>
      {children}
    </BaseNeonAuthUIProvider>
  )
}
