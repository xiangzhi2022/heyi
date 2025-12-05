/**
 * @file Registration.jsx
 * @description 版权登记页面，采用分步式表单引导用户完成作品信息的填写、文件上传和最终提交。
 * @author Gemini
 */

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Registration 页面组件
 * @returns {JSX.Element}
 */
const Registration = () => {
    // State to manage the current step of the form
    const [step, setStep] = useState(1);
    // State to store all form data
    const [formData, setFormData] = useState({
        title: '',
        type: '美术作品',
        date: '',
        file: null
    });
    // State to store validation errors
    const [errors, setErrors] = useState({});
    // State to handle the submission loading state
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Ref for the hidden file input element
    const fileInputRef = React.useRef(null);

    /**
     * Handles changes for all text-based input fields.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error message for the field being edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    /**
     * Validates the fields in Step 1.
     * @returns {boolean} - True if validation passes, false otherwise.
     */
    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = '请输入作品名称';
        if (!formData.date) newErrors.date = '请选择创作完成日期';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Validates the fields in Step 2.
     * @returns {boolean} - True if validation passes, false otherwise.
     */
    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.file) newErrors.file = '请上传作品文件';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handles navigation to the next step after validation.
     */
    const handleNext = () => {
        if (step === 1) {
            if (validateStep1()) setStep(2);
        } else if (step === 2) {
            if (validateStep2()) setStep(3);
        }
    };

    /**
     * Handles file selection and validation.
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Client-side file size validation
            if (file.size > 100 * 1024 * 1024) { // 100MB
                setErrors(prev => ({ ...prev, file: '文件大小不能超过 100MB' }));
                return;
            }
            setFormData(prev => ({ ...prev, file }));
            setErrors(prev => ({ ...prev, file: null })); // Clear file error on successful selection
        }
    };

    /**
     * Handles the final form submission.
     */
    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate an API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        alert('提交成功！(模拟)');
        // Here you would typically reset the form state or redirect the user
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Navbar showSearch={false} showNotifications={true} showWallet={true} />

            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">版权登记</h1>
                    <p className="text-gray-600 dark:text-gray-400">只需几步，即可为您的创意作品完成确权登记</p>
                </div>

                {/* 步骤进度指示器 */}
                <div className="flex items-center justify-center mb-12">
                    {/* Step 1 */}
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400 dark:text-gray-600'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-600'}`}>1</div>
                        <span className="font-medium">基本信息</span>
                    </div>
                    {/* Connector */}
                    <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`} />
                    {/* Step 2 */}
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400 dark:text-gray-600'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-600'}`}>2</div>
                        <span className="font-medium">上传作品</span>
                    </div>
                    {/* Connector */}
                    <div className={`w-16 h-0.5 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`} />
                    {/* Step 3 */}
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-gray-400 dark:text-gray-600'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 3 ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-600'}`}>3</div>
                        <span className="font-medium">确认提交</span>
                    </div>
                </div>

                {/* 表单内容区域 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">

                    {/* --- 步骤 1: 基本信息 --- */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">作品名称</label>
                                <input
                                    type="text" name="title" value={formData.title} onChange={handleInputChange}
                                    className={`w-full h-12 px-4 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                                    placeholder="请输入作品名称"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">作品类型</label>
                                <select
                                    name="type" value={formData.type} onChange={handleInputChange}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                >
                                    <option>美术作品</option> <option>摄影作品</option> <option>文字作品</option> <option>音乐作品</option> <option>视听作品</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">创作完成日期</label>
                                <input
                                    type="date" name="date" value={formData.date} onChange={handleInputChange}
                                    className={`w-full h-12 px-4 rounded-xl border ${errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                                />
                                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                            </div>
                            <div className="pt-4">
                                <button onClick={handleNext} className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all">
                                    下一步
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- 步骤 2: 上传作品 --- */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* 隐藏的文件输入框，通过 ref 引用 */}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".jpg,.png,.pdf,.mp4" />
                            {/* 自定义的文件上传触发区域 */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed ${errors.file ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'} rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer`}
                            >
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-full flex items-center justify-center mb-4">
                                    {formData.file ? <FileText size={32} /> : <Upload size={32} />}
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                                    {formData.file ? formData.file.name : '点击或拖拽上传文件'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                                    {formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : '支持 JPG, PNG, PDF, MP4 等格式，最大不超过 100MB'}
                                </p>
                            </div>
                            {errors.file && <p className="text-red-500 text-sm text-center">{errors.file}</p>}

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setStep(1)} className="flex-1 h-12 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                    上一步
                                </button>
                                <button onClick={handleNext} className="flex-1 h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all">
                                    下一步
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- 步骤 3: 确认提交 --- */}
                    {step === 3 && (
                        <div className="space-y-6 text-center py-8">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">准备提交</h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                请确认您填写的信息真实有效。提交后，我们将对您的作品进行区块链存证，并生成唯一的数字版权证书。
                            </p>

                            {/* 信息确认摘要 */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-left max-w-md mx-auto space-y-2 text-sm">
                                <p><span className="text-gray-500 dark:text-gray-400">作品名称：</span><span className="font-medium text-gray-900 dark:text-white">{formData.title}</span></p>
                                <p><span className="text-gray-500 dark:text-gray-400">作品类型：</span><span className="font-medium text-gray-900 dark:text-white">{formData.type}</span></p>
                                <p><span className="text-gray-500 dark:text-gray-400">创作日期：</span><span className="font-medium text-gray-900 dark:text-white">{formData.date}</span></p>
                                <p><span className="text-gray-500 dark:text-gray-400">文件名称：</span><span className="font-medium text-gray-900 dark:text-white">{formData.file?.name}</span></p>
                            </div>

                            {/* 法律条款提示 */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-4 text-left flex gap-3 max-w-md mx-auto">
                                <AlertCircle className="text-yellow-600 dark:text-yellow-400 shrink-0" size={20} />
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    提交即代表您同意我们的《版权登记服务协议》及《隐私政策》。
                                </p>
                            </div>

                            <div className="flex gap-4 pt-8 max-w-md mx-auto">
                                <button onClick={() => setStep(2)} disabled={isSubmitting} className="flex-1 h-12 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50">
                                    返回修改
                                </button>
                                <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isSubmitting ? '提交中...' : '确认提交'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Registration;
