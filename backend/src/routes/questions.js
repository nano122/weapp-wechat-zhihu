const express = require('express');
const QuestionController = require('../controllers/questionController');
const { authMiddleware, optionalAuth } = require('../middlewares/auth');

const router = express.Router();

/**
 * 问题路由
 */

// 获取问题列表（首页Feed）
router.get('/', QuestionController.getQuestions);

// 搜索问题
router.get('/search', QuestionController.searchQuestions);

// 创建问题（需要登录）
router.post('/', authMiddleware, QuestionController.createQuestion);

// 获取问题详情（可选登录）
router.get('/:id', optionalAuth, QuestionController.getQuestionById);

// 关注问题（需要登录）
router.post('/:id/follow', authMiddleware, QuestionController.toggleFollowQuestion);

// 取消关注问题（需要登录）
router.delete('/:id/follow', authMiddleware, QuestionController.toggleFollowQuestion);

module.exports = router;
