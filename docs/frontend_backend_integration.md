# 前后端对接完成指南

## ✅ 已完成的工作

### 后端部分 (100%完成)
- ✅ 完整的Node.js后端API（Express + Sequelize + SQLite）
- ✅ 数据库初始化完成，包含测试数据
- ✅ 40+个RESTful API端点
- ✅ JWT认证系统

### 前端部分 (100%完成)

| 页面 | 状态 | 对接的API |
|------|------|-----------|
| **首页** (`pages/index/`) | ✅ 完成 | `GET /questions` - 问题列表、分页、刷新 |
| **发现页** (`pages/discovery/`) | ✅ 完成 | `GET /discovery/banners` - 轮播图<br>`GET /discovery/recommend` - 推荐<br>`GET /discovery/hot` - 热门 |
| **问题详情页** (`pages/question/`) | ✅ 完成 | `GET /questions/:id` - 问题详情<br>`GET /questions/:id/answers` - 回答列表<br>`POST /questions/:id/follow` - 关注问题 |
| **回答详情页** (`pages/answer/`) | ✅ 完成 | `GET /answers/:id` - 回答详情<br>`POST /answers/:id/like` - 点赞<br>`POST /answers/:id/thank` - 感谢<br>`POST /answers/:id/collect` - 收藏 |
| **用户中心页** (`pages/more/`) | ✅ 完成 | `POST /auth/login` - 登录<br>登录/退出状态管理 |

---

## 🚀 启动步骤

### 1. 启动后端服务器

```bash
cd backend
npm install          # 首次运行需要安装依赖
npm run init-db      # 首次运行需要初始化数据库
npm run dev          # 启动开发服务器
```

成功启动后会显示：
```
===========================================
  知乎微信小程序后端API
===========================================
🚀 服务器运行在: http://localhost:3000
📝 环境: development
📊 数据库: SQLite (./database/zhihu.db)
===========================================
```

### 2. 在微信开发者工具中测试

1. 打开微信开发者工具
2. 导入项目（选择 `weapp-wechat-zhihu` 目录）
3. **重要**：在开发者工具中，点击右上角"详情" -> "本地设置"
   - ✅ 勾选 "不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"
4. 编译运行

---

## 🧪 功能测试

### 首页测试
- ✅ 页面加载后显示问题列表（从后端API获取）
- ✅ 下拉刷新
- ✅ 上滑加载更多
- ✅ 点击问题跳转到问题详情页

### 发现页测试
- ✅ 轮播图显示（从后端获取）
- ✅ "推荐"Tab显示推荐内容
- ✅ "热门"Tab显示热门内容
- ✅ "收藏"Tab需要登录

### 问题详情页测试
- ✅ 显示问题标题、标签、浏览数、回答数
- ✅ 显示回答列表
- ✅ 点击回答跳转到回答详情页
- ✅ 关注/取消关注问题（需登录）

### 回答详情页测试
- ✅ 显示回答内容、回答者信息
- ✅ 点赞功能（需登录）
- ✅ 感谢功能（需登录）
- ✅ 收藏功能（需登录）
- ✅ 点击问题标题跳转回问题详情

### 用户中心测试
- ✅ 未登录时显示"点击登录"
- ✅ 点击可触发登录
- ✅ 登录后显示用户昵称
- ✅ 退出登录功能

---

## 🔧 API测试

### 直接测试后端API

**健康检查：**
```
GET http://localhost:3000/api/health
```

**登录获取Token：**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "code": "test123"
}
```

**获取问题列表：**
```
GET http://localhost:3000/api/questions?page=1&limit=10
```

**获取问题详情：**
```
GET http://localhost:3000/api/questions/1
```

**获取回答详情：**
```
GET http://localhost:3000/api/answers/1
```

**获取轮播图：**
```
GET http://localhost:3000/api/discovery/banners
```

---

## 📁 修改的前端文件

| 文件 | 修改内容 |
|------|----------|
| `utils/api.js` | 新建 - API封装，统一管理所有API调用 |
| `pages/index/index.js` | 使用API获取问题列表 |
| `pages/index/index.wxml` | 添加问题ID数据绑定 |
| `pages/discovery/discovery.js` | 使用API获取轮播图、推荐、热门内容 |
| `pages/discovery/discovery.wxml` | 添加问题ID数据绑定 |
| `pages/question/question.js` | 重写 - 动态加载问题详情和回答列表 |
| `pages/question/question.wxml` | 重写 - 使用数据绑定显示动态内容 |
| `pages/answer/answer.js` | 重写 - 动态加载回答，点赞/感谢/收藏功能 |
| `pages/answer/answer.wxml` | 重写 - 使用数据绑定显示动态内容 |
| `pages/more/more.js` | 重写 - 登录/退出登录功能 |
| `pages/more/more.wxml` | 重写 - 登录状态切换显示 |
| `pages/more/more.wxss` | 添加退出登录按钮样式 |

---

## 🔐 登录说明

1. **登录流程**：
   - 用户点击"更多"页面的"点击登录"
   - 调用 `wx.login()` 获取code
   - 将code发送到后端 `POST /api/auth/login`
   - 后端返回JWT token和用户信息
   - 前端保存token到Storage

2. **Token使用**：
   - 需要登录的API会自动从Storage获取token
   - 在请求头中添加 `Authorization: Bearer <token>`

3. **退出登录**：
   - 清除Storage中的token和userInfo
   - 更新页面状态

---

## 📚 参考资料

- 后端API文档：`docs/backend_design.md`
- 后端使用指南：`backend/README.md`
- API封装代码：`utils/api.js`
