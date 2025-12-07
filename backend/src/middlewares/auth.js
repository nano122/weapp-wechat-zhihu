const jwt = require('jsonwebtoken');
const Response = require('../utils/response');
require('dotenv').config();

/**
 * JWT认证中间件
 */
const authMiddleware = (req, res, next) => {
    try {
        // 从header中获取token
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.unauthorized(res, '未提供认证令牌');
        }

        const token = authHeader.substring(7); // 移除 "Bearer " 前缀

        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 将用户信息附加到请求对象
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return Response.tokenExpired(res);
        }
        return Response.unauthorized(res, '无效的认证令牌');
    }
};

/**
 * 可选认证中间件（不强制要求登录）
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }

        next();
    } catch (error) {
        // 如果token无效，继续执行，但不设置req.user
        next();
    }
};

module.exports = { authMiddleware, optionalAuth };
