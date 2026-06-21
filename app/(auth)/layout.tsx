import { NeonAuthUIProvider } from '@/components/providers/neon-auth-provider'
import '@neondatabase/neon-js/ui/css'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NeonAuthUIProvider>
      {children}
    </NeonAuthUIProvider>
  )
}
