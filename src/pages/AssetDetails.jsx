/**
 * @file AssetDetails.jsx
 * @description 展示单个数字版权作品详细信息的页面。
 * @author Gemini
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, MoreHorizontal, Eye, Clock, List, Tag, Activity, Shield, Bookmark, TrendingUp, DollarSign, Gavel, FileCheck, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';
import { useToastStore } from '../stores';

import { getAsset } from '../services/mockAssetService';

// ... (imports)


// 模拟的相关作品数据
// 模拟的相关作品数据
const RELATED_ASSETS = [
    {
        id: 2,
        title: "未来城市概念图",
        author: "王五",
        price: "12,000",
        imageColor: "bg-blue-200",
        likes: 85,
        type: 'image',
        status: 'auction', // 拍卖
        chain: 'Ethereum'
    },
    {
        id: 3,
        title: "极简主义海报",
        author: "周九",
        price: "500/月",
        imageColor: "bg-teal-200",
        likes: 67,
        type: 'image',
        status: 'lease', // 租赁
        chain: 'Polygon'
    },
    {
        id: 4,
        title: "商业品牌Logo",
        author: "吴十",
        price: "1,000起",
        imageColor: "bg-indigo-200",
        likes: 312,
        type: 'image',
        status: 'license', // 授权
        chain: 'Harmony'
    },
    {
        id: 5,
        title: "水墨山水画",
        author: "郑八",
        price: "8,800",
        imageColor: "bg-gray-200",
        likes: 156,
        type: 'image',
        status: 'direct', // 一口价
        chain: 'BSC'
    },
];

/**
 * AccordionItem (手风琴/折叠面板) 子组件
 */
const AccordionItem = ({ icon: Icon, title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4 bg-white dark:bg-gray-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{title}</span>
                </div>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    {children}
                </div>
            )}
        </div>
    );
};

/**
 * 价格历史图表 子组件
 */
const PriceHistoryChart = ({ data }) => {
    const maxPrice = Math.max(...data.map(d => d.price));

    return (
        <div className="h-48 flex items-end justify-between gap-2 pt-4">
            {data.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex justify-center">
                        <div
                            className="w-full max-w-[30px] bg-primary/20 group-hover:bg-primary/40 transition-all rounded-t-sm relative"
                            style={{ height: `${(item.price / maxPrice) * 120}px` }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                ¥{item.price}
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
                </div>
            ))}
        </div>
    );
};

/**
 * 一口价交易卡片组件
 */
const FixedPriceCard = ({ asset, onBuy }) => {
    return (
        <>
            <div className="mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">一口价</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{asset.price}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{asset.currency}</span>
                </div>
                {asset.isFullCopyrightTransfer && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                        <Star size={14} />
                        <span>包含完整版权转让</span>
                    </div>
                )}
            </div>

            <button
                onClick={onBuy}
                className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
                <DollarSign size={20} />
                {asset.isFullCopyrightTransfer ? '购买完整版权' : '立即购买'}
            </button>
        </>
    );
};

/**
 * 限时租赁卡片组件
 */
const LeaseCard = ({ asset, onLease }) => {
    return (
        <>
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                    <Clock className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-bold text-teal-900 dark:text-teal-100 mb-1">限时租赁</p>
                        <p className="text-xs text-teal-700 dark:text-teal-300">
                            在租赁期内拥有作品的独家使用权
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    租赁价格 / {asset.leaseSettings?.duration || 1}个月
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {asset.leaseSettings?.price || '0'}
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{asset.currency}</span>
                </div>
            </div>

            <button
                onClick={onLease}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
                <Clock size={20} />
                立即租赁
            </button>
        </>
    );
};

/**
 * 拍卖模式卡片组件
 */
const AuctionCard = ({ asset, onPlaceBid }) => {
    return (
        <>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                    <Gavel className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-1">竞价拍卖</p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                            最高出价者将获得作品所有权
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">当前出价 / 起拍价</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {asset.auctionSettings?.startPrice || asset.price}
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{asset.currency}</span>
                </div>
                {asset.auctionSettings?.reservePrice && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        保留价: ¥{asset.auctionSettings.reservePrice}
                    </div>
                )}
            </div>

            <button
                onClick={onPlaceBid}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
                <Gavel size={20} />
                立即出价
            </button>
        </>
    );
};

/**
 * 授权许可卡片组件
 */
const LicenseCard = ({ asset }) => {
    return (
        <>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                    <FileCheck className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">授权许可</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            选择适合您的授权方案
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">授权许可</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">多种授权方案</span>
                </div>
                <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">个人使用</span>
                        <span className="font-bold text-gray-900 dark:text-white">¥100+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">商业推广</span>
                        <span className="font-bold text-gray-900 dark:text-white">¥1,000+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">独占授权</span>
                        <span className="font-bold text-gray-900 dark:text-white">¥10,000+</span>
                    </div>
                </div>
            </div>

            <Link
                to={`/license/${asset.id}`}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
                <FileCheck size={20} />
                查看授权方案
            </Link>
        </>
    );
};

/**
 * AssetDetails 页面主组件
 * @returns {JSX.Element}
 */
const AssetDetails = () => {
    const { id } = useParams(); // 从 URL 中获取作品ID
    const { addToast } = useToastStore();

    // 使用 mockAssetService 获取数据
    const asset = getAsset(id) || getAsset(1); // Fallback to ID 1 if not found

    // ... (rest of the component)

    // 页面交互相关的状态
    const [isLiked, setIsLiked] = useState(false);
    const [isCollected, setIsCollected] = useState(false);
    const [likeCount, setLikeCount] = useState(asset.likes);

    // 处理点赞事件
    const handleLike = () => {
        if (isLiked) {
            setLikeCount(prev => prev - 1);
            setIsLiked(false);
        } else {
            setLikeCount(prev => prev + 1);
            setIsLiked(true);
            addToast('已添加到喜爱列表', 'success');
        }
    };

    // 处理收藏事件
    const handleCollect = () => {
        setIsCollected(!isCollected);
        addToast(isCollected ? '已从收藏中移除' : '已添加到我的收藏', 'success');
    };

    // 处理购买事件 (模拟)
    const handleBuy = () => {
        if (asset.salesMode === 'direct' && asset.isFullCopyrightTransfer) {
            addToast('已购买完整版权！(模拟)', 'success');
        } else if (asset.salesMode === 'lease') {
            addToast('已成功租赁作品！(模拟)', 'success');
        } else {
            addToast('购买成功！(模拟)', 'success');
        }
    };

    // 处理出价事件 (模拟)
    const handleOffer = () => {
        addToast('出价已提交！(模拟)', 'success');
    };

    // 处理分享事件
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        addToast('链接已复制到剪贴板', 'success');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
            <Navbar showSearch={true} showNotifications={true} showWallet={true} />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 w-full">
                {/* 页面主内容区，采用两栏布局 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">

                    {/* 左栏: 作品媒体、描述和属性 */}
                    <div className="space-y-6">
                        {/* 作品主图 */}
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm relative group">
                            <div className={`w-full h-full ${asset.imageColor} flex items-center justify-center`}>
                                <span className="text-6xl opacity-20 font-bold">ART</span>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={handleShare}
                                    className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg hover:bg-white dark:hover:bg-gray-700 shadow-sm backdrop-blur-sm"
                                >
                                    <Share2 size={20} className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>

                        {/* 作品描述 */}
                        <AccordionItem icon={List} title="描述" defaultOpen={true}>
                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                <p>By <span className="font-bold text-gray-900 dark:text-white">{asset.author}</span></p>
                                <p className="mt-4">{asset.description}</p>
                            </div>
                        </AccordionItem>

                        {/* 作品属性 */}
                        <AccordionItem icon={Tag} title="属性">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {asset.properties.map((prop, idx) => (
                                    <div key={idx} className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                                        <div className="text-xs text-primary font-bold uppercase mb-1">{prop.type}</div>
                                        <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{prop.value}</div>
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                    </div>

                    {/* 右栏: 作品信息和操作 */}
                    <div className="space-y-6">
                        {/* 头部信息 */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <Link to="#" className="text-primary font-bold hover:text-primary-hover text-lg">
                                    {asset.collection}
                                </Link>
                                <div className="flex gap-2">
                                    {/* 收藏按钮 */}
                                    <button
                                        onClick={handleCollect}
                                        className={`p-3 border rounded-xl transition-colors ${isCollected
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                                        title="收藏"
                                    >
                                        <Bookmark size={20} fill={isCollected ? "currentColor" : "none"} />
                                    </button>
                                    <button className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{asset.title}</h1>
                            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
                                <span>拥有者 <span className="text-primary font-bold cursor-pointer">{asset.owner}</span></span>
                                <span className="flex items-center gap-1"><Eye size={16} /> {asset.views} 浏览</span>
                                {/* 点赞按钮 */}
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                                >
                                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} /> {likeCount} 喜爱
                                </button>
                            </div>
                        </div>

                        {/* 价格与操作卡片 */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                                <Clock size={20} />
                                <span>销售结束于 2024年12月31日</span>
                            </div>

                            {/* 根据销售模式渲染对应的卡片组件 - 支持多种模式组合 */}
                            <div className="space-y-6">
                                {(asset.salesModes?.includes('direct') || asset.salesMode === 'direct') && (
                                    <div className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                        <FixedPriceCard asset={asset} onBuy={handleBuy} />
                                    </div>
                                )}
                                {(asset.salesModes?.includes('auction') || asset.salesMode === 'auction') && (
                                    <div className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                        <AuctionCard asset={asset} onPlaceBid={handleOffer} />
                                    </div>
                                )}
                                {(asset.salesModes?.includes('lease') || asset.salesMode === 'lease') && (
                                    <div className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                        <LeaseCard asset={asset} onLease={handleBuy} />
                                    </div>
                                )}
                                {(asset.salesModes?.includes('license') || asset.salesMode === 'license') && (
                                    <div className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                                        <LicenseCard asset={asset} />
                                    </div>
                                )}
                            </div>

                            {(!asset.salesModes || asset.salesModes.length === 0) && !asset.salesMode && (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    暂无可用交易模式
                                </div>
                            )}
                        </div>

                        {/* 价格历史 */}
                        <AccordionItem icon={TrendingUp} title="价格历史" defaultOpen={true}>
                            <PriceHistoryChart data={asset.priceHistory} />
                        </AccordionItem>

                        {/* 交易历史 */}
                        <AccordionItem icon={Activity} title="交易历史" defaultOpen={false}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="py-2 font-medium">事件</th>
                                            <th className="py-2 font-medium">详情</th>
                                            <th className="py-2 font-medium">价格</th>
                                            <th className="py-2 font-medium">发送方</th>
                                            <th className="py-2 font-medium">接收方</th>
                                            <th className="py-2 font-medium">日期</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-900 dark:text-white">
                                        {asset.history.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                <td className="py-3 flex items-center gap-2">
                                                    <Activity size={14} />
                                                    <span className="font-bold">{item.event}</span>
                                                </td>
                                                <td className="py-3 text-gray-500 dark:text-gray-400">
                                                    {item.detail || '-'}
                                                </td>
                                                <td className="py-3 font-bold">{item.price}</td>
                                                <td className="py-3 text-primary">{item.from}</td>
                                                <td className="py-3 text-primary">{item.to}</td>
                                                <td className="py-3 text-gray-500 dark:text-gray-400">{item.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </AccordionItem>
                    </div>
                </div>

                {/* 相关作品区域 */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">更多相关作品</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {RELATED_ASSETS.map((item) => (
                            <ListingCard key={item.id} {...item} />
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AssetDetails;
