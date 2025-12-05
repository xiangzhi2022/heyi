import { create } from 'zustand';

export const useSearchStore = create((set, get) => ({
    // State
    searchTerm: '',
    searchHistory: [],
    isSearching: false,

    // Actions
    setSearchTerm: (term) => set({ searchTerm: term }),

    addToHistory: (term) => set((state) => ({
        searchHistory: [term, ...state.searchHistory.filter(t => t !== term)].slice(0, 10)
    })),

    clearHistory: () => set({ searchHistory: [] }),

    setSearching: (isSearching) => set({ isSearching }),
}));
