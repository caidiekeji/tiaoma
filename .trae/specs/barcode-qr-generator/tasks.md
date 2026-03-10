# Tasks

## 项目初始化
- [x] Task 1: 初始化Next.js项目
  - [x] SubTask 1.1: 使用create-next-app创建项目，配置TypeScript和Tailwind CSS
  - [x] SubTask 1.2: 配置ESLint和Prettier
  - [x] SubTask 1.3: 创建项目目录结构（components、lib、styles等）

## 核心功能开发
- [x] Task 2: 安装和配置条码/二维码生成库
  - [x] SubTask 2.1: 安装jsbarcode库用于条码生成
  - [x] SubTask 2.2: 安装qrcode库用于二维码生成
  - [x] SubTask 2.3: 创建条码生成工具函数
  - [x] SubTask 2.4: 创建二维码生成工具函数

- [x] Task 3: 开发条码生成卡片组件
  - [x] SubTask 3.1: 创建BarcodeCard组件基础结构
  - [x] SubTask 3.2: 实现条码格式选择器（Code128、EAN13、UPC等）
  - [x] SubTask 3.3: 实现输入验证逻辑
  - [x] SubTask 3.4: 实现实时预览功能
  - [x] SubTask 3.5: 实现下载功能（PNG和SVG）

- [x] Task 4: 开发二维码生成卡片组件
  - [x] SubTask 4.1: 创建QRCard组件基础结构
  - [x] SubTask 4.2: 实现二维码内容输入框
  - [x] SubTask 4.3: 实现自定义选项（颜色、尺寸、纠错级别）
  - [x] SubTask 4.4: 实现实时预览功能
  - [x] SubTask 4.5: 实现下载功能（PNG和SVG）

## UI/UX开发
- [x] Task 5: 开发布局和样式
  - [x] SubTask 5.1: 创建响应式卡片网格布局
  - [x] SubTask 5.2: 设计并实现卡片样式（阴影、圆角、动画）
  - [x] SubTask 5.3: 创建页面头部和导航
  - [x] SubTask 5.4: 实现深色/浅色主题切换

- [x] Task 6: 优化用户体验
  - [x] SubTask 6.1: 添加加载状态指示器
  - [x] SubTask 6.2: 实现错误提示和验证反馈
  - [x] SubTask 6.3: 添加复制到剪贴板功能
  - [x] SubTask 6.4: 优化移动端交互体验

## 部署配置
- [x] Task 7: 配置Vercel部署
  - [x] SubTask 7.1: 创建vercel.json配置文件
  - [x] SubTask 7.2: 配置环境变量
  - [x] SubTask 7.3: 优化构建配置

- [x] Task 8: 配置Cloudflare Pages部署
  - [x] SubTask 8.1: 创建wrangler.toml配置文件
  - [x] SubTask 8.2: 配置Cloudflare Pages特定设置
  - [x] SubTask 8.3: 测试Cloudflare部署兼容性

## 测试和优化
- [x] Task 9: 测试和优化
  - [x] SubTask 9.1: 编写组件单元测试
  - [x] SubTask 9.2: 进行跨浏览器兼容性测试
  - [x] SubTask 9.3: 性能优化（图片加载、代码分割）
  - [x] SubTask 9.4: SEO优化（meta标签、sitemap）

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 3, Task 4, Task 5]
- [Task 7] depends on [Task 3, Task 4, Task 5, Task 6]
- [Task 8] depends on [Task 3, Task 4, Task 5, Task 6]
- [Task 9] depends on [Task 3, Task 4, Task 5, Task 6]
