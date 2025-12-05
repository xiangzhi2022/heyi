/**
 * @file Home.jsx
 * @description 应用的首页，是核心的聚合页面，展示了英雄区域、特色轮播、热门市场、排行榜等多个模块。
 * @author Gemini
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RankingList from '../components/RankingList';
import ListingCard from '../components/ListingCard';
import FeaturedCarousel from '../components/FeaturedCarousel';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import LoadingSpinner from '../components/LoadingSpinner';
import { Music, Video, FileText, Image as ImageIcon, Grid, Filter, Sparkles } from 'lucide-react';
import { useSearchStore } from '../stores';
import { getAllAssets } from '../services/mockAssetService';

// 分类标签的配置
const CATEGORIES = [
    { id: 'all', label: '全部', icon: Grid },
    { id: 'image', label: '艺术', icon: ImageIcon },
    { id: 'music', label: '音乐', icon: Music },
    { id: 'video', label: '视频', icon: Video },
    { id: 'literature', label: '文学', icon: FileText },
];

/**
 * Home 页面组件
 * @returns {JSX.Element}
 */
const Home = () => {
    // 从全局上下文中获取搜索词
    const { searchTerm } = useSearchStore();
    // 内部状态管理
    const [activeCategory, setActiveCategory] = useState('all'); // 当前激活的分类
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   // 筛选侧边栏在移动端是否打开
    const [isLoading, setIsLoading] = useState(true);           // 是否处于加载状态
    const [listings, setListings] = useState([]);               // 作品列表
    const [filters, setFilters] = useState({                    // 筛选条件
        status: [],
        price: { min: '', max: '', currency: 'CNY' },
        chains: [],
        categories: [],
        scriptTypes: []
    });

    // 模拟初次进入页面时的数据加载
    useEffect(() => {
        const timer = setTimeout(() => {
            const assets = getAllAssets().map(asset => ({
                ...asset,
                salesModes: asset.salesModes, // Pass salesModes for multi-badge support
                status: asset.salesModes?.[0], // Fallback status
                chain: 'Harmony' // Default chain
            }));
            setListings(assets);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // 使用 useCallback 包装筛选条件变更的处理函数，以进行性能优化
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        // 模拟因筛选条件改变而重新加载数据
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    // 使用 useMemo 来根据依赖项（分类、筛选条件、搜索词）的变化来计算过滤后的列表
    // 只有当依赖项改变时，才会重新执行过滤逻辑，避免不必要的重复计算
    const filteredListings = useMemo(() => {
        return listings.filter(item => {
            // 分类筛选
            if (activeCategory !== 'all' && item.type !== activeCategory) return false;
            // 状态筛选
            if (filters.status.length > 0 && !filters.status.includes(item.status)) return false;
            // 区块链筛选
            if (filters.chains.length > 0 && !filters.chains.includes(item.chain)) return false;
            // 类别筛选 (来自侧边栏)
            if (filters.categories.length > 0 && !filters.categories.includes(item.type)) return false;
            // 剧本类型筛选
            if (filters.scriptTypes && filters.scriptTypes.length > 0 && !filters.scriptTypes.includes(item.scriptType)) return false;
            // 价格筛选
            if (filters.price.min !== '' && parseFloat(item.price.replace(/,/g, '')) < parseFloat(filters.price.min)) return false;
            if (filters.price.max !== '' && parseFloat(item.price.replace(/,/g, '')) > parseFloat(filters.price.max)) return false;
            // 搜索词筛选
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                return item.title.toLowerCase().includes(lowerTerm) || item.author.toLowerCase().includes(lowerTerm);
            }

            return true;
        });
    }, [activeCategory, filters, searchTerm, listings]); // 依赖项数组

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Navbar showSearch={true} showNotifications={true} showWallet={true} />

            {/* 英雄区域 */}
            <section className="max-w-[1600px] mx-auto px-4 sm:px-8">
                <Hero />
            </section>

            {/* 特色轮播与排行榜区域 */}
            <section className="max-w-[1600px] mx-auto px-4 sm:px-8 mt-8 mb-20">
                {/* 页面主网格布局，在大屏幕上分为左侧主内容区（9/12）和右侧排行榜（3/12） */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左侧主内容区 */}
                    <div className="lg:col-span-9 flex flex-col gap-8">
                        <FeaturedCarousel />

                        {/* 热门市场 */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 sticky top-0 z-30 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-4">
                                <div className="flex items-center gap-4">
                                    {/* 筛选按钮（移动端/小屏幕友好） */}
                                    <button
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                        className={`p-3 rounded-xl transition-colors flex items-center gap-2 font-bold ${isSidebarOpen ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        <Filter size={20} />
                                        <span>筛选</span>
                                    </button>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Sparkles size={28} className="text-primary" />
                                        热门市场
                                    </h2>
                                </div>

                                {/* 分类标签页 */}
                                <div className="flex p-1 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl overflow-x-auto max-w-full">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            <cat.icon size={16} />
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                {/* 筛选侧边栏 */}
                                <Sidebar
                                    isOpen={isSidebarOpen}
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onClose={() => setIsSidebarOpen(false)}
                                />

                                {/* 作品列表网格 */}
                                <div className="flex-1">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-20">
                                            <LoadingSpinner size={48} />
                                        </div>
                                    ) : (
                                        // 动态调整网格列数：当侧边栏打开时，减少一列以腾出空间
                                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${isSidebarOpen ? 'lg:grid-cols-2 xl:grid-cols-2' : 'lg:grid-cols-2 xl:grid-cols-3'
                                            }`}>
                                            {filteredListings.map((item) => (
                                                <ListingCard key={item.id} {...item} />
                                            ))}
                                        </div>
                                    )}

                                    {/* 空状态显示 */}
                                    {!isLoading && filteredListings.length === 0 && (
                                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                                            <Grid size={64} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-xl font-bold mb-2">暂无该分类的版权内容</p>
                                            <p>请尝试调整筛选条件</p>
                                        </div>
                                    )}

                                    {/* 查看更多按钮 */}
                                    {!isLoading && filteredListings.length > 0 && (
                                        <div className="mt-12 text-center">
                                            <Link to="/marketplace" className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary text-gray-900 dark:text-white font-bold rounded-xl transition-all inline-block">
                                                查看更多
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右侧排行榜区域 */}
                    <div className="lg:col-span-3">
                        <RankingList />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
