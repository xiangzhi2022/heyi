import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
    persist(
        (set, get) => ({
            // State
            user: {
                name: 'Guest',
                avatar: '',
                role: 'visitor'
            },
            isAuthenticated: false,
            walletAddress: null,

            // Actions
            login: (userData) => set({
                user: userData,
                isAuthenticated: true
            }),

            logout: () => set({
                user: { name: 'Guest', avatar: '', role: 'visitor' },
                isAuthenticated: false,
                walletAddress: null
            }),

            connectWallet: (address) => set({ walletAddress: address }),

            disconnectWallet: () => set({ walletAddress: null }),

            updateProfile: (updates) => set((state) => ({
                user: { ...state.user, ...updates }
            })),
        }),
        {
            name: 'user-storage',
        }
    )
);
