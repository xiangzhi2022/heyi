/**
 * @file CollectionCard.jsx
 * @description 展示单个收藏品系列的卡片组件，包含封面图、头像、名称、地板价和总交易额等信息。
 * @author Gemini
 */

import React from 'react';
import { Verified } from 'lucide-react';

/**
 * CollectionCard 组件
 * @param {object} props - 组件的属性
 * @param {string} props.name - 收藏品系列的名称
 * @param {string} props.author - 创作者信息（当前未使用，但可能为未来扩展预留）
 * @param {string} props.image - 卡片顶部的背景图片，通常是一个 Tailwind CSS 类名（如 'bg-blue-200'）
 * @param {string} props.avatar - 收藏品系列的头像，通常是一个 Tailwind CSS 类名
 * @param {string} props.floorPrice - 地板价
 * @param {string} props.totalVolume - 总交易额
 * @returns {JSX.Element}
 */
const CollectionCard = ({ name, author, image, avatar, floorPrice, totalVolume }) => {
    return (
        // 整个卡片的容器，添加了鼠标悬浮时的动效
        <div className="group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
            {/* 卡片顶部的图片区域 */}
            <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <div className={`absolute inset-0 ${image} bg-cover bg-center group-hover:scale-105 transition-transform duration-500`} />
                {/* 图片上的遮罩层，悬浮时变淡 */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* 卡片下部的内容区域 */}
            <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-2xl p-4 pt-12 shadow-sm hover:shadow-md transition-shadow">
                {/* 浮动在内容区域上方的头像 */}
                <div className="absolute -top-10 left-4">
                    <div className={`w-20 h-20 rounded-xl border-4 border-white shadow-md ${avatar} bg-cover bg-center`} />
                </div>

                {/* 收藏品名称和认证标志 */}
                <div className="flex items-center gap-1 mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{name}</h3>
                    <Verified size={16} className="text-blue-500" />
                </div>

                {/* 地板价和总交易额 */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">地板价</p>
                        <p className="font-bold text-gray-900 dark:text-white">¥ {floorPrice}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">总交易额</p>
                        <p className="font-bold text-gray-900 dark:text-white">¥ {totalVolume}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionCard;
