/**
 * @file Profile.jsx
 * @description 用户个人中心页面，展示用户的个人信息、作品、收藏、活动等，并提供编辑和创作入口。
 * @author Gemini
 */

import React, { useState } from 'react';
import { Copy, Share2, MoreHorizontal, Grid, Heart, Layout, Settings, Activity, Edit3, X, Save, PlusCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import Footer from '../components/Footer';
import { useToastStore } from '../stores';
import CreateCopyrightModal from '../components/CreateCopyrightModal';

// --- 模拟数据 ---
const MOCK_USER = {
    name: "CryptoArtist",
    address: "0x1234...5678",
    banner: "bg-gradient-to-r from-purple-500 to-pink-500",
    avatar: "bg-purple-600",
    bio: "Digital artist exploring the boundaries of generative art and blockchain technology.",
    email: "artist@example.com",
    twitter: "@cryptoartist",
    stats: {
        collected: 12,
        created: 45,
        favorited: 128
    }
};
const MOCK_CREATED = [
    { id: 1, title: "山水之间 #001", author: "CryptoArtist", price: "5,000", imageColor: "bg-green-200", likes: 120, type: 'image', status: 'buyNow', chain: 'Harmony' },
    { id: 2, title: "未来城市概念图", author: "CryptoArtist", price: "12,000", imageColor: "bg-blue-200", likes: 85, type: 'image', status: 'auction', chain: 'Ethereum' },
];
const MOCK_COLLECTED = [
    { id: 3, title: "星际迷航原声带", author: "OtherArtist", price: "3,500", imageColor: "bg-purple-200", likes: 230, type: 'music', status: 'new', chain: 'Polygon' },
];
const MOCK_FAVORITED = [
    { id: 4, title: "赛博朋克短片", author: "钱七", price: "8,800", imageColor: "bg-red-200", likes: 45, type: 'video', status: 'hasOffers', chain: 'Harmony' },
    { id: 5, title: "科幻小说《觉醒》", author: "孙八", price: "1,500", imageColor: "bg-yellow-200", likes: 156, type: 'text', status: 'buyNow', chain: 'Ethereum' },
];
const MOCK_ACTIVITY = [
    { id: 1, event: '创建', item: '山水之间 #001', price: '-', from: 'Null', to: 'CryptoArtist', date: '2天前' },
    { id: 2, event: '购买', item: '星际迷航原声带', price: '3,500 CNY', from: 'OtherArtist', to: 'CryptoArtist', date: '1周前' },
    { id: 3, event: '上架', item: '未来城市概念图', price: '12,000 CNY', from: 'CryptoArtist', to: '-', date: '2周前' },
];
// --- 模拟数据结束 ---


/**
 * EditProfileModal (编辑个人资料模态框) 子组件
 * @param {object} props
 * @returns {JSX.Element | null}
 */
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({ ...user });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">编辑个人资料</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* 表单输入项... */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">昵称</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">简介</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Twitter</label>
                        <input
                            type="text"
                            value={formData.twitter}
                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            取消
                        </button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2">
                            <Save size={18} />
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Profile 页面主组件
 * @returns {JSX.Element}
 */
const Profile = () => {
    // 状态管理
    const [activeTab, setActiveTab] = useState('created'); // 当前激活的标签页
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 编辑资料模态框是否打开
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 创建版权模态框是否打开
    const [user, setUser] = useState(MOCK_USER); // 用户信息
    const { addToast } = useToastStore();

    // --- 事件处理器 ---
    const handleCopyAddress = () => {
        navigator.clipboard.writeText(user.address);
        addToast('地址已复制到剪贴板', 'success');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        addToast('链接已复制到剪贴板', 'success');
    };

    const handleSaveProfile = (updatedUser) => {
        setUser(updatedUser);
        addToast('个人资料已更新', 'success');
    };

    /**
     * 根据 activeTab 的值，渲染对应的标签页内容
     * @returns {JSX.Element}
     */
    const renderTabContent = () => {
        // 活动历史
        if (activeTab === 'activity') {
            return (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        {/* 表格头部 */}
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-medium">事件</th>
                                <th className="px-6 py-4 font-medium">作品</th>
                                <th className="px-6 py-4 font-medium">价格</th>
                                <th className="px-6 py-4 font-medium">发送方</th>
                                <th className="px-6 py-4 font-medium">接收方</th>
                                <th className="px-6 py-4 font-medium">日期</th>
                            </tr>
                        </thead>
                        {/* 表格内容 */}
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {MOCK_ACTIVITY.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-2"><Activity size={16} className="text-primary" /> {item.event}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{item.item}</td>
                                    <td className="px-6 py-4 font-bold">{item.price}</td>
                                    <td className="px-6 py-4 text-primary">{item.from}</td>
                                    <td className="px-6 py-4 text-primary">{item.to}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        // 账户设置
        if (activeTab === 'settings') {
            return (
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">账户设置</h3>
                    <div className="space-y-6">
                        {/* ... 设置项 ... */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">邮件通知</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">接收关于交易和活动的邮件通知</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-primary">
                                <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm"></span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">隐私模式</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">隐藏您的收藏列表</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-gray-200 dark:bg-gray-700">
                                <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm"></span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // 准备作品列表数据
        let data = [];
        switch (activeTab) {
            case 'created':
                data = MOCK_CREATED;
                break;
            case 'collected':
                data = MOCK_COLLECTED;
                break;
            case 'favorited':
                data = MOCK_FAVORITED;
                break;
            default:
                data = [];
        }

        // 如果没有数据，显示空状态
        if (data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Grid size={32} />
                    </div>
                    <p className="text-lg font-bold">暂无内容</p>
                </div>
            );
        }

        // 渲染作品列表
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.map((item) => (
                    <ListingCard
                        key={item.id}
                        {...item}
                        // 根据当前标签页动态传递 props，以控制卡片的显示和行为
                        isOwner={activeTab === 'created' || activeTab === 'collected'}
                        ownershipType={activeTab === 'created' ? 'created' : activeTab === 'collected' ? 'collected' : 'none'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
            <Navbar showSearch={true} showNotifications={true} showWallet={true} />

            {/* 用户 Banner */}
            <div className={`h-64 ${user.banner} relative group`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-4 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleShare} className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 text-white transition-colors">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 text-white transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* 用户信息和操作按钮 */}
            <div className="px-8 pb-8 -mt-20 relative z-10">
                <div className="flex flex-col gap-6">
                    {/* 头像 */}
                    <div className={`w-40 h-40 ${user.avatar} rounded-2xl border-4 border-white dark:border-gray-900 shadow-xl flex items-center justify-center text-white text-4xl font-bold`}>
                        CA
                    </div>

                    <div className="flex justify-between items-start">
                        {/* 左侧：名称、地址、简介 */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
                            <div
                                onClick={handleCopyAddress}
                                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <span className="font-mono">{user.address}</span>
                                <Copy size={14} />
                            </div>
                            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl">
                                {user.bio}
                            </p>
                        </div>

                        {/* 右侧：操作按钮 */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg transform hover:scale-105"
                            >
                                <PlusCircle size={18} />
                                创建版权
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                            >
                                <Edit3 size={18} />
                                编辑资料
                            </button>
                            <div onClick={handleShare} className="cursor-pointer flex gap-1 items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Share2 size={18} className="text-gray-500" />
                            </div>
                            <div className="cursor-pointer flex gap-1 items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <MoreHorizontal size={18} className="text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 标签页导航系统 */}
                <div className="mt-12 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-8 overflow-x-auto pb-4">
                        {[
                            { id: 'created', label: '创建', count: user.stats.created, icon: Grid },
                            { id: 'collected', label: '持有', count: user.stats.collected, icon: Layout },
                            { id: 'favorited', label: '喜爱', count: user.stats.favorited, icon: Heart },
                            { id: 'activity', label: '活动', count: null, icon: Activity },
                            { id: 'settings', label: '设置', count: null, icon: Settings },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="font-bold">{tab.label}</span>
                                {tab.count !== null && (
                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs font-mono">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 标签页内容渲染区域 */}
                <div className="mt-8 min-h-[400px]">
                    {renderTabContent()}
                </div>
            </div>

            {/* 模态框 */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onSave={handleSaveProfile}
            />
            <CreateCopyrightModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <Footer />
        </div>
    );
};

export default Profile;
