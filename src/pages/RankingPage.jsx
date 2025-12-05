/**
 * @file RankingPage.jsx
 * @description 完整的排行榜页面，展示各个维度的详细排名
 * @author Gemini
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Flame, Wallet, Coins, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { getAllAssets } from '../services/mockAssetService';
import { Link } from 'react-router-dom';

const TABS = [
    { id: 'heat', label: '作品热度', icon: Flame, description: '根据浏览量和点赞数综合计算' },
    { id: 'revenue', label: '作者身价', icon: Wallet, description: '根据作者所有作品总价值排名' },
    { id: 'price', label: '最高成交', icon: Coins, description: '根据作品价格排名' },
];

const RankingPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'heat';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [rankingData, setRankingData] = useState({
        heat: [],
        revenue: [],
        price: []
    });

    useEffect(() => {
        const assets = getAllAssets();

        // 1. Heat: Sort by views + likes
        const heatData = [...assets]
            .sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10))
            .map((asset, index) => ({
                rank: index + 1,
                id: asset.id,
                name: asset.title,
                author: asset.author,
                value: `${(asset.views / 1000).toFixed(1)}k 浏览`,
                metrics: `${asset.likes} 点赞`,
                change: `+${(Math.random() * 20).toFixed(1)}%`,
                avatar: asset.imageColor,
                type: 'asset'
            }));

        // 2. Revenue (Authors): Group by author and sum price
        const authorMap = {};
        assets.forEach(asset => {
            const price = parseFloat(asset.price.replace(/,/g, '')) || 0;
            if (!authorMap[asset.author]) {
                authorMap[asset.author] = { name: asset.author, total: 0, count: 0, avatar: asset.imageColor };
            }
            authorMap[asset.author].total += price;
            authorMap[asset.author].count += 1;
        });
        const revenueData = Object.values(authorMap)
            .sort((a, b) => b.total - a.total)
            .map((author, index) => ({
                rank: index + 1,
                id: `author-${index}`,
                name: author.name,
                value: `¥${author.total.toLocaleString()}`,
                metrics: `${author.count} 件作品`,
                change: `+${(Math.random() * 10).toFixed(1)}%`,
                avatar: author.avatar,
                type: 'author'
            }));

        // 3. Price: Sort by price
        const priceData = [...assets]
            .sort((a, b) => {
                const priceA = parseFloat(a.price.replace(/,/g, '')) || 0;
                const priceB = parseFloat(b.price.replace(/,/g, '')) || 0;
                return priceB - priceA;
            })
            .map((asset, index) => ({
                rank: index + 1,
                id: asset.id,
                name: asset.title,
                author: asset.author,
                value: `¥${asset.price}`,
                metrics: `${asset.likes} 点赞`,
                change: `+${(Math.random() * 5).toFixed(1)}%`,
                avatar: asset.imageColor,
                type: 'asset'
            }));

        setRankingData({
            heat: heatData,
            revenue: revenueData,
            price: priceData
        });
    }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    const currentData = rankingData[activeTab];
    const currentTabInfo = TABS.find(t => t.id === activeTab);

    const getRankColor = (rank) => {
        if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50';
        if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-400/50';
        if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/50';
        return 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Navbar showSearch={true} showNotifications={true} showWallet={false} />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* 页面头部 */}
                <div className="mb-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
                        发现最热门的<br className="sm:hidden" />
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            style={{
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >数字版权</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        追踪作品热度、作者身价和最高成交价，洞察数字版权市场的最新动态。
                    </p>
                </div>

                {/* 标签页切换器 */}
                <div className="flex justify-center gap-4 flex-wrap mb-10">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${activeTab === tab.id
                                ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 当前榜单说明 */}
                {currentTabInfo && (
                    <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-sm flex items-start gap-4">
                        <TrendingUp size={24} className="text-primary mt-1 shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{currentTabInfo.label}说明</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{currentTabInfo.description}</p>
                        </div>
                    </div>
                )}

                {/* 排名列表 */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[768px]">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                                        排名
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">
                                        {activeTab === 'revenue' ? '创作者' : '作品'}
                                    </th>
                                    {activeTab !== 'revenue' && (
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                                            作者
                                        </th>
                                    )}
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                                        数据
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                                        详情
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                                        趋势
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {currentData.length > 0 ? (
                                    currentData.map((item) => {
                                        const Wrapper = item.type === 'asset' ? Link : 'div';
                                        const wrapperProps = item.type === 'asset' ? { to: `/assets/${item.id}` } : {};

                                        const isPositiveChange = item.change.startsWith('+');

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                            >
                                                {/* 排名 */}
                                                <td className="px-6 py-4">
                                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg ${getRankColor(item.rank)}`}>
                                                        {item.rank}
                                                    </div>
                                                </td>

                                                {/* 名称和头像 */}
                                                <td className="px-6 py-4">
                                                    <Wrapper {...wrapperProps} className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-xl ${item.avatar} flex-shrink-0 border-2 border-transparent group-hover:border-primary transition-colors flex items-center justify-center text-lg font-bold text-white/50`}>
                                                            {item.name ? item.name.substring(0, 2) : ''}
                                                        </div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-primary transition-colors">
                                                            {item.name}
                                                        </h3>
                                                    </Wrapper>
                                                </td>

                                                {/* 作者（仅作品榜单显示） */}
                                                {activeTab !== 'revenue' && (
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.author}</span>
                                                    </td>
                                                )}

                                                {/* 数据 */}
                                                <td className="px-6 py-4">
                                                    <div className="text-xl font-extrabold text-gray-900 dark:text-white mb-0.5">{item.value}</div>
                                                </td>

                                                {/* 详情 */}
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.metrics}</div>
                                                </td>


                                                {/* 涨幅 */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className={`flex items-center justify-end gap-1 text-sm font-bold ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                                                        {isPositiveChange ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                        {item.change}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={activeTab === 'revenue' ? 5 : 6} className="text-center py-20 text-gray-500 dark:text-gray-400">
                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Trophy size={48} className="text-primary opacity-60" />
                                            </div>
                                            <p className="text-2xl font-bold mb-2">暂无排名数据</p>
                                            <p className="text-lg">该榜单数据正在努力统计中，请稍后再试或等待数据更新。</p>
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="mt-8 px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                                            >
                                                刷新页面
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RankingPage;
