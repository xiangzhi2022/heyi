# 状态管理架构设计

## 🎯 当前状态与问题

### 现状
- 使用 Context API 管理全局状态
- 4个主要 Context: Theme, Toast, Search, Notification
- 嵌套的 Provider 结构

### 潜在问题
1. **性能问题**: Context 更新会导致所有消费者重新渲染
2. **可维护性**: Provider 嵌套过深，代码难以维护
3. **可测试性**: Context 依赖组件树，测试困难
4. **开发体验**: 缺少 DevTools 支持

---

## 🔄 迁移策略

### 阶段 1: 评估与准备（当前）
**目标**: 明确状态管理需求，选择合适方案

**推荐方案**: **Zustand**

**选择理由**:
- ✅ 轻量级（~1KB）
- ✅ 简单易学，API 友好
- ✅ 无需 Provider 包裹
- ✅ 支持 DevTools
- ✅ TypeScript 友好
- ✅ 性能优秀（基于订阅）

**对比其他方案**:
| 特性 | Zustand | Redux Toolkit | Jotai | Recoil |
|------|---------|--------------|-------|--------|
| 学习曲线 | 低 | 中 | 低 | 中 |
| 包大小 | 1KB | 12KB | 3KB | 79KB |
| DevTools | ✅ | ✅ | ✅ | ✅ |
| 异步支持 | ✅ | ✅ | ✅ | ✅ |
| 中间件 | ✅ | ✅ | ❌ | ❌ |

---

### 阶段 2: 渐进式迁移

#### 步骤 1: 安装 Zustand
```bash
npm install zustand
```

#### 步骤 2: 创建 Store 目录结构
```
src/
├── stores/
│   ├── index.js           # 导出所有 stores
│   ├── useThemeStore.js   # 主题状态
│   ├── useToastStore.js   # 通知状态
│   ├── useSearchStore.js  # 搜索状态
│   ├── useNotificationStore.js  # 消息状态
│   ├── useUserStore.js    # 用户状态（新增）
│   └── useAssetStore.js   # 资产状态（新增）
```

#### 步骤 3: 实现 Store（示例）

**主题 Store**
```javascript
// src/stores/useThemeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      isDark: false,
      
      // Actions
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setTheme: (isDark) => set({ isDark }),
      
      // Computed values
      theme: () => get().isDark ? 'dark' : 'light',
    }),
    {
      name: 'theme-storage', // localStorage key
    }
  )
);
```

**Toast Store**
```javascript
// src/stores/useToastStore.js
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
```

**搜索 Store**
```javascript
// src/stores/useSearchStore.js
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
```

**用户 Store（新增）**
```javascript
// src/stores/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      walletAddress: null,
      
      // Actions
      login: (userData) => set({
        user: userData,
        isAuthenticated: true
      }),
      
      logout: () => set({
        user: null,
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
```

**资产 Store（新增）**
```javascript
// src/stores/useAssetStore.js
import { create } from 'zustand';
import { getAllAssets, getAsset, updateAsset } from '../services/mockAssetService';

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
      const assets = await getAllAssets();
      set({ assets, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchAsset: async (id) => {
    set({ loading: true, error: null });
    try {
      const asset = await getAsset(id);
      set({ currentAsset: asset, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateAsset: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateAsset(id, updates);
      set((state) => ({
        assets: state.assets.map(a => a.id === id ? updated : a),
        currentAsset: state.currentAsset?.id === id ? updated : state.currentAsset,
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));
```

#### 步骤 4: 统一导出
```javascript
// src/stores/index.js
export { useThemeStore } from './useThemeStore';
export { useToastStore } from './useToastStore';
export { useSearchStore } from './useSearchStore';
export { useNotificationStore } from './useNotificationStore';
export { useUserStore } from './useUserStore';
export { useAssetStore } from './useAssetStore';
```

---

### 阶段 3: 组件迁移

#### 迁移前（Context API）
```jsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};
```

#### 迁移后（Zustand）
```jsx
import { useThemeStore } from '../stores';

const MyComponent = () => {
  const { isDark, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};
```

#### 性能优化（选择性订阅）
```jsx
// ❌ 不推荐：订阅整个 store
const { isDark, toggleTheme, theme } = useThemeStore();

// ✅ 推荐：只订阅需要的状态
const isDark = useThemeStore(state => state.isDark);
const toggleTheme = useThemeStore(state => state.toggleTheme);
```

---

### 阶段 4: 移除旧 Context

1. 逐个移除 Context Provider
2. 删除 Context 文件
3. 更新 App.jsx

```jsx
// 迁移前
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SearchProvider>
          <NotificationProvider>
            <Router>
              {/* ... */}
            </Router>
          </NotificationProvider>
        </SearchProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

// 迁移后
function App() {
  return (
    <Router>
      {/* ... */}
    </Router>
  );
}
```

---

## 🛠️ 高级功能

### 1. 中间件支持

**日志中间件**
```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAssetStore = create(
  devtools(
    (set) => ({
      // ... store implementation
    }),
    { name: 'AssetStore' }
  )
);
```

**持久化中间件**
```javascript
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      // ... store implementation
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }), // 只持久化部分状态
    }
  )
);
```

### 2. 异步操作

```javascript
export const useAssetStore = create((set) => ({
  assets: [],
  loading: false,
  
  fetchAssets: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/assets');
      const assets = await response.json();
      set({ assets, loading: false });
    } catch (error) {
      set({ loading: false, error });
    }
  },
}));
```

### 3. 计算属性

```javascript
export const useAssetStore = create((set, get) => ({
  assets: [],
  filters: { category: 'all' },
  
  // Computed
  get filteredAssets() {
    const { assets, filters } = get();
    return assets.filter(a => 
      filters.category === 'all' || a.category === filters.category
    );
  },
}));
```

---

## 📊 迁移时间表

| 阶段 | 任务 | 预计时间 | 优先级 |
|------|------|---------|--------|
| 1 | 安装 Zustand，创建基础 stores | 1天 | 高 |
| 2 | 迁移 Theme Store | 0.5天 | 高 |
| 3 | 迁移 Toast Store | 0.5天 | 高 |
| 4 | 迁移 Search Store | 0.5天 | 中 |
| 5 | 迁移 Notification Store | 0.5天 | 中 |
| 6 | 创建 User Store | 1天 | 高 |
| 7 | 创建 Asset Store | 1天 | 高 |
| 8 | 更新所有组件 | 2天 | 高 |
| 9 | 移除旧 Context | 0.5天 | 低 |
| 10 | 测试和优化 | 1天 | 高 |

**总计**: 约 8-9 天

---

## ✅ 检查清单

迁移完成后确保：
- [ ] 所有 Context 已替换为 Zustand stores
- [ ] DevTools 正常工作
- [ ] 持久化状态正确保存和恢复
- [ ] 性能测试通过（无不必要的重渲染）
- [ ] 所有组件测试通过
- [ ] 文档已更新

---

*文档版本: v1.0*
*更新时间: 2025-12-04*
