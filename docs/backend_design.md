# 知乎微信小程序后端设计文档

## 一、项目概述

本文档为 `weapp-wechat-zhihu` 微信小程序设计后端API和数据库架构，以满足前端所有功能需求。

### 1.1 前端功能分析

| 页面 | 主要功能 |
|------|---------|
| **首页 (index)** | 信息流展示、搜索、下拉刷新、上滑加载、点赞、评论、关注问题 |
| **发现 (discovery)** | 推荐/热门/收藏Tab、轮播图、信息流展示 |
| **更多 (more)** | 用户中心、我的关注、我的收藏、最近浏览 |
| **回答详情 (answer)** | 回答内容、回答者信息、点赞/感谢/收藏/评论 |
| **问题详情 (question)** | 问题信息、标签、邀请回答、写回答、回答列表 |

---

## 二、数据库设计

### 2.1 ER图概述

```
用户(User) ─┬─< 问题(Question) ─┬─< 回答(Answer) ─┬─< 评论(Comment)
            │                   │                │
            ├─< 关注用户        ├─< 关注问题      ├─< 点赞回答
            │                   │                │
            ├─< 收藏回答        └─< 问题标签关联   └─< 感谢回答
            │
            └─< 浏览历史
```

### 2.2 数据表设计

#### 2.2.1 用户表 (users)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 用户ID |
| openid | VARCHAR(64) | UNIQUE, NOT NULL | 微信OpenID |
| nickname | VARCHAR(50) | NOT NULL | 昵称 |
| avatar_url | VARCHAR(255) | | 头像URL |
| bio | VARCHAR(200) | | 个人简介 |
| gender | TINYINT | DEFAULT 0 | 性别: 0未知 1男 2女 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME | | 更新时间 |

#### 2.2.2 问题表 (questions)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 问题ID |
| user_id | INT | FOREIGN KEY -> users.id | 提问者ID |
| title | VARCHAR(200) | NOT NULL | 问题标题 |
| content | TEXT | | 问题描述 |
| view_count | INT | DEFAULT 0 | 浏览数 |
| answer_count | INT | DEFAULT 0 | 回答数 |
| follow_count | INT | DEFAULT 0 | 关注数 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME | | 更新时间 |

#### 2.2.3 回答表 (answers)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 回答ID |
| question_id | INT | FOREIGN KEY -> questions.id | 所属问题ID |
| user_id | INT | FOREIGN KEY -> users.id | 回答者ID |
| content | TEXT | NOT NULL | 回答内容 |
| like_count | INT | DEFAULT 0 | 点赞数 |
| thank_count | INT | DEFAULT 0 | 感谢数 |
| comment_count | INT | DEFAULT 0 | 评论数 |
| collect_count | INT | DEFAULT 0 | 收藏数 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME | | 更新时间 |

#### 2.2.4 评论表 (comments)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 评论ID |
| answer_id | INT | FOREIGN KEY -> answers.id | 所属回答ID |
| user_id | INT | FOREIGN KEY -> users.id | 评论者ID |
| content | VARCHAR(500) | NOT NULL | 评论内容 |
| parent_id | INT | FOREIGN KEY -> comments.id | 父评论ID(回复) |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |

#### 2.2.5 标签表 (tags)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 标签ID |
| name | VARCHAR(30) | UNIQUE, NOT NULL | 标签名称 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |

#### 2.2.6 问题-标签关联表 (question_tags)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| question_id | INT | FOREIGN KEY -> questions.id | 问题ID |
| tag_id | INT | FOREIGN KEY -> tags.id | 标签ID |

#### 2.2.7 用户关注用户表 (user_follows)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| follower_id | INT | FOREIGN KEY -> users.id | 关注者ID |
| following_id | INT | FOREIGN KEY -> users.id | 被关注者ID |
| created_at | DATETIME | DEFAULT NOW() | 关注时间 |

#### 2.2.8 用户关注问题表 (question_follows)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| user_id | INT | FOREIGN KEY -> users.id | 用户ID |
| question_id | INT | FOREIGN KEY -> questions.id | 问题ID |
| created_at | DATETIME | DEFAULT NOW() | 关注时间 |

#### 2.2.9 点赞回答表 (answer_likes)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| user_id | INT | FOREIGN KEY -> users.id | 用户ID |
| answer_id | INT | FOREIGN KEY -> answers.id | 回答ID |
| created_at | DATETIME | DEFAULT NOW() | 点赞时间 |

#### 2.2.10 感谢回答表 (answer_thanks)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| user_id | INT | FOREIGN KEY -> users.id | 用户ID |
| answer_id | INT | FOREIGN KEY -> answers.id | 回答ID |
| created_at | DATETIME | DEFAULT NOW() | 感谢时间 |

#### 2.2.11 收藏回答表 (answer_collections)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| user_id | INT | FOREIGN KEY -> users.id | 用户ID |
| answer_id | INT | FOREIGN KEY -> answers.id | 回答ID |
| created_at | DATETIME | DEFAULT NOW() | 收藏时间 |

#### 2.2.12 浏览历史表 (browse_history)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| user_id | INT | FOREIGN KEY -> users.id | 用户ID |
| question_id | INT | FOREIGN KEY -> questions.id | 问题ID |
| answer_id | INT | FOREIGN KEY -> answers.id | 回答ID(可空) |
| created_at | DATETIME | DEFAULT NOW() | 浏览时间 |

#### 2.2.13 轮播图表 (banners)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| image_url | VARCHAR(255) | NOT NULL | 图片URL |
| link_type | VARCHAR(20) | | 链接类型: question/answer/url |
| link_id | INT | | 链接目标ID |
| link_url | VARCHAR(255) | | 外部链接URL |
| sort_order | INT | DEFAULT 0 | 排序 |
| is_active | TINYINT | DEFAULT 1 | 是否启用 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |

---

## 三、API端点设计

### 3.1 API基础信息

- **基础URL**: `https://api.example.com/v1`
- **数据格式**: JSON
- **认证方式**: JWT Token (通过微信登录获取)

### 3.2 用户模块 (User)

| 方法 | 端点 | 说明 | 请求参数 |
|------|------|------|----------|
| POST | `/auth/login` | 微信登录 | `{ code: string }` |
| GET | `/users/me` | 获取当前用户信息 | - |
| PUT | `/users/me` | 更新用户信息 | `{ nickname?, avatar_url?, bio? }` |
| GET | `/users/{id}` | 获取指定用户信息 | - |
| GET | `/users/{id}/followers` | 获取用户粉丝列表 | `page, limit` |
| GET | `/users/{id}/following` | 获取用户关注列表 | `page, limit` |
| POST | `/users/{id}/follow` | 关注用户 | - |
| DELETE | `/users/{id}/follow` | 取消关注用户 | - |

### 3.3 问题模块 (Question)

| 方法 | 端点 | 说明 | 请求参数 |
|------|------|------|----------|
| GET | `/questions` | 获取问题列表(首页Feed) | `page, limit, type(推荐/热门)` |
| GET | `/questions/search` | 搜索问题 | `keyword, page, limit` |
| POST | `/questions` | 创建问题 | `{ title, content?, tags[]? }` |
| GET | `/questions/{id}` | 获取问题详情 | - |
| PUT | `/questions/{id}` | 更新问题 | `{ title?, content?, tags[]? }` |
| DELETE | `/questions/{id}` | 删除问题 | - |
| POST | `/questions/{id}/follow` | 关注问题 | - |
| DELETE | `/questions/{id}/follow` | 取消关注问题 | - |
| GET | `/questions/{id}/answers` | 获取问题下的回答列表 | `page, limit, sort(热门/最新)` |

### 3.4 回答模块 (Answer)

| 方法 | 端点 | 说明 | 请求参数 |
|------|------|------|----------|
| POST | `/questions/{qid}/answers` | 创建回答 | `{ content }` |
| GET | `/answers/{id}` | 获取回答详情 | - |
| PUT | `/answers/{id}` | 更新回答 | `{ content }` |
| DELETE | `/answers/{id}` | 删除回答 | - |
| POST | `/answers/{id}/like` | 点赞回答 | - |
| DELETE | `/answers/{id}/like` | 取消点赞 | - |
| POST | `/answers/{id}/thank` | 感谢回答 | - |
| DELETE | `/answers/{id}/thank` | 取消感谢 | - |
| POST | `/answers/{id}/collect` | 收藏回答 | - |
| DELETE | `/answers/{id}/collect` | 取消收藏 | - |

### 3.5 评论模块 (Comment)

| 方法 | 端点 | 说明 | 请求参数 |
|------|------|------|----------|
| GET | `/answers/{aid}/comments` | 获取回答的评论列表 | `page, limit` |
| POST | `/answers/{aid}/comments` | 发表评论 | `{ content, parent_id? }` |
| DELETE | `/comments/{id}` | 删除评论 | - |

### 3.6 发现模块 (Discovery)

| 方法 | 端点 | 说明 | 请求参数 |
|------|------|------|----------|
| GET | `/discovery/recommend` | 获取推荐内容 | `page, limit` |
| GET | `/discovery/hot` | 获取热门内容 | `page, limit` |
| GET | `/discovery/banners` | 获取轮播图 | - |

### 3.7 用户中心模块 (Me)

| 方法 | 端点 | 说明 | 请求参数 |
|------|------|------|----------|
| GET | `/me/following/questions` | 我关注的问题 | `page, limit` |
| GET | `/me/collections` | 我的收藏 | `page, limit` |
| GET | `/me/history` | 最近浏览 | `page, limit` |
| POST | `/me/history` | 添加浏览记录 | `{ question_id, answer_id? }` |
| DELETE | `/me/history` | 清空浏览记录 | - |

### 3.8 标签模块 (Tag)

| 方法 | 端点 | 说明 | 请求参数 |
|------|------|------|----------|
| GET | `/tags` | 获取热门标签 | `limit` |
| GET | `/tags/{id}/questions` | 获取标签下的问题 | `page, limit` |

---

## 四、API响应格式

### 4.1 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

### 4.2 错误码定义

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 资源不存在 |
| 2001 | 未登录 |
| 2002 | 登录过期 |
| 2003 | 无权限 |
| 5000 | 服务器错误 |

### 4.3 核心API响应示例

#### 4.3.1 首页Feed响应 `GET /questions`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "question_id": 1,
        "answer_id": 3,
        "feed_source_id": 23,
        "feed_source_name": "Rebecca",
        "feed_source_txt": "赞了回答",
        "feed_source_img": "https://xxx.com/avatar.jpg",
        "question": "选择 Kindle 而不是纸质书的原因是什么？",
        "answer_ctnt": "难道不明白纸质书更贵啊...",
        "good_num": 112,
        "comment_num": 18
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "has_more": true
  }
}
```

#### 4.3.2 问题详情响应 `GET /questions/{id}`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "选择 Kindle 而不是纸质书的原因是什么？",
    "content": "WEB前端*不靠谱天气预报员*想做代码小仙女",
    "tags": ["阅读", "电子书", "Kindle", "书籍", "文学"],
    "user": {
      "id": 1,
      "nickname": "Rebecca",
      "avatar_url": "https://xxx.com/avatar.jpg"
    },
    "view_count": 3316,
    "answer_count": 27,
    "follow_count": 156,
    "is_following": false,
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

#### 4.3.3 回答详情响应 `GET /answers/{id}`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 3,
    "question": {
      "id": 1,
      "title": "选择 Kindle 而不是纸质书的原因是什么？"
    },
    "user": {
      "id": 23,
      "nickname": "Rebecca",
      "avatar_url": "https://xxx.com/avatar.jpg",
      "bio": "WEB前端*不靠谱天气预报员*想做代码小仙女"
    },
    "content": "难道不明白纸质书更贵啊！！！...",
    "like_count": 2100,
    "thank_count": 89,
    "comment_count": 302,
    "collect_count": 156,
    "is_liked": false,
    "is_thanked": false,
    "is_collected": false,
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

---

## 五、技术栈建议

### 5.1 后端技术选型

| 组件 | 推荐技术 | 说明 |
|------|----------|------|
| **语言** | Node.js / Python | 快速开发，生态丰富 |
| **框架** | Express / Koa / FastAPI | 轻量、高性能 |
| **数据库** | MySQL / PostgreSQL | 关系型数据库，支持复杂查询 |
| **缓存** | Redis | 热点数据缓存，Session存储 |
| **ORM** | Sequelize / Prisma / SQLAlchemy | 数据库操作抽象 |
| **认证** | JWT | 无状态认证，适合小程序 |

### 5.2 推荐目录结构 (Node.js + Express)

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.js
│   ├── controllers/     # 控制器
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── question.js
│   │   ├── answer.js
│   │   └── comment.js
│   ├── models/          # 数据模型
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   └── ...
│   ├── middlewares/     # 中间件
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/          # 路由
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── questions.js
│   │   └── answers.js
│   ├── services/        # 业务逻辑
│   │   ├── userService.js
│   │   └── questionService.js
│   ├── utils/           # 工具函数
│   │   └── wechat.js
│   └── app.js           # 入口文件
├── package.json
└── .env
```

---

## 六、前后端对接说明

### 6.1 前端需修改的文件

| 文件 | 修改内容 |
|------|----------|
| `utils/util.js` | 修改 `getData` 函数，使用真实API地址 |
| `pages/index/index.js` | 调用 `GET /questions` 获取首页Feed |
| `pages/discovery/discovery.js` | 调用发现模块API |
| `pages/more/more.js` | 调用用户中心API |
| `pages/answer/answer.js` | 调用回答详情API |
| `pages/question/question.js` | 调用问题详情和回答列表API |

### 6.2 前端API调用示例

```javascript
// utils/api.js
const BASE_URL = 'https://api.example.com/v1';

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: method,
      data: data,
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

// 获取首页Feed
function getFeed(page = 1, limit = 10) {
  return request(`/questions?page=${page}&limit=${limit}`);
}

// 获取问题详情
function getQuestion(id) {
  return request(`/questions/${id}`);
}

module.exports = { request, getFeed, getQuestion };
```

---

## 七、部署建议

| 方案 | 说明 |
|------|------|
| **云开发** | 微信云开发，免服务器，适合快速上线 |
| **自建服务器** | 阿里云/腾讯云ECS，灵活可控 |
| **Serverless** | 云函数，按需付费，适合低流量应用 |

