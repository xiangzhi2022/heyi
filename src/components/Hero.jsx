/**
 * @file Hero.jsx
 * @description 网站首页的核心英雄区域（Hero Section），用于展示品牌标语、核心价值和关键行动号召（CTA）。
 * @author Gemini
 */

import React from 'react';
import { Link } from 'react-router-dom';
import StackedCards from './StackedCards';

/**
 * Hero 组件
 * @returns {JSX.Element}
 */
const Hero = () => {
    return (
        <div className="relative w-full h-full flex flex-col justify-center py-8 lg:py-12">
            {/* 背景装饰性模糊效果 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
                {/* 左侧文本内容区域 */}
                <div className="flex flex-col gap-6 max-w-2xl">
                    {/* 主标题 */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                        和一版权服务 <br />
                        {/* 渐变色文本 */}
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"
                            style={{
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Harmony One Rights
                        </span>
                    </h1>
                    {/* 描述文本 */}
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        专业的数字版权确权、交易与保护平台。在这里，您可以轻松完成版权登记、展示您的创意作品，并与全球买家进行安全交易。
                    </p>
                    {/* 行动号召 (Call to Action) 按钮 */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Link to="/marketplace" className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-105 inline-block text-center border border-transparent">
                            浏览市场
                        </Link>
                        <Link to="/registration" className="px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-bold rounded-xl text-base sm:text-lg hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all hover:bg-gray-100 dark:hover:bg-gray-700 inline-block text-center">
                            立即登记
                        </Link>
                    </div>

                    {/* 关键数据统计 */}
                    <div className="flex gap-6 sm:gap-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">10W+</p>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">已登记作品</p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">5000+</p>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">入驻创作者</p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">¥2.5亿</p>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">总交易额</p>
                        </div>
                    </div>
                </div>

                {/* 右侧堆叠卡片展示 (仅在 xl 及以上屏幕尺寸显示) */}
                <div className="hidden xl:block relative">
                    <StackedCards />
                </div>
            </div>
        </div>
    );
};

export default Hero;
