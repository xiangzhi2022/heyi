/**
 * @file LoadingSpinner.jsx
 * @description 一个可重用的加载指示器组件，用于在数据加载或异步操作期间向用户提供视觉反馈。
 * @author Gemini
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner 组件
 * @param {object} props - 组件属性
 * @param {number} [props.size=24] - 加载图标的大小
 * @param {string} [props.className=''] - 允许外部传入额外的 CSS 类名
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ size = 24, className = '' }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            {/* 使用 lucide-react 的 Loader2 图标，并应用 Tailwind CSS 的 'animate-spin' 类来实现旋转动画 */}
            <Loader2 size={size} className="animate-spin text-primary" />
        </div>
    );
};

export default LoadingSpinner;
