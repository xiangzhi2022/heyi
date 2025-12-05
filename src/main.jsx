/**
 * @file main.jsx
 * @description 应用的入口文件，负责初始化React应用并将其挂载到DOM中。
 * @author Gemini
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// 导入全局样式
import './index.css';
// 导入根组件
import App from './App.jsx';

// 使用 createRoot API (React 18+) 来创建一个React根。
// document.getElementById('root') 选中了 public/index.html 文件中 ID 为 'root' 的 div 元素。
// 这是整个React应用的挂载点。
createRoot(document.getElementById('root')).render(
  // StrictMode 是一个用于突出显示应用中潜在问题的工具。
  // 它不会渲染任何可见的 UI，但会为其后代元素触发额外的检查和警告。
  // 这有助于在开发过程中识别不安全的生命周期、遗留的API使用等问题。
  <StrictMode>
    <App />
  </StrictMode>,
);
