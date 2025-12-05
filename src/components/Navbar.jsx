/**
 * @file Navbar.jsx
 * @description 应用的功能导航栏 - 专注于搜索、通知、钱包等操作
 * @author Gemini
 */

import React, { useState } from 'react';
import { Search, Wallet, Menu, User, Moon, Sun, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore, useToastStore, useSearchStore } from '../stores';
import NotificationCenter from './NotificationCenter';

/**
 * Navbar 组件
 * @description 功能导航栏，包括搜索、通知、钱包连接等操作
 * @param {object} props - 组件属性
 * @param {boolean} [props.showSearch=true] - 是否显示搜索栏
 * @param {boolean} [props.showNotifications=true] - 是否显示通知中心
 * @param {boolean} [props.showWallet=true] - 是否显示钱包连接
 * @param {boolean} [props.showThemeToggle=false] - 是否显示主题切换（移动端默认显示）
 * @param {boolean} [props.showUserMenu=true] - 是否显示用户菜单
 * @returns {JSX.Element}
 */
const Navbar = ({
    showSearch = true,
    showNotifications = true,
    showWallet = true,
    showThemeToggle = false,  // 桌面端默认不显示，在GlobalSidebar中
    showUserMenu = true
}) => {
    const { isDark, toggleTheme } = useThemeStore();
    const { searchTerm, setSearchTerm } = useSearchStore();
    const { addToast } = useToastStore();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    const handleConnectWallet = () => {
        if (isWalletConnected) {
            setIsWalletConnected(false);
            addToast('钱包已断开连接', 'info');
        } else {
            setTimeout(() => {
                setIsWalletConnected(true);
                addToast('钱包连接成功！', 'success');
            }, 500);
        }
    };

    return (
        <>
            {/* 主导航栏 */}
            <nav className="sticky top-0 z-50 glass h-[72px] flex items-center px-4 sm:px-8 lg:pl-24 transition-colors duration-300">

                {/* 搜索栏 */}
                {showSearch && (
                    <div className="flex-1 max-w-2xl hidden sm:flex relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="搜索版权、作品、创作者..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-transparent focus:border-gray-300 dark:focus:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-all hover:bg-white dark:hover:bg-gray-900 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>
                )}

                {/* 右侧操作按钮组 */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* 通知中心 */}
                    {showNotifications && <NotificationCenter />}

                    {/* 主题切换 - 桌面端可选，移动端始终显示 */}
                    {(showThemeToggle || window.innerWidth < 1024) && (
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white lg:hidden"
                            title={isDark ? "切换到浅色模式" : "切换到深色模式"}
                        >
                            {isDark ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                    )}

                    {/* 用户菜单 */}
                    {showUserMenu && (
                        <Link
                            to="/account"
                            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            title="个人中心"
                        >
                            <User size={24} />
                        </Link>
                    )}

                    {/* 钱包连接 */}
                    {showWallet && (
                        <button
                            onClick={handleConnectWallet}
                            className={`p-3 rounded-xl transition-colors flex items-center gap-2 ${isWalletConnected
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            title={isWalletConnected ? "断开连接" : "连接钱包"}
                        >
                            <Wallet size={24} />
                            {isWalletConnected && <span className="text-sm font-bold hidden sm:inline">0x12...34</span>}
                        </button>
                    )}

                    {/* 移动端菜单按钮 */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* 移动端菜单浮层 */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col animate-in slide-in-from-right duration-200">
                    {/* 移动端菜单头部 */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 h-[72px]">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Harmony One Rights</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* 移动端菜单内容 */}
                    <div className="p-4 flex-1 overflow-y-auto">
                        {/* 移动端搜索栏 */}
                        {showSearch && (
                            <div className="relative mb-8">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Search size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="搜索..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-12 pl-10 bg-gray-100 dark:bg-gray-800 rounded-xl border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        )}

                        {/* 移动端导航链接 - 与GlobalSidebar保持一致 */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">核心</div>
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">发现</Link>
                            <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">版权市场</Link>
                            <Link to="/ranking" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">排行榜</Link>
                            <Link to="/rights-center" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">权利中心</Link>

                            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 mt-6">创作</div>
                            <Link to="/registration" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">版权登记</Link>
                            <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">个人中心</Link>

                            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 mt-6">其他</div>
                            <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">帮助中心</Link>
                            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">设置</Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
