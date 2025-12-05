import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
    // State
    notifications: [
        { id: 1, title: '作品售出提醒', message: '您的作品《无尽的创意》已被购买', time: '10分钟前', read: false, type: 'success' },
        { id: 2, title: '系统维护通知', message: '系统将于今晚凌晨进行例行维护', time: '2小时前', read: false, type: 'info' },
        { id: 3, title: '新功能上线', message: '版权登记功能现已支持视频文件', time: '1天前', read: true, type: 'primary' }
    ],
    unreadCount: 2,

    // Actions
    markAsRead: (id) => set((state) => {
        const newNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        return {
            notifications: newNotifications,
            unreadCount: newNotifications.filter(n => !n.read).length
        };
    }),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
    })),

    addNotification: (notification) => set((state) => {
        const newNotification = {
            id: Date.now(),
            read: false,
            time: '刚刚',
            ...notification
        };
        return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        };
    }),

    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
