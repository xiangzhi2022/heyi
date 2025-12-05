/**
 * @file App.jsx
 * @description 应用的根组件，负责设置全局上下文、路由和整体布局。
 * @author Gemini
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 导入全局上下文提供者





// 导入全局组件
import GlobalSidebar from './components/GlobalSidebar';
import LoadingSpinner from './components/LoadingSpinner';
import ToastContainer from './components/ToastContainer';

// 使用 React.lazy 进行页面的代码分割和懒加载
// 这有助于优化应用的初始加载时间，只有当用户访问相应路由时，对应的页面组件代码才会被下载和执行
const Home = lazy(() => import('./pages/Home'));
const BrandStory = lazy(() => import('./pages/BrandStory'));
const RightsCenter = lazy(() => import('./pages/RightsCenter'));
const Registration = lazy(() => import('./pages/Registration'));
const AssetDetails = lazy(() => import('./pages/AssetDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const LicensePage = lazy(() => import('./pages/LicensePage'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ManageAsset = lazy(() => import('./pages/ManageAsset'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Settings = lazy(() => import('./pages/Settings'));
const RankingPage = lazy(() => import('./pages/RankingPage'));

/**
 * App 组件
 * @returns {JSX.Element}
 * 这是整个应用的根组件。
 * 1.  使用多个 Context Provider (ThemeProvider, ToastProvider, etc.) 为整个应用提供全局状态管理。
 * 2.  设置 React Router (BrowserRouter) 来处理客户端路由。
 * 3.  定义应用的整体布局，包括一个固定的全局侧边栏 (GlobalSidebar) 和主内容区。
 * 4.  使用 Suspense 和 lazy 实现路由级别的代码分割，并为加载中的页面提供一个全局的 LoadingSpinner。
 */
function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <GlobalSidebar />
        <div className="flex-1 w-full lg:ml-20 lg:w-[calc(100%-5rem)]">
          <Suspense fallback={<div className="flex items-center justify-center w-full h-full"><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/brand-story" element={<BrandStory />} />
              <Route path="/rights-center" element={<RightsCenter />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/assets/:id" element={<AssetDetails />} />
              <Route path="/manage-asset/:id" element={<ManageAsset />} />
              <Route path="/account" element={<Profile />} />
              <Route path="/license/:id" element={<LicensePage />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ranking" element={<RankingPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
