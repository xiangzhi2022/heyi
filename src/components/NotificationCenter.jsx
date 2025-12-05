/**
 * @file NotificationCenter.jsx
 * @description 一个下拉式的通知中心组件，用于显示、管理和与通知进行交互。
 * @author Gemini
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../stores';

/**
 * NotificationCenter 组件
 * @returns {JSX.Element}
 */
const NotificationCenter = () => {
    // 从全局通知上下文中获取状态和操作函数
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications: clearAll } = useNotificationStore();
    // 控制下拉菜单的显示/隐藏
    const [isOpen, setIsOpen] = useState(false);
    // 用于引用下拉菜单的DOM元素
    const dropdownRef = useRef(null);

    // 使用 useEffect 实现点击组件外部时关闭下拉菜单的功能
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 如果 dropdownRef 存在，并且点击的目标不在 dropdownRef 的元素内部
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        // 监听整个文档的 mousedown 事件
        document.addEventListener('mousedown', handleClickOutside);
        // 组件卸载时移除事件监听，防止内存泄漏
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * 根据通知类型返回对应的图标
     * @param {string} type - 通知类型 ('success', 'warning', 'error', 'info')
     * @returns {JSX.Element}
     */
    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-green-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'error': return <X size={16} className="text-red-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 通知中心触发按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative"
            >
                <Bell size={24} />
                {/* 如果有未读通知，则显示一个红点提示 */}
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                )}
            </button>

            {/* 下拉菜单，当 isOpen 为 true 时显示 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* 下拉菜单头部 */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            通知中心
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                    {unreadCount} 未读
                                </span>
                            )}
                        </h3>
                        <div className="flex items-center gap-1">
                            {/* 操作按钮：全部标为已读、清空通知 */}
                            <button
                                onClick={markAllAsRead}
                                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="全部标为已读"
                            >
                                <Check size={16} />
                            </button>
                            <button
                                onClick={clearAll}
                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="清空通知"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* 通知列表区域 */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                        {notifications.length === 0 ? (
                            // 空状态显示
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                                <p>暂无新通知</p>
                            </div>
                        ) : (
                            // 渲染通知列表
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative group ${
                                            // 未读通知有不同的背景色
                                            !notification.read ? 'bg-primary/5 dark:bg-primary/5' : ''
                                            }`}
                                    >
                                        {/* 未读通知左侧的蓝色标记线 */}
                                        {!notification.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                        )}
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className={`text-sm font-bold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                        {notification.time}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 下拉菜单底部 */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-center">
                        <button className="text-sm text-primary font-bold hover:underline">
                            查看所有通知
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
