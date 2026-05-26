import { create } from 'zustand'

export type UserRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'ACCOUNTANT' | 'TEACHER'

export interface UserProfile {
  name: string
  avatar: string
  email: string
}

export const ROLE_USER_PRESETS: Record<UserRole, UserProfile> = {
  SUPER_ADMIN: { name: 'John Doe', avatar: 'JD', email: 'john.doe@ummat.edu' },
  BRANCH_ADMIN: { name: 'Admin Khalid', avatar: 'AK', email: 'khalid@ummat.edu' },
  ACCOUNTANT: { name: 'Accountant Sara', avatar: 'AS', email: 'sara@ummat.edu' },
  TEACHER: { name: 'Ms. Sana Malik', avatar: 'SM', email: 'sana@ummat.edu' },
}

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
  userName: ROLE_USER_PRESETS.SUPER_ADMIN.name,
  userAvatar: ROLE_USER_PRESETS.SUPER_ADMIN.avatar,
  userEmail: ROLE_USER_PRESETS.SUPER_ADMIN.email,
  setRole: (role) => set({ 
    role,
    userName: ROLE_USER_PRESETS[role].name,
    userAvatar: ROLE_USER_PRESETS[role].avatar,
    userEmail: ROLE_USER_PRESETS[role].email,
  }),
  isAuthenticated: false,
  setIsAuthenticated: (v) => set({ isAuthenticated: v }),
  logout: () => set({ 
    isAuthenticated: false, 
    role: 'SUPER_ADMIN',
    userName: ROLE_USER_PRESETS.SUPER_ADMIN.name,
    userAvatar: ROLE_USER_PRESETS.SUPER_ADMIN.avatar,
    userEmail: ROLE_USER_PRESETS.SUPER_ADMIN.email,
  }),
}))

