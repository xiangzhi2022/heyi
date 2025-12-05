/**
 * @file Marketplace.jsx
 * @description 版权交易市场的主页面，用户可以在此浏览、筛选和搜索所有可用的数字版权作品。
 * @author Gemini
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ListingCard from '../components/ListingCard';
import { Filter, Grid, Search, SlidersHorizontal } from 'lucide-react';
import { useSearchStore } from '../stores';
import { getAllAssets } from '../services/mockAssetService';

/**
 * Marketplace 页面组件
 * @returns {JSX.Element}
 */
const Marketplace = () => {
    const { searchTerm } = useSearchStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 侧边栏在桌面端默认打开
    const [listings, setListings] = useState([]);
    const [filters, setFilters] = useState({
        status: [],
        price: { min: '', max: '', currency: 'CNY' },
        chains: [],
        categories: [],
        scriptTypes: [],
        sort: 'newest'
    });

    // 从 mockAssetService 获取数据
    useEffect(() => {
        const assets = getAllAssets();
        setListings(assets);
    }, []);

    // 使用 useCallback 优化筛选器更新函数
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    // 使用 useMemo 根据筛选和排序条件计算最终显示的列表
    const filteredListings = useMemo(() => {
        return listings.filter(item => {
            // 筛选逻辑
            if (filters.status.length > 0 && !filters.status.includes(item.status)) return false;
            if (filters.chains.length > 0 && !filters.chains.includes(item.chain)) return false;
            if (filters.categories.length > 0 && !filters.categories.includes(item.type)) return false;

            // 文学类型的剧本子分类筛选
            if (filters.scriptTypes && filters.scriptTypes.length > 0) {
                if (!item.scriptType || !filters.scriptTypes.includes(item.scriptType)) return false;
            }

            if (filters.price.min !== '' && parseFloat(item.price.replace(/,/g, '')) < parseFloat(filters.price.min)) return false;
            if (filters.price.max !== '' && parseFloat(item.price.replace(/,/g, '')) > parseFloat(filters.price.max)) return false;

            // 全局搜索词筛选
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                return item.title.toLowerCase().includes(lowerTerm) || item.author.toLowerCase().includes(lowerTerm);
            }

            return true;
        }).sort((a, b) => {
            // 排序逻辑
            switch (filters.sort) {
                case 'price_asc':
                    return parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, ''));
                case 'price_desc':
                    return parseFloat(b.price.replace(/,/g, '')) - parseFloat(a.price.replace(/,/g, ''));
                case 'most_liked':
                    return b.likes - a.likes;
                default:
                    return 0; // 默认排序 (最新，此处用ID模拟)
            }
        });
    }, [listings, filters, searchTerm]); // 依赖项：仅当筛选条件或搜索词变化时重新计算

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Navbar />

            <div className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* 页面头部 */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
                            版权市场
                            <span
                                className="block text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-1"
                                style={{
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                探索与交易数字创意
                            </span>
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            在这里发现全球优质数字版权资产，轻松进行探索、购买和交易。
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* 筛选侧边栏的显示/隐藏按钮 */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-md ${isSidebarOpen
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                                : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover'
                                }`}
                        >
                            <SlidersHorizontal size={20} />
                            <span className="hidden sm:inline">{isSidebarOpen ? '隐藏筛选' : '显示筛选'}</span>
                        </button>
                        {/* 结果数量显示 */}
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            共 <span className="text-primary">{filteredListings.length}</span> 个结果
                        </div>
                    </div>
                </div>

                {/* 主内容区域：侧边栏 + 作品网格 */}
                <div className="flex gap-6 items-start">
                    {/* 侧边栏容器 */}
                    <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block transition-all duration-300`}>
                        {isSidebarOpen && (
                            <div className="w-80 shrink-0 sticky top-24">
                                <Sidebar
                                    isOpen={true} // 在此布局中，如果父容器可见，则内容总是渲染
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onClose={() => setIsSidebarOpen(false)} // 用于移动端关闭
                                />
                            </div>
                        )}
                    </div>

                    {/* 作品网格 */}
                    <div className="flex-1">
                        {filteredListings.length > 0 ? (
                            // 网格列数根据侧边栏是否打开而动态变化
                            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSidebarOpen
                                ? 'lg:grid-cols-3 xl:grid-cols-4'
                                : 'lg:grid-cols-4 xl:grid-cols-5'
                                } gap-6 transition-all duration-300`}>
                                {filteredListings.map((item) => (
                                    <ListingCard key={item.id} {...item} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed shadow-md">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={48} className="text-primary opacity-60" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">未找到相关版权内容</h3>
                                <p className="text-lg">请尝试调整筛选条件或搜索关键词</p>
                                <button
                                    onClick={() => setFilters({ status: [], price: { min: '', max: '', currency: 'CNY' }, chains: [], categories: [], scriptTypes: [], sort: 'newest' })}
                                    className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    清除所有筛选
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Marketplace;
