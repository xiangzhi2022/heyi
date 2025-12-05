/**
 * @file RightsCenter.jsx
 * @description 权利中心页面，介绍平台的核心服务、授权协议等信息。
 * @author Gemini
 */

import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

/**
 * RightsCenter 页面组件
 * @returns {JSX.Element}
 */
const RightsCenter = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
            <Navbar showSearch={true} showNotifications={true} showWallet={true} />

            {/* 英雄区域 (Hero Section) */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* 左侧：标题、描述和行动号召按钮 */}
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            创作者内容权利中心
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                            一站式数字版权管理解决方案。从确权登记到授权交易，我们利用区块链技术为您提供全方位的权益保障。
                        </p>
                        <div className="flex gap-4">
                            <Link to="/registration" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                                立即登记作品
                            </Link>
                            <button className="px-8 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                查阅文档
                            </button>
                        </div>
                    </div>
                    {/* 右侧：版权查验小组件 */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-8 rounded-3xl border border-primary/10 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">版权查验</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">作品哈希 / 证书编号</label>
                                    <input
                                        type="text"
                                        placeholder="输入 Hash 或 ID..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
                                    查询状态
                                </button>
                                <p className="text-xs text-gray-500 text-center">
                                    支持查询 Harmony One Rights 平台登记的所有数字资产
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* 核心服务介绍 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: '作品登记', desc: '生成独一无二的数字指纹，确权过程不可篡改。', color: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', text: 'text-blue-900 dark:text-blue-100' },
                        { title: '授权交易', desc: '支持版权转让与多种授权许可模式，价值最大化。', color: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800', text: 'text-purple-900 dark:text-purple-100' },
                        { title: '维权监测', desc: '全网监测侵权行为，提供一键取证与法律支持。', color: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800', text: 'text-green-900 dark:text-green-100' },
                    ].map((item, idx) => (
                        <div key={idx} className={`p-8 rounded-2xl border ${item.color} ${item.border}`}>
                            <h3 className={`text-2xl font-bold mb-4 ${item.text}`}>{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                {item.desc}
                            </p>
                            <button className="font-bold hover:underline opacity-80 hover:opacity-100 transition-opacity">
                                了解更多 &rarr;
                            </button>
                        </div>
                    ))}
                </div>

                {/* 标准授权协议库 */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">标准授权协议库</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { name: '个人非商业使用', price: '免费 / 付费', features: ['仅限个人展示', '不可用于广告', '不可转授权'] },
                        { name: '商业推广授权', price: '按次 / 买断', features: ['用于商业广告', '产品包装', '全渠道推广'] },
                        { name: '数字藏品发行', price: '分成模式', features: ['创建 版权', '限量发行', '二级市场收益'] },
                        { name: '独家全版权转让', price: '议价', features: ['所有财产权转移', '永久生效', '排他性'] },
                    ].map((license, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow group">
                            <div className="h-2 w-12 bg-primary rounded-full mb-4 group-hover:w-20 transition-all" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{license.name}</h3>
                            <p className="text-primary font-bold mb-4">{license.price}</p>
                            <ul className="space-y-2 mb-6">
                                {license.features.map((f, i) => (
                                    <li key={i} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-2 border border-gray-200 dark:border-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                查看范本
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RightsCenter;
