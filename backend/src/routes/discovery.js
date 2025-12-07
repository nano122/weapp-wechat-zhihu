const express = require('express');
const DiscoveryController = require('../controllers/discoveryController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

/**
 * 发现和用户中心路由
 */

// 轮播图
router.get('/banners', DiscoveryController.getBanners);

// 推荐内容
router.get('/recommend', DiscoveryController.getRecommend);

// 热门内容
router.get('/hot', DiscoveryController.getHot);

// 我关注的问题（需要登录）
router.get('/me/following/questions', authMiddleware, DiscoveryController.getMyFollowingQuestions);

// 我的收藏（需要登录）
router.get('/me/collections', authMiddleware, DiscoveryController.getMyCollections);

// 浏览历史（需要登录）
router.get('/me/history', authMiddleware, DiscoveryController.getMyHistory);
router.post('/me/history', authMiddleware, DiscoveryController.addBrowseHistory);

module.exports = router;
