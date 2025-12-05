/**
 * @file FeaturedCarousel.jsx
 * @description 一个功能丰富的特色内容轮播组件，支持自动播放、手动控制、触摸滑动和真实图片展示。
 * @author Gemini
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// 默认的轮播内容数据 (作为 fallback)
const DEFAULT_ITEMS = [
    {
        id: 1,
        title: "赛博朋克：夜之城",
        author: "NeoArtist",
        floorPrice: "2.5 CNY",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2808&auto=format&fit=crop",
        description: "探索未来的霓虹都市，感受科技与人性的碰撞。"
    },
    {
        id: 2,
        title: "山水禅意系列",
        author: "InkMaster",
        floorPrice: "1.8 CNY",
        image: "https://images.unsplash.com/photo-1515405295579-ba7b454989d3?q=80&w=2670&auto=format&fit=crop",
        description: "传统水墨与数字艺术的完美融合。"
    },
    {
        id: 3,
        title: "元宇宙建筑",
        author: "VArchitect",
        floorPrice: "3.2 CNY",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        description: "为您的虚拟土地打造独一无二的建筑杰作。"
    }
];

/**
 * FeaturedCarousel 轮播组件
 * @param {Object[]} items - 轮播项目数组
 * @returns {JSX.Element}
 */
const FeaturedCarousel = ({ items = DEFAULT_ITEMS }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // 自动轮播逻辑
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [items.length, isPaused]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    // 触摸滑动逻辑
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsPaused(true); // 触摸时暂停轮播
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        setIsPaused(false); // 触摸结束恢复轮播
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();
    };

    return (
        <div
            className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden group touch-pan-y shadow-2xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                        }`}
                >
                    {/* 背景图片 */}
                    <div className="w-full h-full relative">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        {/* 渐变遮罩 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    {/* 内容区域 */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                        <div className={`max-w-3xl transition-all duration-700 delay-100 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <span className="text-xs font-bold">@</span>
                                </div>
                                <span className="font-bold text-lg tracking-wide">{item.author}</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight drop-shadow-lg">
                                {item.title}
                            </h2>

                            <p className="text-lg text-gray-200 mb-8 line-clamp-2 max-w-2xl font-light">
                                {item.description}
                            </p>

                            <div className="flex items-center gap-6">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                    <p className="text-xs text-gray-300 font-bold uppercase tracking-wider mb-1">地板价</p>
                                    <p className="text-2xl font-bold text-white">{item.floorPrice}</p>
                                </div>
                                <Link
                                    to={`/assets/${item.id}`}
                                    className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                                >
                                    查看详情
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* 导航按钮 */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                aria-label="上一张"
            >
                <ChevronLeft size={28} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                aria-label="下一张"
            >
                <ChevronRight size={28} />
            </button>

            {/* 指示器 */}
            <div className="absolute bottom-8 right-8 z-20 flex gap-3">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/60'
                            }`}
                        aria-label={`跳转到第 ${index + 1} 张`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedCarousel;
