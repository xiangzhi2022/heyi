/**
 * @file LicensePage.jsx
 * @description 数字版权授权获取页面，用户可在此选择授权类型、期限并完成支付。
 * @author Gemini
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Shield, Clock, FileText, Download, AlertCircle, X, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToastStore } from '../stores';

// 模拟的资产数据
const MOCK_ASSET = {
    id: 1,
    title: "无尽的创意 #8821",
    author: "艺术家张三",
    image: "bg-gradient-to-br from-blue-400 to-purple-500",
    type: "image",
    basePrice: 5000 // 用于计算的基础价格
};

// 授权类型配置
const LICENSE_TYPES = [
    { id: 'personal', label: '个人使用', multiplier: 1, desc: '仅限个人展示、收藏，不可用于商业项目' },
    { id: 'commercial', label: '商业授权', multiplier: 5, desc: '可用于广告、商品包装、营销物料等商业用途' },
    { id: 'modification', label: '改编权', multiplier: 8, desc: '允许对作品进行二次创作、修改和衍生品开发' },
];

// 授权期限配置
const DURATIONS = [
    { id: '1year', label: '1 年', multiplier: 0.3 },
    { id: '3years', label: '3 年', multiplier: 0.7 },
    { id: 'permanent', label: '永久', multiplier: 1.0 },
];

/**
 * AgreementModal (协议预览模态框) 子组件
 * @returns {JSX.Element | null}
 */
const AgreementModal = ({ isOpen, onClose, type, duration, price, asset }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <FileText className="text-primary" />
                        数字版权授权协议预览
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 text-zinc-600 dark:text-zinc-300 space-y-6 text-sm leading-relaxed font-medium">
                    {/* 协议主体信息 */}
                    <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <div>
                            <span className="text-xs text-zinc-400 uppercase tracking-wider">甲方 (授权方)</span>
                            <p className="font-bold text-zinc-900 dark:text-white text-base mt-1">{asset.author}</p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 uppercase tracking-wider">乙方 (被授权方)</span>
                            <p className="font-bold text-zinc-900 dark:text-white text-base mt-1">[当前用户]</p>
                        </div>
                    </div>
                    {/* 授权标的 */}
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            1. 授权标的
                        </h3>
                        <div className="pl-4 space-y-2">
                            <p>作品名称：<span className="text-zinc-900 dark:text-white font-semibold">{asset.title}</span></p>
                            <p>作品类型：<span className="text-zinc-900 dark:text-white font-semibold">{asset.type}</span></p>
                        </div>
                    </div>
                    {/* 授权范围 */}
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            2. 授权范围
                        </h3>
                        <div className="pl-4 space-y-2">
                            <p>授权类型：<span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-xs ml-1">{LICENSE_TYPES.find(t => t.id === type).label}</span></p>
                            <p>授权期限：<span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-xs ml-1">{DURATIONS.find(d => d.id === duration).label}</span></p>
                            <p>授权费用：<span className="font-mono font-bold">¥ {price.toLocaleString()}</span></p>
                        </div>
                    </div>
                    {/* 权利与义务 */}
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            3. 权利与义务
                        </h3>
                        <div className="pl-4 space-y-2 text-zinc-500 dark:text-zinc-400">
                            <p>3.1 甲方保证对授权作品拥有合法的著作权。</p>
                            <p>3.2 乙方应在授权范围内使用作品，不得超出授权范围。</p>
                            <p>3.3 商业授权允许乙方将作品用于商业推广、产品包装等用途。</p>
                        </div>
                    </div>
                    {/* 提示信息 */}
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 text-xs text-amber-600 dark:text-amber-400 flex gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        * 此为预览协议，正式协议将在支付成功后生成并上链存证，具有法律效力。
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-2xl">
                    <button onClick={onClose} className="px-6 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-sm">
                        关闭
                    </button>
                    <button className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2">
                        <Download size={18} />
                        下载草稿
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * LicensePage 页面主组件
 * @returns {JSX.Element}
 */
const LicensePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToastStore();

    // 授权选项的状态
    const [licenseType, setLicenseType] = useState('personal');
    const [duration, setDuration] = useState('permanent');
    const [price, setPrice] = useState(0);

    // UI状态
    const [isProcessing, setIsProcessing] = useState(false); // 是否正在处理支付
    const [showAgreement, setShowAgreement] = useState(false); // 是否显示协议预览模态框

    // 模拟基于ID加载资产数据
    const asset = MOCK_ASSET;

    // 使用 useEffect 根据授权类型和期限的变化，动态计算价格
    useEffect(() => {
        const typeMult = LICENSE_TYPES.find(t => t.id === licenseType).multiplier;
        const durMult = DURATIONS.find(d => d.id === duration).multiplier;
        setPrice(Math.round(asset.basePrice * typeMult * durMult));
    }, [licenseType, duration]); // 依赖项数组

    /**
     * 处理支付流程 (模拟)
     */
    const handlePayment = async () => {
        setIsProcessing(true);
        // 模拟API调用和网络延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        addToast('支付成功！授权证书已生成', 'success');
        // 支付成功后，延时1秒跳转到个人中心页面
        setTimeout(() => navigate('/account'), 1000);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
            <Navbar showSearch={false} showNotifications={true} showWallet={true} />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <button
                    onClick={() => navigate(-1)} // 返回上一页
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    返回详情
                </button>

                {/* 页面主布局，分为左侧预览区和右侧选项区 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* 左侧：作品预览 */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <div className={`aspect-square rounded-3xl shadow-2xl overflow-hidden ${asset.image} relative mb-6 ring-1 ring-black/5 dark:ring-white/10`}>
                                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-bold rotate-45 select-none">
                                    PREVIEW
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">作品信息</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 dark:text-zinc-400">作品名称</span>
                                        <span className="font-medium text-zinc-900 dark:text-white">{asset.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 dark:text-zinc-400">创作者</span>
                                        <span className="font-medium text-zinc-900 dark:text-white">{asset.author}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 dark:text-zinc-400">基础价格</span>
                                        <span className="font-medium text-zinc-900 dark:text-white">¥ {asset.basePrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右侧：授权选项 */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-800">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">获取授权</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-8">请选择适合您需求的授权类型和期限</p>

                            {/* 1. 授权类型选择 */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Shield size={20} className="text-primary" />
                                    1. 选择授权类型
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {LICENSE_TYPES.map((type) => (
                                        <div
                                            key={type.id}
                                            onClick={() => setLicenseType(type.id)}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${licenseType === type.id
                                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`font-bold ${licenseType === type.id ? 'text-primary' : 'text-zinc-900 dark:text-white'}`}>
                                                    {type.label}
                                                </span>
                                                {licenseType === type.id && <div className="bg-primary text-white p-1 rounded-full"><Check size={12} /></div>}
                                            </div>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{type.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. 授权期限选择 */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-primary" />
                                    2. 选择授权期限
                                </h3>
                                <div className="flex gap-4">
                                    {DURATIONS.map((dur) => (
                                        <button
                                            key={dur.id}
                                            onClick={() => setDuration(dur.id)}
                                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${duration === dur.id
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            {dur.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. 价格总结与支付 */}
                            <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">预估总价</p>
                                        <p className="text-3xl font-bold text-primary">¥ {price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right text-sm text-zinc-500 dark:text-zinc-400">
                                        <p>{LICENSE_TYPES.find(t => t.id === licenseType).label}</p>
                                        <p>{DURATIONS.find(d => d.id === duration).label}</p>
                                        <button
                                            onClick={() => setShowAgreement(true)}
                                            className="text-primary hover:underline mt-1 flex items-center justify-end gap-1"
                                        >
                                            <Eye size={12} />
                                            预览协议
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            处理中...
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={20} />
                                            立即生成授权书并支付
                                        </>
                                    )}
                                </button>

                                <p className="mt-4 text-xs text-center text-zinc-400 flex items-center justify-center gap-1">
                                    <AlertCircle size={12} />
                                    支付成功后，授权证书将自动存入您的账户并上链存证
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 协议预览模态框 */}
            <AgreementModal
                isOpen={showAgreement}
                onClose={() => setShowAgreement(false)}
                type={licenseType}
                duration={duration}
                price={price}
                asset={asset}
            />

            <Footer />
        </div>
    );
};

export default LicensePage;
