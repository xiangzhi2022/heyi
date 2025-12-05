# RankingList 组件设计规范

## 🎯 设计目标

创建一个高度可配置、可复用的排行榜组件，适应不同场景的展示需求。

---

## 📋 配置项设计

### Props 接口定义

```typescript
interface RankingListProps {
  // 显示配置
  maxItems?: number;           // 最大显示条目数，默认不限制
  compact?: boolean;           // 紧凑模式，减小间距和字体
  showViewAllButton?: boolean; // 是否显示"查看完整榜单"按钮
  
  // 数据配置
  tabs?: TabConfig[];          // 自定义标签页配置
  defaultTab?: string;         // 默认激活的标签页
  
  // 样式配置
  height?: string;             // 组件高度，如 "500px" 或 "auto"
  className?: string;          // 自定义样式类
  
  // 功能配置
  enableScroll?: boolean;      // 是否启用滚动
  showRankBadges?: boolean;    // 是否显示排名徽章
  showTrends?: boolean;        // 是否显示趋势指标
  
  // 交互配置
  onItemClick?: (item: RankingItem) => void;  // 点击项目回调
  onTabChange?: (tabId: string) => void;      // 切换标签页回调
}

interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  dataSource: () => Promise<RankingItem[]> | RankingItem[];
}

interface RankingItem {
  id: string | number;
  name: string;
  value: string;
  change: string;
  avatar: string;
  type: 'asset' | 'author';
  metadata?: Record<string, any>;
}
```

---

## 🎨 使用场景

### 场景 1: 首页侧边栏（紧凑模式）
```jsx
<RankingList
  maxItems={15}
  compact={true}
  height="calc(100vh - 200px)"
  enableScroll={true}
  showViewAllButton={true}
  showRankBadges={true}
  showTrends={true}
/>
```

**特点**:
- 显示 15 条数据
- 紧凑布局节省空间
- 可滚动查看更多
- 显示完整榜单按钮

---

### 场景 2: 排行榜专页（完整模式）
```jsx
<RankingList
  maxItems={100}
  compact={false}
  height="auto"
  enableScroll={false}
  showViewAllButton={false}
  showRankBadges={true}
  showTrends={true}
  onItemClick={(item) => navigate(`/assets/${item.id}`)}
/>
```

**特点**:
- 显示所有数据（最多100条）
- 标准布局，信息完整
- 无需滚动（使用页面滚动）
- 不显示"查看更多"按钮

---

### 场景 3: 仪表板小部件（极简模式）
```jsx
<RankingList
  maxItems={5}
  compact={true}
  height="300px"
  enableScroll={false}
  showViewAllButton={true}
  showRankBadges={false}
  showTrends={false}
  tabs={[
    { id: 'heat', label: '热度', icon: Flame, dataSource: getHeatData }
  ]}
/>
```

**特点**:
- 只显示 5 条
- 极简信息展示
- 固定高度
- 单一榜单类型

---

### 场景 4: 自定义数据源
```jsx
<RankingList
  tabs={[
    {
      id: 'custom',
      label: '本周新作',
      icon: Star,
      dataSource: async () => {
        const data = await fetchWeeklyNewAssets();
        return data.map(item => ({
          id: item.id,
          name: item.title,
          value: `${item.views} 浏览`,
          change: '+新',
          avatar: item.imageColor,
          type: 'asset'
        }));
      }
    }
  ]}
  maxItems={10}
  showViewAllButton={false}
/>
```

**特点**:
- 自定义数据源
- 自定义标签页
- 灵活的数据转换

---

## 🔧 实现示例

### 基础组件结构

```jsx
const RankingList = ({
  maxItems,
  compact = false,
  showViewAllButton = true,
  tabs = DEFAULT_TABS,
  defaultTab = 'heat',
  height = 'auto',
  className = '',
  enableScroll = true,
  showRankBadges = true,
  showTrends = true,
  onItemClick,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [rankingData, setRankingData] = useState({});
  const [loading, setLoading] = useState(false);

  // 数据加载逻辑
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const currentTab = tabs.find(t => t.id === activeTab);
      if (currentTab) {
        const data = await currentTab.dataSource();
        setRankingData(prev => ({
          ...prev,
          [activeTab]: maxItems ? data.slice(0, maxItems) : data
        }));
      }
      setLoading(false);
    };
    loadData();
  }, [activeTab, maxItems]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleItemClick = (item) => {
    onItemClick?.(item);
  };

  // 动态样式
  const containerClass = cn(
    'bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm',
    compact ? 'p-4' : 'p-5',
    className
  );

  const listClass = cn(
    'flex-1',
    compact ? 'space-y-0.5' : 'space-y-1',
    enableScroll && 'overflow-y-auto scrollbar-thin'
  );

  const itemClass = cn(
    'flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer',
    compact && 'gap-2 p-1.5 rounded-lg'
  );

  return (
    <div className={containerClass} style={{ height }}>
      {/* 标题 */}
      <div className={cn('flex items-center justify-between', compact ? 'mb-3' : 'mb-4')}>
        <h2 className={cn('font-bold text-gray-900 dark:text-white flex items-center gap-2', compact ? 'text-lg' : 'text-xl')}>
          <Trophy size={compact ? 20 : 22} className="text-yellow-500" />
          排行榜
        </h2>
      </div>

      {/* 标签页 */}
      <div className={cn('flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl', compact ? 'mb-3 p-0.5 rounded-lg' : 'mb-4')}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold transition-all',
              compact && 'gap-1.5 px-2 py-1.5 text-xs rounded-md',
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
            )}
          >
            <tab.icon size={compact ? 14 : 16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div className={listClass}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          rankingData[activeTab]?.map((item, index) => (
            <RankingItem
              key={item.id}
              item={item}
              index={index}
              compact={compact}
              showBadge={showRankBadges}
              showTrend={showTrends}
              onClick={() => handleItemClick(item)}
            />
          ))
        )}
      </div>

      {/* 查看完整榜单按钮 */}
      {showViewAllButton && (
        <div className={cn('pt-4 border-t border-gray-100 dark:border-gray-700/50', compact && 'mt-3 pt-3')}>
          <Link
            to={`/ranking?tab=${activeTab}`}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            查看完整榜单
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};
```

---

## 📊 配置对照表

| 配置项 | 首页侧边栏 | 排行榜页 | 仪表板 | 自定义 |
|--------|-----------|---------|--------|--------|
| maxItems | 15 | 100 | 5 | 10 |
| compact | true | false | true | - |
| height | calc(...) | auto | 300px | - |
| enableScroll | true | false | false | - |
| showViewAllButton | true | false | true | false |
| showRankBadges | true | true | false | - |
| showTrends | true | true | false | - |

---

## ✅ 最佳实践

1. **性能优化**
   - 使用 `React.memo` 包裹组件
   - 虚拟滚动处理大量数据
   - 懒加载数据

2. **可访问性**
   - 键盘导航支持
   - ARIA 标签
   - 焦点管理

3. **响应式设计**
   - 移动端自动切换到紧凑模式
   - 触摸友好的交互

4. **错误处理**
   - 数据加载失败提示
   - 空状态展示
   - 重试机制

---

*文档版本: v1.0*
*更新时间: 2025-12-04*
