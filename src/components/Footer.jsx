/**
 * @file Footer.jsx
 * @description 应用的全局页脚组件，包含品牌信息、导航链接、社交媒体入口和版权声明。
 * @author Gemini
 */

import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Footer 组件
 * @returns {JSX.Element}
 */
const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
                {/* 页脚主内容区，使用 grid 布局 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* 品牌信息列 */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                H
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Harmony One Rights</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            致力于构建全球领先的数字版权确权与交易生态，为创作者提供安全、便捷的版权保护服务。
                        </p>
                    </div>

                    {/* 链接列 1: 平台服务 */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">平台服务</h3>
                        <ul className="flex flex-col gap-3 text-gray-500 dark:text-gray-400 text-sm">
                            <li><Link to="/registration" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">版权登记</Link></li>
                            <li><Link to="/marketplace" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">版权交易</Link></li>
                            <li><Link to="/marketplace" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">作品展示</Link></li>
                            <li><Link to="/account" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">创作者中心</Link></li>
                        </ul>
                    </div>

                    {/* 链接列 2: 关于我们 */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">关于我们</h3>
                        <ul className="flex flex-col gap-3 text-gray-500 dark:text-gray-400 text-sm">
                            <li><Link to="/brand-story" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">品牌故事</Link></li>
                            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">加入我们</li>
                            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">帮助中心</li>
                            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">隐私政策</li>
                        </ul>
                    </div>

                    {/* 关注我们 / 社交媒体 */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">关注我们</h3>
                        <div className="flex gap-4 mb-6">
                            <button className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors">
                                <Twitter size={20} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors">
                                <Instagram size={20} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors">
                                <Facebook size={20} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors">
                                <Mail size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 页脚底部：版权和次要链接 */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>© 2024 Harmony One Rights Service. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">隐私政策</span>
                        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">服务条款</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
