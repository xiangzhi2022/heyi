/**
 * @file CreateCopyrightModal.jsx
 * @description 用于创建新的数字版权的模态框（弹出窗口）组件。
 * @author Gemini
 */

import React from 'react';
import { X, UploadCloud } from 'lucide-react';

/**
 * CreateCopyrightModal 组件
 * @param {object} props - 组件的属性
 * @param {boolean} props.isOpen - 控制模态框是否显示
 * @param {Function} props.onClose - 关闭模态框的回调函数
 * @returns {JSX.Element | null}
 */
const CreateCopyrightModal = ({ isOpen, onClose }) => {
    // 如果 isOpen 为 false，则不渲染任何内容
    if (!isOpen) return null;

    return (
        // 模态框的根元素，覆盖整个屏幕并提供背景模糊效果
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            {/* 模态框的主体内容 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                {/* 模态框头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">创建新的数字版权</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* 模态框内容区域 */}
                <div className="p-8">
                    {/* 文件上传区域 */}
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                        <UploadCloud size={48} className="mb-4 text-primary" />
                        <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">上传您的作品</h3>
                        <p className="text-lg text-center max-w-md">
                            支持图片、音频、视频等多种文件格式。
                        </p>
                        <button className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg">
                            选择文件
                        </button>
                    </div>

                    {/* 版权信息表单区域 */}
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">作品名称</label>
                            <input type="text" placeholder="例如：夏日海滩" className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">作品描述</label>
                            <textarea placeholder="详细描述您的作品信息" rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
                        </div>
                    </div>
                </div>

                {/* 模态框底部操作按钮 */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        取消
                    </button>
                    <button type="submit" className="px-8 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2">
                        确认创建
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCopyrightModal;
