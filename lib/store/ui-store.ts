import { create } from 'zustand'

interface UIStore {
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  selectedBranch: 'All Branches',
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  isDarkMode: false,
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
}))
