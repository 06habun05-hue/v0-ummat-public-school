import { create } from 'zustand'

export type UserRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'ACCOUNTANT' | 'TEACHER'

interface UIStore {
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  role: UserRole
  setRole: (role: UserRole) => void
}

export const useUIStore = create<UIStore>((set) => ({
  selectedBranch: 'All Branches',
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  isDarkMode: false,
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  role: 'SUPER_ADMIN',
  setRole: (role) => set({ role }),
}))
