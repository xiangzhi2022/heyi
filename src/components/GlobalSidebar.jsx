import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore, useToastStore } from '../stores';
import {
    Compass,
    LayoutGrid,
    Coins,
    Activity,
    PenTool,
    UserCircle,
    BookOpen,
    Settings,
    HelpCircle,
    ChevronRight,
    Layers,
    Trophy,
    Moon,
    Sun
} from 'lucide-react';

/**
 * MenuItem 子组件
 * @description 侧边栏中的可点击菜单项
 */
const MenuItem = ({ icon: Icon, label, to = "#", hasSubmenu = false, isExpanded, onClick, isActive }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
        title={!isExpanded ? label : undefined}
    >
        <Icon size={22} strokeWidth={2} className="shrink-0" />
        <span className={`font-medium whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>
            {label}
        </span>
        {hasSubmenu && isExpanded && (
            <ChevronRight size={16} className={`ml-auto opacity-50 ${isActive ? 'text-white' : ''}`} />
        )}
    </Link>
);

/**
 * SectionTitle 子组件
 */
const SectionTitle = ({ label, isExpanded }) => (
    <div className={`transition-all duration-200 px-4 mb-2 mt-4 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden mt-0 mb-0'
        }`}>
        <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {label}
        </div>
    </div>
);

/**
 * GlobalSidebar 组件
 * @description 全局侧边栏 - 专注于页面级导航
 */
const GlobalSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { addToast } = useToastStore();
    const { isDark, toggleTheme } = useThemeStore();
    const location = useLocation();

    const handleComingSoon = (e) => {
        e.preventDefault();
        addToast("该功能即将上线，敬请期待！", "info");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`hidden lg:flex fixed left-0 top-0 h-screen glass border-r border-gray-200 dark:border-gray-800 z-[60] flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-64 shadow-2xl' : 'w-20'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Logo 区域 */}
            <div className="h-[80px] flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <Link to="/" className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-primary/30">
                        H
                    </div>
                    <span className={`font-bold text-xl text-gray-900 dark:text-white whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                        }`}>
                        Harmony
                    </span>
                </Link>
            </div>

            {/* 主导航区域 */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">

                <SectionTitle label="核心" isExpanded={isExpanded} />
                <MenuItem icon={Compass} label="发现" to="/" isExpanded={isExpanded} isActive={isActive('/')} />
                <MenuItem icon={LayoutGrid} label="版权市场" to="/marketplace" isExpanded={isExpanded} isActive={isActive('/marketplace')} />
                <MenuItem icon={Trophy} label="排行榜" to="/ranking" isExpanded={isExpanded} isActive={isActive('/ranking')} />
                <MenuItem icon={BookOpen} label="权利中心" to="/rights-center" isExpanded={isExpanded} isActive={isActive('/rights-center')} />

                <SectionTitle label="创作" isExpanded={isExpanded} />
                <MenuItem icon={PenTool} label="版权登记" to="/registration" isExpanded={isExpanded} isActive={isActive('/registration')} />
                <MenuItem icon={UserCircle} label="个人中心" to="/account" isExpanded={isExpanded} isActive={isActive('/account')} />

                <SectionTitle label="生态" isExpanded={isExpanded} />
                <MenuItem icon={Activity} label="开发活动" isExpanded={isExpanded} onClick={handleComingSoon} />
                <MenuItem icon={Layers} label="生态应用" isExpanded={isExpanded} onClick={handleComingSoon} />

            </div>

            {/* 底部导航区域 */}
            <div className="py-4 px-3 border-t border-gray-200 dark:border-gray-800 space-y-1 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm shrink-0">
                <MenuItem icon={HelpCircle} label="帮助中心" to="/help" isExpanded={isExpanded} isActive={isActive('/help')} />
                <MenuItem icon={Settings} label="设置" to="/settings" isExpanded={isExpanded} isActive={isActive('/settings')} />

                {/* 主题切换按钮 */}
                <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white`}
                    title={!isExpanded ? (isDark ? "切换到浅色模式" : "切换到深色模式") : undefined}
                >
                    {isDark ? <Sun size={22} strokeWidth={2} className="shrink-0" /> : <Moon size={22} strokeWidth={2} className="shrink-0" />}
                    <span className={`font-medium whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                        }`}>
                        {isDark ? '浅色模式' : '深色模式'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default GlobalSidebar;
