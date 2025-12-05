/**
 * @file RankingList.jsx
 * @description 一个可切换的排行榜组件，用于展示不同维度的排名数据（如作品热度、作者收入等）。
 * @author Gemini
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Wallet, Trophy, Coins } from 'lucide-react';
import { getAllAssets } from '../services/mockAssetService';

// 标签页的配置数组
const TABS = [
    { id: 'heat', label: '作品热度', icon: Flame },
    { id: 'revenue', label: '作者身价', icon: Wallet },
    { id: 'price', label: '最高成交', icon: Coins },
];

/**
 * RankingList 组件
 * @returns {JSX.Element}
 */
const RankingList = () => {
    // State to track the currently active tab
    const [activeTab, setActiveTab] = useState('heat');
    const [rankingData, setRankingData] = useState({
        heat: [],
        revenue: [],
        price: []
    });

    // Fetch and process data
    useEffect(() => {
        const assets = getAllAssets();

        // 1. Heat: Sort by views + likes
        const heatData = [...assets]
            .sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10))
            .map(asset => ({
                id: asset.id,
                name: asset.title,
                value: `${(asset.views / 1000).toFixed(1)}k 浏览`,
                change: `+${(Math.random() * 20).toFixed(1)}%`, // Simulated change
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
                id: `author-${index}`,
                name: author.name,
                value: `¥${author.total.toLocaleString()}`,
                change: `+${(Math.random() * 10).toFixed(1)}%`,
                avatar: author.avatar, // Use one of their asset's colors as avatar background
                type: 'author'
            }));

        // 3. Price: Sort by price
        const priceData = [...assets]
            .sort((a, b) => {
                const priceA = parseFloat(a.price.replace(/,/g, '')) || 0;
                const priceB = parseFloat(b.price.replace(/,/g, '')) || 0;
                return priceB - priceA;
            })
            .map(asset => ({
                id: asset.id,
                name: asset.title,
                value: `¥${asset.price}`,
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

    const currentData = rankingData[activeTab];

    /**
     * 根据排名（索引）返回不同的颜色样式
     * @param {number} index - 列表项的索引 (0-based)
     * @returns {string} Tailwind CSS 类名字符串
     */
    const getRankColor = (index) => {
        if (index === 0) return 'bg-yellow-400/30 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-400 border border-yellow-500/30'; // 金牌
        if (index === 1) return 'bg-gray-300/30 text-gray-700 dark:bg-gray-400/30 dark:text-gray-300 border border-gray-400/30'; // 银牌
        if (index === 2) return 'bg-orange-400/30 text-orange-700 dark:bg-orange-500/30 dark:text-orange-400 border border-orange-500/30'; // 铜牌
        return 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-transparent'; // 其他排名
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 p-4 flex flex-col h-full shadow-sm">
            <div className='flex items-center justify-between mb-3'>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Trophy size={20} className="text-yellow-500" />
                    排行榜
                </h2>
            </div>

            {/* 标签页切换器 */}
            <div className="flex p-0.5 bg-gray-100 dark:bg-gray-900 rounded-lg mb-3">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 排名列表 */}
            <div className="flex-1 space-y-0.5 -mx-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {currentData.map((item, index) => {
                    const Wrapper = item.type === 'asset' ? Link : 'div';
                    const wrapperProps = item.type === 'asset' ? { to: `/assets/${item.id}` } : {};

                    return (
                        <Wrapper
                            key={item.id}
                            {...wrapperProps}
                            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200 cursor-pointer group"
                        >
                            {/* 排名数字 */}
                            <div className={`w-7 h-7 flex items-center justify-center rounded-md font-bold text-xs flex-shrink-0 transition-colors ${getRankColor(index)}`}>
                                {index + 1}
                            </div>

                            {/* 头像/图片占位符 */}
                            <div className={`w-8 h-8 rounded-md ${item.avatar} flex-shrink-0`}></div>

                            {/* 名称和数值 */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 dark:text-white truncate text-xs group-hover:text-primary transition-colors">{item.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.value}</p>
                            </div>

                            {/* 变化率 */}
                            <div className={`text-xs font-bold text-right w-12 ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {item.change}
                            </div>
                        </Wrapper>
                    );
                })}
            </div>

            {/* 底部按钮 */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <Link
                    to={`/ranking?tab=${activeTab}`}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                    查看完整榜单
                    <ArrowRight size={12} />
                </Link>
            </div>
        </div>
    );
};

export default RankingList;
