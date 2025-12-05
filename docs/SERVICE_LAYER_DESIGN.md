# 服务层抽象设计

## 🎯 设计目标

创建清晰的服务层接口，使前端代码与数据源解耦，便于从 mock 数据切换到真实 API。

---

## 📋 当前问题

### 现状
```javascript
// 组件直接调用 mockAssetService
import { getAllAssets, getAsset } from '../services/mockAssetService';

const MyComponent = () => {
  const assets = getAllAssets();
  // ...
};
```

### 问题
1. **强耦合**: 组件直接依赖 mock 服务
2. **难以切换**: 切换到真实 API 需要修改所有组件
3. **测试困难**: 难以 mock 数据源
4. **缺少类型**: 没有明确的接口定义

---

## 🏗️ 架构设计

### 三层架构

```
┌─────────────────────────────────────┐
│         组件层 (Components)          │
│  - 只关心 UI 渲染和用户交互          │
│  - 通过 hooks 调用服务               │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│      服务层 (Service Layer)          │
│  - 定义统一的接口                    │
│  - 处理业务逻辑                      │
│  - 数据转换和验证                    │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│      数据源层 (Data Source)          │
│  - Mock 实现 (开发/测试)             │
│  - API 实现 (生产环境)               │
│  - 缓存层 (可选)                     │
└─────────────────────────────────────┘
```

---

## 📁 目录结构

```
src/
├── services/
│   ├── api/                    # API 实现
│   │   ├── assetApi.js        # 资产 API
│   │   ├── userApi.js         # 用户 API
│   │   ├── transactionApi.js  # 交易 API
│   │   └── index.js
│   │
│   ├── mock/                   # Mock 实现
│   │   ├── mockAssetService.js
│   │   ├── mockUserService.js
│   │   └── index.js
│   │
│   ├── interfaces/             # 接口定义
│   │   ├── IAssetService.js
│   │   ├── IUserService.js
│   │   └── index.js
│   │
│   ├── config.js              # 服务配置
│   └── index.js               # 统一导出
│
└── hooks/                      # 自定义 hooks
    ├── useAssets.js
    ├── useAsset.js
    ├── useUser.js
    └── index.js
```

---

## 🔧 接口定义

### IAssetService 接口

```typescript
// src/services/interfaces/IAssetService.js

/**
 * 资产服务接口
 * 所有资产相关的数据操作必须实现此接口
 */
export interface IAssetService {
  /**
   * 获取所有资产
   * @returns Promise<Asset[]>
   */
  getAllAssets(): Promise<Asset[]>;
  
  /**
   * 根据 ID 获取单个资产
   * @param id - 资产 ID
   * @returns Promise<Asset | null>
   */
  getAsset(id: string | number): Promise<Asset | null>;
  
  /**
   * 创建新资产
   * @param assetData - 资产数据
   * @returns Promise<Asset>
   */
  createAsset(assetData: CreateAssetDto): Promise<Asset>;
  
  /**
   * 更新资产
   * @param id - 资产 ID
   * @param updates - 更新数据
   * @returns Promise<Asset>
   */
  updateAsset(id: string | number, updates: Partial<Asset>): Promise<Asset>;
  
  /**
   * 删除资产
   * @param id - 资产 ID
   * @returns Promise<boolean>
   */
  deleteAsset(id: string | number): Promise<boolean>;
  
  /**
   * 搜索资产
   * @param query - 搜索条件
   * @returns Promise<Asset[]>
   */
  searchAssets(query: SearchQuery): Promise<Asset[]>;
  
  /**
   * 获取资产统计
   * @returns Promise<AssetStats>
   */
  getAssetStats(): Promise<AssetStats>;
}

// 数据类型定义
export interface Asset {
  id: string | number;
  title: string;
  author: string;
  owner: string;
  price: string;
  currency: string;
  imageColor: string;
  imageUrl?: string;
  likes: number;
  views: number;
  type: 'image' | 'music' | 'video' | 'literature';
  scriptType?: 'short-drama' | 'long-drama' | 'unit-series';
  isListed: boolean;
  description: string;
  properties: Property[];
  history: HistoryEvent[];
  priceHistory: PricePoint[];
  salesModes: SalesMode[];
  isFullCopyrightTransfer: boolean;
  licenseTypes: LicenseType[];
  auctionSettings: AuctionSettings;
  leaseSettings: LeaseSettings;
}

export interface CreateAssetDto {
  title: string;
  description: string;
  type: Asset['type'];
  price: string;
  // ... 其他必需字段
}

export interface SearchQuery {
  keyword?: string;
  type?: Asset['type'];
  minPrice?: number;
  maxPrice?: number;
  author?: string;
  // ... 其他筛选条件
}

export interface AssetStats {
  total: number;
  byType: Record<string, number>;
  totalValue: number;
  averagePrice: number;
}
```

---

## 💻 实现示例

### Mock 实现

```javascript
// src/services/mock/mockAssetService.js

import { IAssetService } from '../interfaces/IAssetService';

class MockAssetService implements IAssetService {
  constructor() {
    this.storageKey = 'heyi_assets_data_v2';
    this.initializeData();
  }

  initializeData() {
    // 初始化逻辑...
  }

  async getAllAssets() {
    // 模拟网络延迟
    await this.delay(100);
    
    const data = localStorage.getItem(this.storageKey);
    const assets = data ? JSON.parse(data) : this.getInitialAssets();
    return Object.values(assets);
  }

  async getAsset(id) {
    await this.delay(50);
    
    const data = localStorage.getItem(this.storageKey);
    const assets = data ? JSON.parse(data) : {};
    return assets[id] || null;
  }

  async createAsset(assetData) {
    await this.delay(200);
    
    const data = localStorage.getItem(this.storageKey);
    const assets = data ? JSON.parse(data) : {};
    
    const newAsset = {
      id: Date.now(),
      ...assetData,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    };
    
    assets[newAsset.id] = newAsset;
    localStorage.setItem(this.storageKey, JSON.stringify(assets));
    
    return newAsset;
  }

  async updateAsset(id, updates) {
    await this.delay(150);
    
    const data = localStorage.getItem(this.storageKey);
    const assets = data ? JSON.parse(data) : {};
    
    if (!assets[id]) {
      throw new Error(`Asset ${id} not found`);
    }
    
    assets[id] = { ...assets[id], ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(assets));
    
    return assets[id];
  }

  async deleteAsset(id) {
    await this.delay(100);
    
    const data = localStorage.getItem(this.storageKey);
    const assets = data ? JSON.parse(data) : {};
    
    if (!assets[id]) {
      return false;
    }
    
    delete assets[id];
    localStorage.setItem(this.storageKey, JSON.stringify(assets));
    
    return true;
  }

  async searchAssets(query) {
    await this.delay(150);
    
    const allAssets = await this.getAllAssets();
    
    return allAssets.filter(asset => {
      if (query.keyword && !asset.title.includes(query.keyword)) {
        return false;
      }
      if (query.type && asset.type !== query.type) {
        return false;
      }
      if (query.minPrice || query.maxPrice) {
        const price = parseFloat(asset.price.replace(/,/g, ''));
        if (query.minPrice && price < query.minPrice) return false;
        if (query.maxPrice && price > query.maxPrice) return false;
      }
      return true;
    });
  }

  async getAssetStats() {
    await this.delay(100);
    
    const assets = await this.getAllAssets();
    
    const byType = assets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {});
    
    const totalValue = assets.reduce((sum, asset) => {
      return sum + parseFloat(asset.price.replace(/,/g, '') || 0);
    }, 0);
    
    return {
      total: assets.length,
      byType,
      totalValue,
      averagePrice: totalValue / assets.length,
    };
  }

  // 辅助方法
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getInitialAssets() {
    // 返回初始数据...
  }
}

export default new MockAssetService();
```

### API 实现

```javascript
// src/services/api/assetApi.js

import { IAssetService } from '../interfaces/IAssetService';
import { apiClient } from './apiClient';

class AssetApiService implements IAssetService {
  constructor() {
    this.baseUrl = '/api/assets';
  }

  async getAllAssets() {
    const response = await apiClient.get(this.baseUrl);
    return response.data;
  }

  async getAsset(id) {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createAsset(assetData) {
    const response = await apiClient.post(this.baseUrl, assetData);
    return response.data;
  }

  async updateAsset(id, updates) {
    const response = await apiClient.patch(`${this.baseUrl}/${id}`, updates);
    return response.data;
  }

  async deleteAsset(id) {
    await apiClient.delete(`${this.baseUrl}/${id}`);
    return true;
  }

  async searchAssets(query) {
    const response = await apiClient.get(`${this.baseUrl}/search`, {
      params: query
    });
    return response.data;
  }

  async getAssetStats() {
    const response = await apiClient.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export default new AssetApiService();
```

### API Client 配置

```javascript
// src/services/api/apiClient.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 未授权，跳转登录
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient };
```

---

## 🔌 服务配置与切换

```javascript
// src/services/config.js

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

export const serviceConfig = {
  useMock: USE_MOCK,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};
```

```javascript
// src/services/index.js

import { serviceConfig } from './config';
import mockAssetService from './mock/mockAssetService';
import assetApiService from './api/assetApi';

// 根据配置选择服务实现
export const assetService = serviceConfig.useMock 
  ? mockAssetService 
  : assetApiService;

// 同样的方式导出其他服务
export { default as userService } from './userService';
export { default as transactionService } from './transactionService';
```

---

## 🪝 自定义 Hooks

```javascript
// src/hooks/useAssets.js

import { useState, useEffect } from 'react';
import { assetService } from '../services';

export const useAssets = (options = {}) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const data = await assetService.getAllAssets();
        setAssets(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const refetch = async () => {
    const data = await assetService.getAllAssets();
    setAssets(data);
  };

  return { assets, loading, error, refetch };
};
```

```javascript
// src/hooks/useAsset.js

import { useState, useEffect } from 'react';
import { assetService } from '../services';

export const useAsset = (id) => {
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAsset = async () => {
      try {
        setLoading(true);
        const data = await assetService.getAsset(id);
        setAsset(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const updateAsset = async (updates) => {
    const updated = await assetService.updateAsset(id, updates);
    setAsset(updated);
    return updated;
  };

  return { asset, loading, error, updateAsset };
};
```

---

## 🎯 组件使用示例

### 迁移前
```jsx
import { getAllAssets } from '../services/mockAssetService';

const Marketplace = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const data = getAllAssets();
    setAssets(data);
  }, []);

  return <div>{/* ... */}</div>;
};
```

### 迁移后
```jsx
import { useAssets } from '../hooks';

const Marketplace = () => {
  const { assets, loading, error, refetch } = useAssets();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <div>{/* ... */}</div>;
};
```

---

## 🧪 测试支持

```javascript
// src/services/__tests__/assetService.test.js

import { assetService } from '../index';

// Mock 服务实现
jest.mock('../config', () => ({
  serviceConfig: { useMock: true }
}));

describe('AssetService', () => {
  test('should get all assets', async () => {
    const assets = await assetService.getAllAssets();
    expect(Array.isArray(assets)).toBe(true);
  });

  test('should get asset by id', async () => {
    const asset = await assetService.getAsset(1);
    expect(asset).toHaveProperty('id', 1);
  });

  // 更多测试...
});
```

---

## ✅ 迁移检查清单

- [ ] 定义所有服务接口
- [ ] 实现 Mock 服务
- [ ] 实现 API 服务
- [ ] 创建服务配置
- [ ] 实现自定义 hooks
- [ ] 更新所有组件使用 hooks
- [ ] 添加单元测试
- [ ] 更新文档

---

## 📊 环境变量配置

```env
# .env.development
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.heyi.com
```

---

*文档版本: v1.0*
*更新时间: 2025-12-04*
