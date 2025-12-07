const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

/**
 * 中间件配置
 */
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

// 日志中间件
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * 路由配置
 */
app.use('/api', routes);

// 根路径
app.get('/', (req, res) => {
    res.json({
        message: '知乎微信小程序API',
        version: '1.0.0',
        docs: '/api/health'
    });
});

/**
 * 错误处理
 */
app.use(errorHandler);

// 404处理
app.use((req, res) => {
    res.status(404).json({
        code: 1002,
        message: '接口不存在',
        data: null
    });
});

module.exports = app;
