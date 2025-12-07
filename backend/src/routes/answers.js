const express = require('express');
const AnswerController = require('../controllers/answerController');
const { authMiddleware, optionalAuth } = require('../middlewares/auth');

const router = express.Router();

/**
 * 回答路由
 */

// 获取问题的回答列表（可选登录）
router.get('/questions/:qid/answers', optionalAuth, AnswerController.getAnswersByQuestion);

// 创建回答（需要登录）
router.post('/questions/:qid/answers', authMiddleware, AnswerController.createAnswer);

// 获取回答详情（可选登录）
router.get('/answers/:id', optionalAuth, AnswerController.getAnswerById);

// 点赞回答（需要登录）
router.post('/answers/:id/like', authMiddleware, AnswerController.toggleLikeAnswer);
router.delete('/answers/:id/like', authMiddleware, AnswerController.toggleLikeAnswer);

// 感谢回答（需要登录）
router.post('/answers/:id/thank', authMiddleware, AnswerController.toggleThankAnswer);
router.delete('/answers/:id/thank', authMiddleware, AnswerController.toggleThankAnswer);

// 收藏回答（需要登录）
router.post('/answers/:id/collect', authMiddleware, AnswerController.toggleCollectAnswer);
router.delete('/answers/:id/collect', authMiddleware, AnswerController.toggleCollectAnswer);

module.exports = router;
