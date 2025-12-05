/**
 * @file StackedCards.jsx
 * @description 堆叠卡片组件，以 3D 堆叠效果展示随机商品
 * @author Gemini
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAssets } from '../services/mockAssetService';

/**
 * StackedCards 堆叠卡片组件
 * @returns {JSX.Element}
 */
const StackedCards = () => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // 获取随机的 3 个商品
        const assets = getAllAssets();
        const randomAssets = assets
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        setCards(randomAssets);
    }, []);

    // 每 3 秒自动切换到下一张卡片
    useEffect(() => {
        if (cards.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [cards.length]);

    if (cards.length === 0) return null;

    return (
        <div className="relative w-full h-[450px] perspective-1000">
            {cards.map((card, index) => {
                // 计算每张卡片相对于当前卡片的位置
                const position = (index - currentIndex + cards.length) % cards.length;

                return (
                    <Link
                        key={card.id}
                        to={`/assets/${card.id}`}
                        className={`
                            absolute inset-0 
                            transition-all duration-700 ease-out
                            ${position === 0 ? 'z-30 scale-100 rotate-0 opacity-100' : ''}
                            ${position === 1 ? 'z-20 scale-95 rotate-2 translate-y-4 opacity-80' : ''}
                            ${position === 2 ? 'z-10 scale-90 rotate-4 translate-y-8 opacity-60' : ''}
                        `}
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 h-full group hover:shadow-3xl transition-shadow">
                            {/* 图片区域 */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <img
                                    src={card.imageUrl}
                                    alt={card.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                {/* 标签 */}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 dark:text-white border border-white/20 uppercase">
                                        {card.type}
                                    </span>
                                </div>

                                {/* 标题 */}
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-bold text-2xl drop-shadow-lg">
                                        {card.title}
                                    </h3>
                                </div>
                            </div>

                            {/* 信息区域 */}
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {card.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {card.author}
                                        </p>
                                        <p className="text-sm text-blue-500">
                                            @{card.author.toLowerCase().replace(' ', '_')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                                        当前价格
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        ¥ {card.price}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}

            {/* 装饰性光效 */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
    );
};

export default StackedCards;
