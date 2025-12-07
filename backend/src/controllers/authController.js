const jwt = require('jsonwebtoken');
const Response = require('../utils/response');
const { User } = require('../models');
require('dotenv').config();

/**
 * 认证控制器
 */
class AuthController {
    /**
     * 微信登录
     * POST /api/auth/login
     */
    static async login(req, res) {
        try {
            const { code } = req.body;

            if (!code) {
                return Response.badRequest(res, '缺少code参数');
            }

            // TODO: 实际生产环境需要调用微信API获取openid
            // 这里为了演示，使用code作为openid
            const openid = 'wx_' + code;

            // 查找或创建用户
            let user = await User.findOne({ where: { openid } });

            if (!user) {
                // 创建新用户
                user = await User.create({
                    openid,
                    nickname: `用户${Date.now()}`,
                    avatar_url: '/images/default_avatar.png'
                });
            }

            // 生成JWT token
            const token = jwt.sign(
                { id: user.id, openid: user.openid },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            return Response.success(res, {
                token,
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    avatar_url: user.avatar_url,
                    bio: user.bio
                }
            }, '登录成功');
        } catch (error) {
            console.error('登录失败:', error);
            return Response.error(res, 5000, '登录失败');
        }
    }
}

module.exports = AuthController;
