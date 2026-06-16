import { useEffect } from 'react'
import { useUser } from '@stackframe/stack'
import { useUIStore, UserRole } from '@/lib/store/ui-store'

export function useSession() {
  const user = useUser()
  const { setAuthDetails } = useUIStore()

  useEffect(() => {
    async function hydrate() {
      if (user) {
        // TODO: In Phase 3, we will call a Server Action to fetch the user's role and branch
        // from our local `users` table.
        // For now, we default to SUPER_ADMIN so the dashboard loads.
        const role: UserRole = 'SUPER_ADMIN'
        
        setAuthDetails({
          isAuthenticated: true,
          role: role,
          name: user.displayName || 'Stack User',
          email: user.primaryEmail || '',
          avatar: user.profileImageUrl || '',
        })
      } else {
        setAuthDetails({
          isAuthenticated: false,
          role: 'SUPER_ADMIN',
          name: '',
          email: '',
          avatar: '',
        })
      }
    }
    
    hydrate()
  }, [user, setAuthDetails])
  
  return { user }
}
