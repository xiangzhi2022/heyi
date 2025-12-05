import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 辅助函数：应用主题到 DOM
const applyTheme = (isDark) => {
    if (typeof window !== 'undefined') {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
};

export const useThemeStore = create(
    persist(
        (set, get) => ({
            // State
            isDark: false,

            // Actions
            toggleTheme: () => {
                set((state) => {
                    const newIsDark = !state.isDark;
                    applyTheme(newIsDark);
                    return { isDark: newIsDark };
                });
            },
            setTheme: (isDark) => {
                applyTheme(isDark);
                set({ isDark });
            },

            // Computed values
            theme: () => get().isDark ? 'dark' : 'light',
        }),
        {
            name: 'theme-storage', // localStorage key
            onRehydrateStorage: () => (state) => {
                // 从 localStorage 恢复后，应用主题到 DOM
                if (state) {
                    applyTheme(state.isDark);
                }
            },
        }
    )
);

// 初始化：从 localStorage 读取并应用主题
// 修复：强制清除旧的主题设置，防止页面自动变黑
if (typeof window !== 'undefined') {
    // 1. 清除 localStorage 中的主题设置
    localStorage.removeItem('theme-storage');

    // 2. 强制移除 HTML 标签上的 dark 类，确保是浅色模式
    document.documentElement.classList.remove('dark');
}
