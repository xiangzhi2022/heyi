/**
 * @file HelpCenter.jsx
 * @description 帮助中心页面，提供常见问题解答、文档分类和联系方式。
 * @author Gemini
 */

import React, { useState } from 'react';
import { Search, Book, MessageCircle, Shield, FileText, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 模拟的常见问题数据
const FAQS = [
    {
        question: "如何购买版权作品？",
        answer: "您可以通过浏览市场找到心仪的作品，点击进入详情页。我们支持多种交易模式：一口价直接购买、参与拍卖竞价、或者购买特定的使用授权。支付支持多种主流数字货币和法币渠道。"
    },
    {
        question: "什么是'全版权转让'？",
        answer: "全版权转让意味着创作者将作品的所有财产权（如复制权、发行权、改编权等）永久转让给买家。交易完成后，买家将成为该作品新的版权所有者，而创作者仅保留署名权等通过人身权。"
    },
    {
        question: "如何发布我的作品？",
        answer: "在'创作'菜单下选择'版权登记'，上传您的作品文件，填写详细的元数据（标题、描述、属性等），并设置您的销售模式（一口价、拍卖、租赁或授权）。提交后，作品将被铸造上链并发布到市场。"
    },
    {
        question: "平台收取多少手续费？",
        answer: "我们在初次销售时收取 2.5% 的服务费。对于二级市场交易，除了平台服务费外，您还可以为您的作品设置 0-10% 的创作者版税，每次转手您都能获得收益。"
    },
    {
        question: "如何保护我的账户安全？",
        answer: "我们建议您开启双重认证（2FA），不要向任何人透露您的私钥或助记词。平台工作人员永远不会主动要求您提供密码或私钥。"
    }
];

// 帮助分类
const CATEGORIES = [
    { icon: Book, title: "新手指南", desc: "了解平台基础功能和操作流程" },
    { icon: Shield, title: "版权保护", desc: "关于版权登记、确权和维权的说明" },
    { icon: FileText, title: "交易规则", desc: "购买、出售、拍卖和授权的详细规则" },
    { icon: MessageCircle, title: "社区规范", desc: "平台社区行为准则和违规处理" },
];

const HelpCenter = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
            <Navbar showSearch={true} showNotifications={false} showWallet={false} />

            {/* Hero Section */}
            <div className="bg-primary/5 dark:bg-primary/10 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        我们能为您提供什么帮助？
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        搜索问题、浏览指南或联系我们的支持团队
                    </p>

                    {/* 搜索框 */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="搜索问题、关键词..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg shadow-primary/10 outline-none transition-all text-lg"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
                {/* 分类卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {CATEGORIES.map((cat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                <cat.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{cat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* 常见问题 */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">常见问题</h2>
                    <div className="space-y-4">
                        {FAQS.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">{faq.question}</span>
                                    {openIndex === index ? (
                                        <ChevronUp className="text-primary" />
                                    ) : (
                                        <ChevronDown className="text-gray-400" />
                                    )}
                                </button>
                                <div
                                    className={`px-6 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 联系支持 */}
                <div className="mt-20 bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">还需要帮助？</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            如果您没有找到想要的答案，请随时联系我们的全天候支持团队。
                        </p>
                        <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                            <Mail size={20} />
                            联系客服
                        </button>
                    </div>
                    {/* 装饰背景 */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full bg-white blur-3xl"></div>
                        <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-900 blur-3xl"></div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HelpCenter;
