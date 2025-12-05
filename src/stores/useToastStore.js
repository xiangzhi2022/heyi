import { create } from 'zustand';

export const useToastStore = create((set) => ({
    // State
    toasts: [],

    // Actions
    addToast: (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        set((state) => ({
            toasts: [...state.toasts, { id, message, type, duration }]
        }));

        // 自动移除
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(t => t.id !== id)
            }));
        }, duration);
    },

    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
    })),

    clearToasts: () => set({ toasts: [] }),
}));
