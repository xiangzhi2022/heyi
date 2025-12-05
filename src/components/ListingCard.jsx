/**
 * @file ListingCard.jsx
 * @description 用于在市场、个人中心等页面展示单个作品的卡片组件。
 * @author Gemini
 */

import React, { memo } from 'react';
import { Heart, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ListingCard 组件
 * @param {object} props - 组件属性
 * @param {string|number} props.id - 作品的唯一标识符
 * @param {string} props.title - 作品标题
 * @param {string} props.author - 作者名称
 * @param {string} props.price - 价格
 * @param {string} props.imageColor - 图片区域的背景色类名 (e.g., 'bg-green-200')
 * @param {number} props.likes - 初始的点赞数
 * @param {string} props.type - 作品类型 (e.g., 'image', 'music')
 * @param {string} props.status - 作品状态 (e.g., 'auction', 'buyNow')
 * @param {string} props.chain - 所属区块链 (e.g., 'Harmony', 'Polygon')
 * @param {boolean} [props.isOwner=false] - 当前用户是否是作品的所有者
 * @param {string} [props.ownershipType='none'] - 所有权类型 ('created': 我创作的, 'collected': 我持有的, 'none': 其他)
 * @returns {JSX.Element}
 */
const ListingCard = ({ id, title, author, price, imageColor, likes, type, status, salesModes, chain, isOwner = false, ownershipType = 'none', scriptType, imageUrl }) => {
    // 使用 React state 管理点赞状态和数量
    const [isLiked, setIsLiked] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(likes);

    /**
     * 处理点赞按钮点击事件
     * @param {React.MouseEvent} e - 事件对象
     */
    const handleLike = (e) => {
        e.preventDefault();  // 阻止链接跳转
        e.stopPropagation(); // 阻止事件冒泡到父级 Link
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative">

            {/* 图片区域，根据 isOwner 链接到不同页面 */}
            <Link to={isOwner ? `/manage-asset/${id}` : `/assets/${id}`} className="block relative aspect-square overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className={`w-full h-full ${imageColor} transition-transform duration-500 group-hover:scale-110`} />
                )}

                {/* 条件渲染：状态徽章 */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                    {(salesModes?.includes('auction') || status === 'auction') && (
                        <div className="bg-orange-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                            拍卖中
                        </div>
                    )}
                    {(salesModes?.includes('lease') || status === 'lease') && (
                        <div className="bg-teal-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                            可租赁
                        </div>
                    )}
                    {(salesModes?.includes('license') || status === 'license') && (
                        <div className="bg-blue-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                            可授权
                        </div>
                    )}
                    {type === 'literature' && scriptType && (
                        <div className="bg-purple-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                            {scriptType === 'short-drama' ? '短剧' :
                                scriptType === 'long-drama' ? '长剧' :
                                    scriptType === 'unit-series' ? '单元片' : '剧本'}
                        </div>
                    )}
                </div>

                {/* 条件渲染：所有权徽章 */}
                {ownershipType === 'created' && (
                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                        我的作品
                    </div>
                )}
                {ownershipType === 'collected' && (
                    <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                        已持有
                    </div>
                )}

                {/* 点赞按钮 - 默认透明，在 group-hover (父元素悬浮) 时显示 */}
                <button
                    onClick={handleLike}
                    className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all hover:scale-110 ${isLiked ? 'bg-red-50 text-red-500 opacity-100' : 'bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100'}`}
                >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
            </Link>

            {/* 内容区域 */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2 group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {author}
                        </p>
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">价格</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                            ¥{price}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">热度</p>
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-700 dark:text-gray-300">
                            <Heart size={14} className={isLiked ? "text-red-500" : "text-gray-400"} fill={isLiked ? "currentColor" : "none"} />
                            {likeCount}
                        </div>
                    </div>
                </div>
            </div>

            {/* 快捷操作浮层 */}
            {/* 默认在卡片下方 (translate-y-full)，在 group-hover 时上移到可见位置 (translate-y-0) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
                {isOwner ? (
                    // 如果是所有者，显示“管理作品”按钮
                    <Link to={`/manage-asset/${id}`} className="block w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 text-center flex items-center justify-center gap-2">
                        <Edit3 size={18} />
                        管理作品
                    </Link>
                ) : (
                    // 否则显示“立即购买”按钮
                    <Link to={`/assets/${id}`} className="block w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 text-center">
                        立即购买
                    </Link>
                )}
            </div>
        </div>
    );
};

// 使用 React.memo 对组件进行性能优化。
// 如果 props 没有发生变化，将跳过该组件的重新渲染。
export default memo(ListingCard);
