/**
 * @file Sidebar.jsx
 * @description 一个用于市场或列表页面的筛选侧边栏组件，提供排序、状态、价格、区块链和类别等多种筛选功能。
 * @author Gemini
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

/**
 * FilterSection 子组件
 * @description 一个可折叠的筛选区域
 * @param {object} props - 组件属性
 * @param {string} props.title - 该区域的标题
 * @param {React.ReactNode} props.children - 该区域包含的筛选器UI
 * @param {boolean} [props.defaultOpen=false] - 是否默认展开
 * @returns {JSX.Element}
 */
const FilterSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <span>{title}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && (
                <div className="pb-4 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

/**
 * Sidebar 组件
 * @param {object} props - 组件属性
 * @param {boolean} props.isOpen - 控制侧边栏在移动设备上是否显示
 * @param {object} props.filters - 当前的筛选器状态对象
 * @param {Function} props.onFilterChange - 当筛选器状态改变时调用的回调函数
 * @param {Function} props.onClose - 在移动设备上关闭侧边栏的回调函数
 * @returns {JSX.Element | null}
 */
const Sidebar = ({ isOpen, filters, onFilterChange, onClose }) => {
    // 为价格范围筛选器使用本地 state，以避免在输入时频繁触发父组件的更新
    const [localPrice, setLocalPrice] = useState(filters.price);

    // 当来自父组件的 filters.price 变化时，同步本地的 localPrice state
    React.useEffect(() => {
        setLocalPrice(filters.price);
    }, [filters.price]);

    // 在移动设备上，如果 isOpen 为 false 则不渲染
    if (!isOpen) return null;

    /** 处理状态筛选器的点击事件（多选） */
    const handleStatusToggle = (status) => {
        const newStatus = filters.status.includes(status)
            ? filters.status.filter(s => s !== status)
            : [...filters.status, status];
        onFilterChange({ ...filters, status: newStatus });
    };

    /** 处理区块链筛选器的点击事件（多选） */
    const handleChainToggle = (chain) => {
        const newChains = filters.chains.includes(chain)
            ? filters.chains.filter(c => c !== chain)
            : [...filters.chains, chain];
        onFilterChange({ ...filters, chains: newChains });
    };

    /** 处理类别筛选器的点击事件（多选） */
    const handleCategoryToggle = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        onFilterChange({ ...filters, categories: newCategories });
    };

    /** 更新本地价格 state */
    const handleLocalPriceChange = (field, value) => {
        setLocalPrice(prev => ({ ...prev, [field]: value }));
    };

    /** 应用价格筛选，将本地价格 state 更新到父组件 */
    const applyPriceFilter = () => {
        onFilterChange({ ...filters, price: localPrice });
    };

    return (
        <>
            {/* 移动设备上的背景遮罩层 */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200" onClick={onClose} />

            {/* 侧边栏主体 */}
            {/* 样式针对移动端（fixed 定位）和桌面端（static 定位）做了区分 */}
            <div className="
                fixed inset-y-0 left-0 z-50 w-80 glass-card p-6 shadow-2xl lg:shadow-none
                lg:static lg:block lg:h-[calc(100vh-88px)] lg:bg-transparent lg:dark:bg-transparent lg:p-0 lg:pr-4
                overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                animate-in slide-in-from-left duration-300 lg:animate-none
            ">
                {/* 移动端头部 */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">筛选</span>
                    <button onClick={onClose} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* 排序筛选 */}
                <FilterSection title="排序" defaultOpen={true}>
                    <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:border-gray-300 dark:hover:border-gray-600"
                        onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
                        value={filters.sort || 'newest'}
                    >
                        <option value="newest">最新上架</option>
                        <option value="price_asc">价格: 从低到高</option>
                        <option value="price_desc">价格: 从高到低</option>
                        <option value="most_liked">最多喜爱</option>
                        <option value="most_viewed">最多浏览</option>
                    </select>
                </FilterSection>

                {/* 状态筛选 */}
                <FilterSection title="状态" defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'buyNow', label: '立即购买' },
                            { id: 'auction', label: '正在拍卖' },
                            { id: 'new', label: '新上架' },
                            { id: 'hasOffers', label: '有出价' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleStatusToggle(item.id)}
                                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left border ${filters.status.includes(item.id)
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* 价格筛选 */}
                <FilterSection title="价格" defaultOpen={true}>
                    <div className="flex items-center gap-3 mb-4">
                        <select
                            value={localPrice.currency}
                            onChange={(e) => handleLocalPriceChange('currency', e.target.value)}
                            className="px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="CNY">CNY</option>
                            <option value="USD">USD</option>

                        </select>
                        <input
                            type="number"
                            placeholder="最低"
                            value={localPrice.min}
                            onChange={(e) => handleLocalPriceChange('min', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            placeholder="最高"
                            value={localPrice.max}
                            onChange={(e) => handleLocalPriceChange('max', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <button
                        onClick={applyPriceFilter}
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        应用
                    </button>
                </FilterSection>

                {/* 区块链筛选 */}
                <FilterSection title="区块链">
                    <div className="space-y-3">
                        {['Harmony', 'Polygon'].map((chain) => (
                            <label key={chain} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                <input
                                    type="checkbox"
                                    checked={filters.chains.includes(chain)}
                                    onChange={() => handleChainToggle(chain)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
                                />
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                    {chain === 'Harmony' ? 'Harmony Chain' : chain}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* 类别筛选 */}
                <FilterSection title="类别">
                    <div className="space-y-3">
                        {[
                            { id: 'image', label: '艺术' },
                            { id: 'music', label: '音乐' },
                            { id: 'video', label: '视频' },
                            { id: 'literature', label: '文学' }
                        ].map((cat) => (
                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(cat.id)}
                                    onChange={() => handleCategoryToggle(cat.id)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
                                />
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                    {cat.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* 剧本类型筛选 - 只在选择了"文学"类别时显示 */}
                {filters.categories.includes('literature') && (
                    <FilterSection title="剧本类型" defaultOpen={true}>
                        <div className="space-y-3">
                            {[
                                { id: 'short-drama', label: '短剧' },
                                { id: 'long-drama', label: '长剧' },
                                { id: 'unit-series', label: '单元片' }
                            ].map((type) => (
                                <label key={type.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={filters.scriptTypes?.includes(type.id)}
                                        onChange={() => {
                                            const currentTypes = filters.scriptTypes || [];
                                            const newTypes = currentTypes.includes(type.id)
                                                ? currentTypes.filter(t => t !== type.id)
                                                : [...currentTypes, type.id];
                                            onFilterChange({ ...filters, scriptTypes: newTypes });
                                        }}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                        {type.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* 操作按钮：重置和保存 */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={() => onFilterChange({ status: [], price: { min: '', max: '', currency: 'CNY' }, chains: [], categories: [], scriptTypes: [], sort: 'newest' })}
                        className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        重置
                    </button>
                    <button
                        className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                    >
                        保存筛选
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
