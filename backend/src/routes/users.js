const express = require('express');
const UserController = require('../controllers/userController');
const QuestionController = require('../controllers/questionController');
const AnswerController = require('../controllers/answerController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// 获取我的资料
router.get('/me', authMiddleware, UserController.getProfile);

// 获取指定用户资料
router.get('/:id', UserController.getProfile);

// 获取用户的问题列表
router.get('/:id/questions', QuestionController.getQuestionsByUser);

// 获取用户的回答列表
router.get('/:id/answers', AnswerController.getAnswersByUser);

module.exports = router;
