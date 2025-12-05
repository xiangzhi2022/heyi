/**
 * @file Settings.jsx
 * @description 用户设置页面，包含个人资料、安全、偏好设置等管理功能。
 * @author Gemini
 */

import React, { useState } from 'react';
import { User, Shield, Bell, Wallet, Moon, Sun, Globe, Camera, Save, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useThemeStore, useToastStore } from '../stores';

const Settings = () => {
    const { isDark: isDarkMode, toggleTheme } = useThemeStore();
    const { addToast } = useToastStore();
    const [activeTab, setActiveTab] = useState('profile');

    // 模拟的用户数据状态
    const [profile, setProfile] = useState({
        username: '张三',
        email: 'zhangsan@example.com',
        bio: '数字艺术收藏家，热爱中国传统文化与现代科技的结合。',
        website: 'https://zhangsan.art'
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: true
    });

    const handleSave = () => {
        addToast('设置已保存', 'success');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">个人资料</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">管理您的公开信息和个人简介</p>
                        </div>

                        {/* 头像上传 */}
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                        <span className="text-3xl font-bold text-primary">Z</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>
                            <div>
                                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    更换头像
                                </button>
                                <p className="mt-2 text-xs text-gray-500">支持 JPG, PNG, GIF，最大 2MB</p>
                            </div>
                        </div>

                        {/* 表单 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">用户名</label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">邮箱地址</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">个人简介</label>
                                <textarea
                                    rows="4"
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">个人网站</label>
                                <input
                                    type="url"
                                    value={profile.website}
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'preferences':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">偏好设置</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">自定义您的界面体验和通知方式</p>
                        </div>

                        {/* 主题设置 */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                                界面主题
                            </h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => !isDarkMode && toggleTheme()}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${isDarkMode
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="w-full h-20 bg-gray-900 rounded-lg mb-2 opacity-80"></div>
                                    <span className="font-bold">深色模式</span>
                                </button>
                                <button
                                    onClick={() => isDarkMode && toggleTheme()}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${!isDarkMode
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="w-full h-20 bg-white border border-gray-200 rounded-lg mb-2"></div>
                                    <span className="font-bold">浅色模式</span>
                                </button>
                            </div>
                        </div>

                        {/* 通知设置 */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Bell size={20} />
                                通知推送
                            </h3>
                            {[
                                { id: 'email', label: '邮件通知', desc: '接收关于账户安全和交易的邮件' },
                                { id: 'push', label: '浏览器推送', desc: '接收实时消息和活动提醒' },
                                { id: 'marketing', label: '营销推广', desc: '接收平台新功能和优惠活动信息' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">{item.label}</div>
                                        <div className="text-xs text-gray-500">{item.desc}</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications[item.id]}
                                            onChange={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id] })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">账户安全</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">保护您的账户和资产安全</p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
                            <Shield className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-yellow-800 dark:text-yellow-200">建议开启双重认证 (2FA)</h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    为了您的资产安全，我们强烈建议您绑定 Google Authenticator 或其他 2FA 应用。
                                </p>
                                <button className="mt-3 px-4 py-2 bg-yellow-100 dark:bg-yellow-800/40 text-yellow-900 dark:text-yellow-100 text-sm font-bold rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800/60 transition-colors">
                                    立即开启
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">登录密码</div>
                                    <div className="text-xs text-gray-500">上次修改于 3 个月前</div>
                                </div>
                                <button className="text-primary font-bold text-sm hover:underline">修改</button>
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">钱包连接</div>
                                    <div className="text-xs text-gray-500">已连接 MetaMask (0x12...3456)</div>
                                </div>
                                <button className="text-red-500 font-bold text-sm hover:underline">断开</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'profile', label: '个人资料', icon: User },
        { id: 'preferences', label: '偏好设置', icon: Globe },
        { id: 'security', label: '账户安全', icon: Shield },
        { id: 'wallet', label: '钱包管理', icon: Wallet },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* 侧边栏导航 */}
                    <div className="w-full lg:w-64 shrink-0 space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-2">设置</h1>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <tab.icon size={20} />
                                {tab.label}
                            </button>
                        ))}

                        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                <LogOut size={20} />
                                退出登录
                            </button>
                        </div>
                    </div>

                    {/* 主内容区 */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm min-h-[600px]">
                        {renderContent()}

                        {/* 保存按钮 */}
                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                            >
                                <Save size={20} />
                                保存更改
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
