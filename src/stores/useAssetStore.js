import { create } from 'zustand';
import { getAllAssets, getAsset, saveAsset } from '../services/mockAssetService';

export const useAssetStore = create((set, get) => ({
    // State
    assets: [],
    currentAsset: null,
    loading: false,
    error: null,

    // Actions
    fetchAssets: async () => {
        set({ loading: true, error: null });
        try {
            // 模拟异步
            await new Promise(resolve => setTimeout(resolve, 500));
            const assets = getAllAssets();
            set({ assets, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchAsset: async (id) => {
        set({ loading: true, error: null });
        try {
            // 模拟异步
            await new Promise(resolve => setTimeout(resolve, 300));
            const asset = getAsset(id);
            set({ currentAsset: asset, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    updateAsset: async (updatedAsset) => {
        set({ loading: true, error: null });
        try {
            // 模拟异步
            await new Promise(resolve => setTimeout(resolve, 500));
            saveAsset(updatedAsset);
            set((state) => ({
                assets: state.assets.map(a => a.id === updatedAsset.id ? updatedAsset : a),
                currentAsset: state.currentAsset?.id === updatedAsset.id ? updatedAsset : state.currentAsset,
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
