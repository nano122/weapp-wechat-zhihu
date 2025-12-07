# 🚀 后端快速启动指南

## 📋 前置要求

- Node.js >= 14.0.0
- npm >= 6.0.0

## 🔧 安装步骤

### 1. 进入后端目录
```bash
cd backend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 初始化数据库
```bash
npm run init-db
```

你将看到类似输出：
```
开始初始化数据库...
✓ 数据库连接成功
✓ 数据库表创建成功
✓ 插入测试用户成功
✓ 插入测试标签成功
✓ 插入测试问题成功
✓ 关联问题和标签成功
✓ 插入测试回答成功
✓ 插入测试轮播图成功

===========================================
✅ 数据库初始化完成！
===========================================
📊 用户: 3 个
🏷️  标签: 10 个
❓ 问题: 3 个
💬 回答: 3 个
===========================================
```

### 4. 启动开发服务器
```bash
npm run dev
```

你将看到：
```
===========================================
  知乎微信小程序后端API
===========================================
🚀 服务器运行在: http://localhost:3000
📝 环境: development
📊 数据库: SQLite (./database/zhihu.db)
===========================================
```

## ✅ 测试API

### 健康检查
```bash
GET http://localhost:3000/api/health
```

### 登录（获取Token）
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "code": "test123"
}
```

响应：
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nickname": "用户xxx",
      "avatar_url": "/images/default_avatar.png",
      "bio": ""
    }
  }
}
```

### 获取问题列表
```bash
GET http://localhost:3000/api/questions?page=1&limit=10
```

### 获取问题详情
```bash
GET http://localhost:3000/api/questions/1
```

### 获取轮播图
```bash
GET http://localhost:3000/api/discovery/banners
```

## 📚 API文档

详细API文档请查看：`docs/backend_design.md`

### 主要端点概览

| 模块 | 端点示例 | 说明 |
|------|---------|------|
| **认证** | `POST /api/auth/login` | 微信登录 |
| **问题** | `GET /api/questions` | 获取问题列表 |
| | `GET /api/questions/:id` | 获取问题详情 |
| | `POST /api/questions` | 创建问题 🔒 |
| | `POST /api/questions/:id/follow` | 关注问题 🔒 |
| **回答** | `GET /api/questions/:qid/answers` | 获取回答列表 |
| | `GET /api/answers/:id` | 获取回答详情 |
| | `POST /api/questions/:qid/answers` | 创建回答 🔒 |
| | `POST /api/answers/:id/like` | 点赞回答 🔒 |
| | `POST /api/answers/:id/thank` | 感谢回答 🔒 |
| | `POST /api/answers/:id/collect` | 收藏回答 🔒 |
| **发现** | `GET /api/discovery/banners` | 获取轮播图 |
| | `GET /api/discovery/recommend` | 获取推荐内容 |
| | `GET /api/discovery/hot` | 获取热门内容 |
| **用户中心** | `GET /api/me/following/questions` | 我关注的问题 🔒 |
| | `GET /api/me/collections` | 我的收藏 🔒 |
| | `GET /api/me/history` | 浏览历史 🔒 |

🔒 = 需要登录（需要在Header中添加 `Authorization: Bearer <token>`）

## 🔐 认证说明

需要登录的API需要在请求头中添加：
```
Authorization: Bearer <你的token>
```

示例：
```bash
POST http://localhost:3000/api/questions/1/follow
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📁 项目结构

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # 数据库配置
│   ├── models/                  # Sequelize模型
│   │   ├── index.js             # 模型汇总和关联
│   │   ├── User.js              # 用户模型
│   │   ├── Question.js          # 问题模型
│   │   ├── Answer.js            # 回答模型
│   │   ├── Tag.js               # 标签模型
│   │   ├── Comment.js           # 评论模型
│   │   ├── Banner.js            # 轮播图模型
│   │   ├── QuestionTag.js       # 问题-标签关联
│   │   └── Relations.js         # 其他关联表
│   ├── controllers/             # 控制器
│   │   ├── authController.js    # 认证控制器
│   │   ├── questionController.js # 问题控制器
│   │   ├── answerController.js  # 回答控制器
│   │   └── discoveryController.js # 发现/用户中心控制器
│   ├── routes/                  # 路由
│   │   ├── index.js             # 路由汇总
│   │   ├── auth.js              # 认证路由
│   │   ├── questions.js         # 问题路由
│   │   ├── answers.js           # 回答路由
│   │   └── discovery.js         # 发现路由
│   ├── middlewares/             # 中间件
│   │   ├── auth.js              # JWT认证中间件
│   │   └── errorHandler.js      # 错误处理中间件
│   ├── utils/                   # 工具函数
│   │   └── response.js          # 统一响应格式
│   ├── scripts/                 # 脚本
│   │   └── initDatabase.js      # 数据库初始化脚本
│   └── app.js                   # Express应用
├── database/
│   └── zhihu.db                 # SQLite数据库文件（运行后生成）
├── .env                         # 环境变量
├── .gitignore
├── package.json
├── server.js                    # 服务器入口
└── README.md
```

## 🛠️ 开发命令

```bash
# 生产环境启动
npm start

# 开发环境启动（自动重启）
npm run dev

# 重新初始化数据库（会清空现有数据！）
npm run init-db
```

## ⚠️ 注意事项

1. **首次运行必须先执行** `npm run init-db` 初始化数据库
2. `.env` 文件中的 `JWT_SECRET` 在生产环境务必修改
3. 数据库文件位于 `database/zhihu.db`，可以用SQLite工具查看
4. 测试数据包含3个用户、3个问题、3个回答

## 🔄 下一步：对接前端

修改微信小程序前端的 `utils/util.js`：

```javascript
// 修改API基础地址
const BASE_URL = 'http://localhost:3000/api';

function getData(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.code === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data);
        }
      },
      fail: reject
    });
  });
}
```

## 📞 技术支持

如有问题，请查看：
- API设计文档：`../docs/backend_design.md`
- 数据库结构：`../docs/database_schema.sql`
