const express = require('express');
const authRoutes = require('./auth');
const questionRoutes = require('./questions');
const answerRoutes = require('./answers');
const discoveryRoutes = require('./discovery');

const router = express.Router();

/**
 * 路由入口
 */

// 健康检查
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: '服务正常运行' });
});

// API路由
router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/', answerRoutes); // 包含 /questions/:qid/answers 和 /answers/:id
router.use('/discovery', discoveryRoutes);
router.use('/users', require('./users'));

module.exports = router;
