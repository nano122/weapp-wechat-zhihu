# 前后端对接完成指南

## ✅ 已完成的工作

### 后端部分
- ✅ 完整的Node.js后端API（Express + Sequelize + SQLite）
- ✅ 数据库初始化完成，包含3个测试问题和回答
- ✅ 40+个RESTful API端点
- ✅ JWT认证系统

### 前端部分
- ✅ 创建API封装文件 `utils/api.js`
- ✅ 修改首页 `pages/index/` 使用真实API
- ✅ 修改发现页 `pages/discovery/` 使用真实API
- ✅ 添加问题ID数据绑定，支持跳转到问题详情

## 🚀 启动步骤

### 1. 启动后端服务器

如果3000端口被占用，先关闭占用进程：

```powershell
# 查找占用3000端口的进程
netstat -ano | findstr :3000

# 关闭进程（替换PID为实际的进程ID）
taskkill /PID <PID> /F
```

然后启动后端：

```bash
cd backend
npm run dev
```

看到以下输出表示成功：
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
   - ✅ 勾选 "启用开发调试"
4. 编译运行

### 3. 测试功能

#### 测试首页
- 应该能看到从后端加载的3个问题
- 下拉刷新应该工作
- 上滑加载更多（虽然目前只有3条数据）
- 点击问题应该能跳转

#### 测试发现页
- 轮播图应该显示（从后端加载）
- 切换"推荐"、"热门"、"收藏"标签
- "收藏"标签需要登录（目前会提示未登录）

## 📝 待完成的前端页面

以下页面还需要对接后端API：

### 1. 问题详情页 (`pages/question/question.js`)
需要调用：
- `api.question.getDetail(id)` - 获取问题详情
- `api.answer.getListByQuestion(id)` - 获取回答列表
- `api.question.follow(id)` - 关注问题

### 2. 回答详情页 (`pages/answer/answer.js`)
需要调用：
- `api.answer.getDetail(id)` - 获取回答详情
- `api.answer.like(id)` - 点赞
- `api.answer.thank(id)` - 感谢
- `api.answer.collect(id)` - 收藏

### 3. 用户中心页 (`pages/more/more.js`)
需要调用：
- `api.auth.login(code)` - 微信登录
- `api.userCenter.getMyCollections()` - 我的收藏
- `api.userCenter.getMyHistory()` - 浏览历史

## 🔧 常见问题

### Q1: 前端看不到数据？
**A:** 
1. 检查后端是否正常运行（访问 http://localhost:3000/api/health）
2. 检查微信开发者工具的控制台，查看API请求是否成功
3. 确认已勾选"不校验合法域名"选项

### Q2: 显示"网络请求失败"？
**A:**
1. 确认后端服务器正在运行
2. 检查API地址是否正确（`utils/api.js` 中的 `BASE_URL`）
3. 查看开发者工具的网络面板，查看具体错误

### Q3: 如何测试需要登录的API？
**A:**
1. 先调用 `api.auth.login('test123')` 获取token
2. token会自动保存到Storage
3. 之后的请求会自动携带token

## 📊 API测试

可以使用Postman或浏览器直接测试后端API：

### 健康检查
```
GET http://localhost:3000/api/health
```

### 登录获取Token
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "code": "test123"
}
```

### 获取问题列表
```
GET http://localhost:3000/api/questions?page=1&limit=10
```

### 获取轮播图
```
GET http://localhost:3000/api/discovery/banners
```

## 🎯 下一步建议

1. **完成剩余页面的API对接**
   - 问题详情页
   - 回答详情页
   - 用户中心页

2. **添加登录功能**
   - 在app.js中添加自动登录逻辑
   - 保存用户信息到globalData

3. **优化用户体验**
   - 添加加载动画
   - 优化错误提示
   - 添加下拉刷新提示

4. **扩展功能**
   - 实现搜索功能
   - 实现评论功能
   - 实现发布问题/回答功能

## 📚 参考资料

- 后端API文档：`docs/backend_design.md`
- 后端使用指南：`backend/README.md`
- API封装代码：`utils/api.js`
