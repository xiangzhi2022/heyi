# 🎨 H1R Hub - 和一版权服务平台

<div align="center">

**一个现代化的数字版权注册与交易平台**

[![GitHub](https://img.shields.io/badge/GitHub-xiangzhi2022%2Fheyi-blue)](https://github.com/xiangzhi2022/heyi)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7+-646cff.svg)](https://vitejs.dev/)

</div>

---

## 📖 项目简介

H1R Hub（Harmony One Rights Hub）是一个专为中国市场设计的数字版权注册与交易平台。平台提供版权注册、作品展示、授权交易等核心功能，帮助创作者保护和管理自己的知识产权。

### ✨ 核心功能

- 🎨 **品牌故事** - 了解平台使命与愿景
- 📝 **版权注册** - 快速注册各类数字作品版权
- 🎭 **创作者权利中心** - 全面的版权管理工具
- 🛍️ **版权交易市场** - 浏览和交易版权作品
- 📊 **作品排行榜** - 发现热门和优质内容
- ⚙️ **用户中心** - 个人资料、设置与通知管理

### 🎯 技术特性

- ⚡ **现代化技术栈**: React 18 + Vite 7 + Zustand
- 🎨 **优雅的设计**: 响应式设计，支持深色/浅色主题
- 🔄 **状态管理**: 使用 Zustand 进行高效状态管理
- 🎭 **丰富的动画**: 流畅的过渡和交互效果
- 📱 **响应式布局**: 完美适配各种设备尺寸
- 🚀 **性能优化**: 代码分割、懒加载、Gzip 压缩

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/xiangzhi2022/heyi.git
cd heyi

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

访问 `http://localhost:5173` 查看项目。

---

## 📦 部署到 Linux 服务器

### 方式 1: 一键部署脚本（推荐）

```bash
# 在 Linux 服务器上运行
wget https://raw.githubusercontent.com/xiangzhi2022/heyi/main/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

### 方式 2: Docker 部署

```bash
# 克隆项目
git clone https://github.com/xiangzhi2022/heyi.git
cd heyi

# 使用 Docker Compose
docker-compose up -d
```

### 方式 3: 手动部署

详细步骤请查看：
- 📘 [快速部署指南](QUICK_DEPLOY.md)
- 📗 [详细部署文档](DEPLOYMENT_GUIDE.md)

---

## 📂 项目结构

```
heyi/
├── src/
│   ├── components/      # React 组件
│   ├── pages/          # 页面组件
│   ├── stores/         # Zustand 状态管理
│   ├── contexts/       # React Context
│   ├── services/       # API 服务
│   ├── App.jsx         # 主应用组件
│   └── main.jsx        # 应用入口
├── public/             # 静态资源
├── docs/              # 项目文档
├── dist/              # 构建产物（构建后生成）
├── deploy.sh          # 一键部署脚本
├── update.sh          # 快速更新脚本
├── Dockerfile         # Docker 镜像配置
└── docker-compose.yml # Docker Compose 配置
```

---

## 🛠️ 技术栈

### 前端框架
- **React 18** - UI 框架
- **Vite 7** - 构建工具
- **React Router** - 路由管理

### 状态管理
- **Zustand** - 轻量级状态管理
- **React Context** - 全局上下文

### 样式
- **CSS3** - 现代 CSS 特性
- **CSS Variables** - 主题系统
- **Flexbox/Grid** - 布局系统

### 图标
- **Lucide React** - 现代图标库

---

## 📄 文档

- [快速部署指南](QUICK_DEPLOY.md) - 三种部署方式快速入门
- [详细部署文档](DEPLOYMENT_GUIDE.md) - 完整的部署步骤和配置
- [网站结构说明](WEBSITE_STRUCTURE.md) - 项目架构说明
- [导航设计文档](docs/NAVIGATION_DESIGN.md) - 导航系统设计
- [状态管理设计](docs/STATE_MANAGEMENT_DESIGN.md) - 状态管理架构

---

## 🔄 更新部署

### 使用 Git
```bash
cd /var/www/heyi
sudo git pull
sudo npm install
sudo npm run build
sudo systemctl reload nginx
```

### 使用更新脚本
```bash
sudo ./update.sh
```

---

## 🎨 主题系统

项目支持深色/浅色主题切换，主题配置位于 `src/stores/useThemeStore.js`。

```javascript
// 在组件中使用主题
import { useThemeStore } from '@/stores';

function Component() {
  const { theme, toggleTheme } = useThemeStore();
  // ...
}
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📝 License

[MIT License](LICENSE)

---

## 👨‍💻 作者

**xiangzhi2022**

- GitHub: [@xiangzhi2022](https://github.com/xiangzhi2022)
- Email: xiangzhi4363@gmail.com

---

## 🙏 致谢

感谢所有开源项目的贡献者！

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️**

Made with ❤️ by xiangzhi2022

</div>
