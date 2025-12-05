/**
 * @file BrandStory.jsx
 * @description 展示品牌故事、发展历程和团队信息的静态页面。
 * @author Gemini
 */

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * BrandStory 页面组件
 * @returns {JSX.Element}
 */
const BrandStory = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">

            {/* 英雄区域 (Hero Section) */}
            <div className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 -z-10" />
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
                        重塑数字版权的未来
                    </h1>
                    <p className="text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                        "让每一个创意都得到尊重，让每一份价值都自由流动。"
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* 品牌介绍和核心价值 */}
                <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 mb-16">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Harmony One Rights Service（和一版权服务）诞生于数字经济蓬勃发展的时代。我们深知，在数字化浪潮中，创作者面临着版权确权难、维权成本高、变现渠道窄等诸多挑战。
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        作为新一代数字版权服务平台，我们致力于利用区块链技术，为全球创作者提供安全、透明、高效的版权解决方案。通过不可篡改的链上存证，我们为每一个作品赋予唯一的数字身份；通过智能合约，我们实现了版权交易的自动化与透明化。
                    </p>

                    {/* 核心价值展示 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform">
                            <div className="text-4xl font-bold text-primary mb-2">安全</div>
                            <p className="text-gray-500">区块链技术保障</p>
                        </div>
                        <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform">
                            <div className="text-4xl font-bold text-primary mb-2">高效</div>
                            <p className="text-gray-500">秒级确权登记</p>
                        </div>
                        <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform">
                            <div className="text-4xl font-bold text-primary mb-2">透明</div>
                            <p className="text-gray-500">全流程可追溯</p>
                        </div>
                    </div>
                </div>

                {/* 发展历程时间线 */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">发展历程</h2>
                {/* 时间线的垂直线通过 before伪元素实现 */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                    {[
                        { year: '2023 Q4', title: '项目启动', desc: 'Harmony One Rights 概念诞生，核心团队组建完成。' },
                        { year: '2024 Q1', title: '技术验证', desc: '完成基于 Harmony 链的版权存证原型开发。' },
                        { year: '2024 Q2', title: '平台上线', desc: 'Beta 版本发布，首批 100 位创作者入驻。' },
                        { year: '2024 Q4', title: '生态扩张', desc: '即将开启全球合作伙伴计划，拓展更多应用场景。' },
                    ].map((item, idx) => (
                        // 时间线上的一个事件节点
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* 时间线中间的圆点 */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-300 group-[.is-active]:bg-primary text-gray-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                            {/* 事件内容卡片 */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                                    <time className="font-mono text-xs text-primary">{item.year}</time>
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 核心团队介绍 */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-20 mb-12 text-center">核心团队</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {[
                        { name: 'Alex Chen', role: 'Founder & CEO', bio: '前知名互联网大厂高管，区块链连续创业者。' },
                        { name: 'Sarah Zhang', role: 'CTO', bio: '密码学博士，拥有多项区块链技术专利。' },
                        { name: 'David Li', role: 'Design Director', bio: '曾获红点设计大奖，专注于 Web3 用户体验。' },
                    ].map((member, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl transition-shadow">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                            <p className="text-primary font-medium mb-2">{member.role}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BrandStory;
