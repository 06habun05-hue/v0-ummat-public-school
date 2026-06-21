"use client"

import { NeonAuthUIProvider as BaseNeonAuthUIProvider } from '@neondatabase/neon-js/auth/react/ui'

export function NeonAuthUIProvider({ 
  children, 
  authClient 
}: { 
  children: React.ReactNode
  authClient: any 
}) {
  return (
    <BaseNeonAuthUIProvider authClient={authClient}>
      {children}
    </BaseNeonAuthUIProvider>
  )
}
