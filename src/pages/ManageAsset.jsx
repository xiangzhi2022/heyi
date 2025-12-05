import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Trash2, Eye, EyeOff, Edit3, DollarSign, Gavel, FileCheck, Star, Clock, AlertCircle, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToastStore } from '../stores';

import { getAsset, saveAsset } from '../services/mockAssetService';

// ... (imports)

const SALES_MODES = [
    {
        id: 'direct',
        name: '一口价交易',
        icon: DollarSign,
        description: '以固定价格出售作品，可选择是否转让完整版权',
        color: 'bg-blue-500'
    },
    {
        id: 'license',
        name: '授权许可',
        icon: FileCheck,
        description: '允许购买者获得特定使用权限的授权',
        color: 'bg-purple-500'
    },
    {
        id: 'auction',
        name: '拍卖模式',
        icon: Gavel,
        description: '通过竞价方式出售作品',
        color: 'bg-orange-500'
    },
    {
        id: 'lease',
        name: '限时租赁',
        icon: Clock, // 使用 Clock 图标
        description: '在特定时间内独家使用完整版权',
        color: 'bg-teal-500'
    }
];

const LICENSE_TYPES = [
    {
        id: 'personal',
        name: '个人非商业使用',
        description: '仅限个人展示，不可用于商业',
        defaultPrice: '100'
    },
    {
        id: 'commercial',
        name: '商业推广授权',
        description: '用于商业广告、产品包装等',
        defaultPrice: '1000'
    },
    {
        id: 'copyright',
        name: '数字藏品发行',
        description: '创建 版权、限量发行',
        defaultPrice: '5000'
    },
    {
        id: 'exclusive',
        name: '独占授权',
        description: '在特定时间内独家使用',
        defaultPrice: '10000'
    }
];

const ManageAsset = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToastStore();

    // Initialize state with data from service
    const [asset, setAsset] = useState(() => {
        const loadedAsset = getAsset(id);
        // Fallback if asset not found (though in real app handle 404)
        return loadedAsset || {
            id: parseInt(id),
            title: "未知作品",
            description: "",
            price: "0",
            imageColor: "bg-gray-200",
            isListed: false,
            type: 'image',
            salesMode: 'direct',
            licenseTypes: [],
            auctionSettings: { startPrice: '', reservePrice: '', duration: '7', startTime: '' },
            leaseSettings: { price: '', duration: '1' }
        };
    });

    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');

    const [formData, setFormData] = useState({
        title: asset.title,
        description: asset.description,
        price: asset.price
    });

    const [salesSettings, setSalesSettings] = useState({
        mode: asset.salesMode,
        price: asset.price,
        transferCopyright: asset.isFullCopyrightTransfer || false,
        licenses: (asset.licenseTypes || []).map(l => ({ type: l, price: '' })), // Simplified for now
        auction: asset.auctionSettings || { startPrice: '', reservePrice: '', duration: '7', startTime: '' },
        lease: asset.leaseSettings || { price: '', duration: '1' }
    });

    // ... (handleInputChange, handleSalesSettingsChange, handleLicenseToggle, handleLicensePriceChange remain similar)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSalesSettingsChange = (field, value) => {
        setSalesSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleLicenseToggle = (licenseId) => {
        setSalesSettings(prev => {
            const exists = prev.licenses.find(l => l.type === licenseId);
            if (exists) {
                return {
                    ...prev,
                    licenses: prev.licenses.filter(l => l.type !== licenseId)
                };
            } else {
                const licenseType = LICENSE_TYPES.find(l => l.id === licenseId);
                return {
                    ...prev,
                    licenses: [...prev.licenses, { type: licenseId, price: licenseType.defaultPrice }]
                };
            }
        });
    };

    const handleLicensePriceChange = (licenseId, price) => {
        setSalesSettings(prev => ({
            ...prev,
            licenses: prev.licenses.map(l =>
                l.type === licenseId ? { ...l, price } : l
            )
        }));
    };

    const handleSaveBasicInfo = () => {
        const updatedAsset = {
            ...asset,
            title: formData.title,
            description: formData.description,
            price: formData.price
        };
        saveAsset(updatedAsset);
        setAsset(updatedAsset);
        setIsEditing(false);
        addToast('作品信息已更新', 'success');
    };

    const handleSaveSalesSettings = () => {
        const updatedAsset = {
            ...asset,
            salesMode: salesSettings.mode,
            price: salesSettings.price,
            isFullCopyrightTransfer: salesSettings.transferCopyright,
            licenseTypes: salesSettings.licenses.map(l => l.type),
            auctionSettings: salesSettings.auction,
            leaseSettings: salesSettings.lease
        };
        saveAsset(updatedAsset);
        setAsset(updatedAsset);
        addToast('交易设置已保存', 'success');
    };

    const handleCancelEdit = () => {
        setFormData({
            title: asset.title,
            description: asset.description,
            price: asset.price
        });
        setIsEditing(false);
    };

    const handleToggleListing = () => {
        setAsset(prev => ({ ...prev, isListed: !prev.isListed }));
        addToast(asset.isListed ? '作品已下架' : '作品已上架', 'success');
    };

    const handleDelete = () => {
        if (window.confirm('确定要删除这个作品吗？此操作不可撤销。')) {
            addToast('作品已删除', 'success');
            setTimeout(() => navigate('/account'), 1000);
        }
    };

    const renderSalesSettings = () => {
        switch (salesSettings.mode) {
            case 'direct':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                销售价格 (CNY)
                            </label>
                            <input
                                type="text"
                                value={salesSettings.price}
                                onChange={(e) => handleSalesSettingsChange('price', e.target.value)}
                                placeholder="请输入价格"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                            <input
                                type="checkbox"
                                id="copyright-transfer"
                                checked={salesSettings.transferCopyright}
                                onChange={(e) => handleSalesSettingsChange('transferCopyright', e.target.checked)}
                                className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="copyright-transfer" className="flex-1 cursor-pointer">
                                <span className="block font-bold text-gray-900 dark:text-white mb-1">
                                    包含独家全版权转让
                                </span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                    勾选此项表示您同意将作品的所有版权（包括署名权、修改权、复制权等）永久转让给买家。此操作不可逆，请谨慎选择。
                                </span>
                            </label>
                        </div>

                        {salesSettings.transferCopyright && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                            <span className="font-bold">重要提示：</span>全版权转让后，您将失去对该作品的所有权利。建议提高售价以反映版权价值。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'license':
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">授权许可模式说明</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        选择您希望提供的授权类型，每种授权可以设置不同的价格。买家购买授权后可在授权范围内使用您的作品。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {LICENSE_TYPES.map(license => {
                                const selected = salesSettings.licenses.find(l => l.type === license.id);
                                return (
                                    <div
                                        key={license.id}
                                        className={`border-2 rounded-xl p-4 transition-all ${selected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected}
                                                    onChange={() => handleLicenseToggle(license.id)}
                                                    className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                                        {license.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {license.description}
                                                    </p>
                                                </div>
                                            </div>
                                            {selected && (
                                                <div className="w-40">
                                                    <input
                                                        type="text"
                                                        value={selected.price}
                                                        onChange={(e) => handleLicensePriceChange(license.id, e.target.value)}
                                                        placeholder="价格"
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">CNY</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'auction':
                return (
                    <div className="space-y-4">
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Gavel className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-1">拍卖模式说明</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">
                                        设置起拍价和保留价，买家通过竞价方式购买作品。拍卖结束后，最高出价者获得作品。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                起拍价 (CNY)
                            </label>
                            <input
                                type="text"
                                value={salesSettings.auction.startPrice}
                                onChange={(e) => handleSalesSettingsChange('auction', { ...salesSettings.auction, startPrice: e.target.value })}
                                placeholder="请输入起拍价"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                保留价 (CNY) <span className="text-gray-400 font-normal">可选</span>
                            </label>
                            <input
                                type="text"
                                value={salesSettings.auction.reservePrice}
                                onChange={(e) => handleSalesSettingsChange('auction', { ...salesSettings.auction, reservePrice: e.target.value })}
                                placeholder="低于此价格不会成交"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                拍卖时长
                            </label>
                            <select
                                value={salesSettings.auction.duration}
                                onChange={(e) => handleSalesSettingsChange('auction', { ...salesSettings.auction, duration: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="1">1 天</option>
                                <option value="3">3 天</option>
                                <option value="7">7 天</option>
                                <option value="14">14 天</option>
                                <option value="30">30 天</option>
                            </select>
                        </div>
                    </div>
                );

            case 'lease':
                return (
                    <div className="space-y-4">
                        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Clock className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-teal-900 dark:text-teal-100 mb-1">限时租赁模式说明</p>
                                    <p className="text-xs text-teal-700 dark:text-teal-300">
                                        买家在特定时间内获得作品的独家使用权，到期后自动失效。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                租赁价格 (CNY)
                            </label>
                            <input
                                type="text"
                                value={salesSettings.lease.price}
                                onChange={(e) => handleSalesSettingsChange('lease', { ...salesSettings.lease, price: e.target.value })}
                                placeholder="请输入租赁价格"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                租赁时长
                            </label>
                            <select
                                value={salesSettings.lease.duration}
                                onChange={(e) => handleSalesSettingsChange('lease', { ...salesSettings.lease, duration: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="1">1 个月</option>
                                <option value="3">3 个月</option>
                                <option value="6">6 个月</option>
                                <option value="12">1 年</option>
                                <option value="24">2 年</option>
                            </select>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
            <Navbar showSearch={false} showNotifications={true} showWallet={true} />

            <div className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/account')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-bold">返回个人中心</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/assets/${id}`}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold"
                        >
                            <Eye size={18} />
                            预览
                        </Link>
                    </div>
                </div>

                {/* Section Tabs */}
                <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-8 overflow-x-auto pb-4">
                        {[
                            { id: 'basic', label: '基本信息', icon: Edit3 },
                            { id: 'sales', label: '交易设置', icon: DollarSign },
                            { id: 'preview', label: '预览与发布', icon: Eye }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`flex items-center gap-2 pb-4 border-b-2 transition-colors whitespace-nowrap font-bold ${activeSection === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                <tab.icon size={20} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">作品预览</h2>
                            <div className={`w-full aspect-square rounded-2xl ${asset.imageColor} flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm mb-4`}>
                                <span className="text-6xl opacity-20 font-bold">ART</span>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${asset.isListed
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {asset.isListed ? <Eye size={18} /> : <EyeOff size={18} />}
                                    {asset.isListed ? '已上架' : '未上架'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {asset.isListed ? '用户可见' : '仅自己可见'}
                                </div>
                            </div>

                            {/* Current Sales Mode */}
                            {/* Current Sales Mode & Button Preview */}
                            {SALES_MODES.find(m => m.id === salesSettings.mode) && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">当前交易模式</p>
                                        <div className="flex items-center gap-3">
                                            {React.createElement(SALES_MODES.find(m => m.id === salesSettings.mode).icon, {
                                                size: 24,
                                                className: 'text-primary'
                                            })}
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {SALES_MODES.find(m => m.id === salesSettings.mode).name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(() => {
                                                        switch (salesSettings.mode) {
                                                            case 'direct': return `¥${salesSettings.price || '0'}`;
                                                            case 'auction': return `起拍价 ¥${salesSettings.auction.startPrice || '0'}`;
                                                            case 'lease': return `¥${salesSettings.lease.price || '0'} / ${salesSettings.lease.duration}个月`;
                                                            case 'license': return '多种授权方案';
                                                            default: return '';
                                                        }
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Button Preview */}
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">买家视角按钮预览</p>
                                        {(() => {
                                            switch (salesSettings.mode) {
                                                case 'direct':
                                                    return (
                                                        <button className="w-full py-2.5 bg-primary text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-90">
                                                            {salesSettings.transferCopyright ? '购买完整版权' : '立即购买'}
                                                        </button>
                                                    );
                                                case 'auction':
                                                    return (
                                                        <button className="w-full py-2.5 bg-orange-600 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-90">
                                                            <Gavel size={16} />
                                                            立即出价
                                                        </button>
                                                    );
                                                case 'lease':
                                                    return (
                                                        <button className="w-full py-2.5 bg-teal-600 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-90">
                                                            <Clock size={16} />
                                                            立即租赁
                                                        </button>
                                                    );
                                                case 'license':
                                                    return (
                                                        <button className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-90">
                                                            <FileCheck size={16} />
                                                            获取授权许可
                                                        </button>
                                                    );
                                                default: return null;
                                            }
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-2">
                        {activeSection === 'basic' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">基本信息</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-bold"
                                        >
                                            <Edit3 size={18} />
                                            编辑
                                        </button>
                                    )}
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            作品名称
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white text-lg font-bold">{asset.title}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            作品描述
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                            />
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-300">{asset.description}</p>
                                        )}
                                    </div>

                                    {/* Edit Actions */}
                                    {isEditing && (
                                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={handleSaveBasicInfo}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-bold"
                                            >
                                                <Save size={18} />
                                                保存修改
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold"
                                            >
                                                取消
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeSection === 'sales' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">交易设置</h2>

                                {/* Sales Mode Selection */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">选择交易模式</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {SALES_MODES.map(mode => {
                                            const Icon = mode.icon;
                                            const isSelected = salesSettings.mode === mode.id;
                                            return (
                                                <button
                                                    key={mode.id}
                                                    onClick={() => handleSalesSettingsChange('mode', mode.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${mode.color} bg-opacity-10`}>
                                                            <Icon size={24} className={`${mode.color.replace('bg-', 'text-')}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                                {mode.name}
                                                                {isSelected && <Check size={16} className="text-primary" />}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {mode.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Mode-specific Settings */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        {SALES_MODES.find(m => m.id === salesSettings.mode)?.name} 设置
                                    </h3>
                                    {renderSalesSettings()}

                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={handleSaveSalesSettings}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-bold text-lg"
                                        >
                                            <Save size={20} />
                                            保存交易设置
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'preview' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">预览与发布</h2>

                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                                            <div>
                                                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">发布前检查清单</p>
                                                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                                    <li>✓ 确认作品信息准确无误</li>
                                                    <li>✓ 选择合适的交易模式</li>
                                                    <li>✓ 设置合理的价格</li>
                                                    <li>✓ 了解相关法律责任</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Actions */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleToggleListing}
                                            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${asset.isListed
                                                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                                : 'bg-primary hover:bg-primary-hover text-white'
                                                }`}
                                        >
                                            {asset.isListed ? <EyeOff size={20} /> : <Eye size={20} />}
                                            {asset.isListed ? '下架作品' : '上架作品'}
                                        </button>

                                        <button
                                            onClick={handleDelete}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-bold border border-red-200 dark:border-red-800"
                                        >
                                            <Trash2 size={20} />
                                            删除作品
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ManageAsset;
