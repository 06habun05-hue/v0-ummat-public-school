import { create } from 'zustand'

export type UserRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'ACCOUNTANT' | 'TEACHER' | 'COORDINATOR' | 'PRINCIPAL'

interface UIStore {
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  
  role: UserRole
  setRole: (role: UserRole) => void
  userName: string
  userAvatar: string
  userEmail: string
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
  setAuthDetails: (details: { role: UserRole, name: string, email: string, avatar: string, isAuthenticated: boolean }) => void
  logout: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  selectedBranch: 'Main Campus',
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  isDarkMode: false,
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  
  role: 'SUPER_ADMIN',
  userName: '',
  userAvatar: '',
  userEmail: '',
  isAuthenticated: false,
  
  setRole: (role) => set({ role }),
  setIsAuthenticated: (v) => set({ isAuthenticated: v }),
  setAuthDetails: (details) => set({
    role: details.role,
    userName: details.name,
    userEmail: details.email,
    userAvatar: details.avatar,
    isAuthenticated: details.isAuthenticated
  }),
  logout: () => {
    // Local state clear; real sign out should happen via Stack Auth client
    set({ 
      isAuthenticated: false,
      userName: '',
      userEmail: '',
      userAvatar: ''
    })
  },
}))
