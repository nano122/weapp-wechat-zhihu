const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

/**
 * 认证路由
 */

// 微信登录
router.post('/login', AuthController.login);

module.exports = router;
