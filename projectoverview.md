# 项目概览

## 最近更改
- **前后端对接** (2024-12-07): 完成前端与后端API的对接
  - ✅ 创建API封装文件 `utils/api.js`，统一管理所有API调用
  - ✅ 修改首页使用真实API获取问题列表（支持下拉刷新、上滑加载更多）
  - ✅ 修改发现页使用真实API（轮播图、推荐、热门、收藏）
  - ✅ 添加问题ID数据绑定，支持点击跳转到问题详情页
  - 📝 详细指南: `docs/frontend_backend_integration.md`
- **后端实现** (2024-12-07): 完成Node.js后端开发
  - ✅ Express + Sequelize + SQLite3 技术栈
  - ✅ 13个数据模型，完整实现ORM映射和关联关系
  - ✅ 4个核心控制器：认证、问题、回答、发现/用户中心
  - ✅ JWT认证中间件和全局错误处理
  - ✅ RESTful API路由（40+个端点）
  - ✅ 数据库初始化脚本，包含测试数据
  - 📁 位置: `backend/` 目录
- **后端设计** (2024-12-07): 创建了完整的后端设计文档 `docs/backend_design.md`，包括：
  - 13个数据表设计（用户、问题、回答、评论、标签、关注、点赞、收藏、浏览历史、轮播图等）
  - 8个API模块约40个RESTful端点设计
  - API响应格式规范和错误码定义
  - 技术栈建议（Node.js/Python + MySQL）
  - 前后端对接说明
- **数据库脚本**: 创建 `docs/database_schema.sql`，包含完整建表语句和测试数据
- **移除页面**: 移除了"私信" (Chat) 和"通知" (Notify) 页面。
- **功能调整**: 在"发现"页面中移除了"圆桌"栏目；在"更多"页面中移除了"我的草稿"、"我的书架"、"我的 Live"和"我的值乎"。
- **布局调整**: 更新了底部导航栏 (TabBar)，现在仅保留"首页"、"发现"和"更多"三个选项。同时为剩余的 Tab 添加了中文标题（首页、发现、更多）。

## 项目结构
```
weapp-wechat-zhihu/
├── pages/                  # 页面目录
│   ├── index/              # 首页 - 信息流Feed
│   ├── discovery/          # 发现页 - 推荐/热门/收藏
│   ├── more/               # 更多页 - 用户中心
│   ├── answer/             # 回答详情页
│   └── question/           # 问题详情页
├── data/                   # 模拟数据
├── utils/                  # 工具函数
├── images/                 # 图片资源
├── backend/                # 后端目录 (新增)
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── models/         # Sequelize模型
│   │   ├── controllers/    # 控制器
│   │   ├── routes/         # 路由
│   │   ├── middlewares/    # 中间件
│   │   ├── utils/          # 工具函数
│   │   ├── scripts/        # 脚本（数据库初始化等）
│   │   └── app.js          # Express应用
│   ├── database/           # SQLite数据库文件
│   ├── .env                # 环境变量
│   ├── package.json
│   ├── server.js           # 入口文件
│   └── README.md
├── docs/                   # 文档目录
│   ├── backend_design.md   # 后端设计文档
│   └── database_schema.sql # 数据库建表脚本
├── app.js                  # 应用入口
├── app.json                # 应用配置
└── app.wxss                # 全局样式
```

