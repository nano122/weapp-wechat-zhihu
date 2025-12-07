const Response = require('../utils/response');
const { Banner, QuestionFollow, AnswerCollection, BrowseHistory, Question, Answer, User } = require('../models');

/**
 * 发现/用户中心控制器
 */
class DiscoveryController {
    /**
     * 获取轮播图
     * GET /api/discovery/banners
     */
    static async getBanners(req, res) {
        try {
            const banners = await Banner.findAll({
                where: { is_active: 1 },
                order: [['sort_order', 'ASC']],
                attributes: ['id', 'image_url', 'link_type', 'link_id', 'link_url']
            });

            return Response.success(res, banners);
        } catch (error) {
            console.error('获取轮播图失败:', error);
            return Response.error(res, 5000, '获取轮播图失败');
        }
    }

    /**
     * 获取推荐内容
     * GET /api/discovery/recommend
     */
    static async getRecommend(req, res) {
        try {
            // 这里简化为返回最新的问题，实际可以加入推荐算法
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await Question.findAndCountAll({
                limit: parseInt(limit),
                offset,
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'avatar_url']
                    },
                    {
                        model: Answer,
                        as: 'answers',
                        limit: 1,
                        order: [['like_count', 'DESC']],
                        include: [{
                            model: User,
                            as: 'user',
                            attributes: ['id', 'nickname', 'avatar_url']
                        }]
                    }
                ]
            });

            const list = rows.map(q => {
                const answer = q.answers && q.answers[0];
                return {
                    question_id: q.id,
                    answer_id: answer ? answer.id : null,
                    feed_source_id: answer ? answer.user.id : q.user.id,
                    feed_source_name: answer ? answer.user.nickname : q.user.nickname,
                    feed_source_txt: answer ? '回答了问题' : '提出了问题',
                    feed_source_img: answer ? answer.user.avatar_url : q.user.avatar_url,
                    question: q.title,
                    answer_ctnt: answer ? answer.content.substring(0, 100) + '...' : '',
                    good_num: answer ? answer.like_count : 0,
                    comment_num: answer ? answer.comment_count : 0
                };
            });

            return Response.successWithPagination(res, list, count, page, limit);
        } catch (error) {
            console.error('获取推荐内容失败:', error);
            return Response.error(res, 5000, '获取推荐内容失败');
        }
    }

    /**
     * 获取热门内容
     * GET /api/discovery/hot
     */
    static async getHot(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await Question.findAndCountAll({
                limit: parseInt(limit),
                offset,
                order: [['view_count', 'DESC'], ['answer_count', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'avatar_url']
                    },
                    {
                        model: Answer,
                        as: 'answers',
                        limit: 1,
                        order: [['like_count', 'DESC']],
                        include: [{
                            model: User,
                            as: 'user',
                            attributes: ['id', 'nickname', 'avatar_url']
                        }]
                    }
                ]
            });

            const list = rows.map(q => {
                const answer = q.answers && q.answers[0];
                return {
                    question_id: q.id,
                    answer_id: answer ? answer.id : null,
                    feed_source_id: answer ? answer.user.id : q.user.id,
                    feed_source_name: answer ? answer.user.nickname : q.user.nickname,
                    feed_source_txt: answer ? '回答了问题' : '提出了问题',
                    feed_source_img: answer ? answer.user.avatar_url : q.user.avatar_url,
                    question: q.title,
                    answer_ctnt: answer ? answer.content.substring(0, 100) + '...' : '',
                    good_num: answer ? answer.like_count : 0,
                    comment_num: answer ? answer.comment_count : 0
                };
            });

            return Response.successWithPagination(res, list, count, page, limit);
        } catch (error) {
            console.error('获取热门内容失败:', error);
            return Response.error(res, 5000, '获取热门内容失败');
        }
    }

    /**
     * 获取我关注的问题
     * GET /api/me/following/questions
     */
    static async getMyFollowingQuestions(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await QuestionFollow.findAndCountAll({
                where: { user_id: userId },
                limit: parseInt(limit),
                offset,
                order: [['created_at', 'DESC']],
                include: [{
                    model: Question,
                    as: 'question',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'avatar_url']
                    }]
                }]
            });

            const list = rows.map(f => ({
                id: f.question.id,
                title: f.question.title,
                content: f.question.content,
                user: f.question.user,
                answer_count: f.question.answer_count,
                follow_count: f.question.follow_count,
                created_at: f.question.created_at
            }));

            return Response.successWithPagination(res, list, count, page, limit);
        } catch (error) {
            console.error('获取关注的问题失败:', error);
            return Response.error(res, 5000, '获取关注的问题失败');
        }
    }

    /**
     * 获取我的收藏
     * GET /api/me/collections
     */
    static async getMyCollections(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await AnswerCollection.findAndCountAll({
                where: { user_id: userId },
                limit: parseInt(limit),
                offset,
                order: [['created_at', 'DESC']],
                include: [{
                    model: Answer,
                    as: 'answer',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'nickname', 'avatar_url']
                        },
                        {
                            model: Question,
                            as: 'question',
                            attributes: ['id', 'title']
                        }
                    ]
                }]
            });

            const list = rows.map(c => ({
                id: c.answer.id,
                question: c.answer.question,
                user: c.answer.user,
                content: c.answer.content.substring(0, 200) + '...',
                like_count: c.answer.like_count,
                created_at: c.answer.created_at
            }));

            return Response.successWithPagination(res, list, count, page, limit);
        } catch (error) {
            console.error('获取我的收藏失败:', error);
            return Response.error(res, 5000, '获取我的收藏失败');
        }
    }

    /**
     * 获取浏览历史
     * GET /api/me/history
     */
    static async getMyHistory(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await BrowseHistory.findAndCountAll({
                where: { user_id: userId },
                limit: parseInt(limit),
                offset,
                order: [['created_at', 'DESC']],
                include: [{
                    model: Question,
                    as: 'question',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'avatar_url']
                    }]
                }]
            });

            const list = rows.map(h => ({
                id: h.question.id,
                title: h.question.title,
                user: h.question.user,
                answer_count: h.question.answer_count,
                browsed_at: h.created_at
            }));

            return Response.successWithPagination(res, list, count, page, limit);
        } catch (error) {
            console.error('获取浏览历史失败:', error);
            return Response.error(res, 5000, '获取浏览历史失败');
        }
    }

    /**
     * 添加浏览记录
     * POST /api/me/history
     */
    static async addBrowseHistory(req, res) {
        try {
            const userId = req.user.id;
            const { question_id, answer_id } = req.body;

            if (!question_id) {
                return Response.badRequest(res, '缺少question_id');
            }

            await BrowseHistory.create({
                user_id: userId,
                question_id,
                answer_id: answer_id || null
            });

            return Response.success(res, null, '记录成功');
        } catch (error) {
            console.error('添加浏览记录失败:', error);
            return Response.error(res, 5000, '添加浏览记录失败');
        }
    }
}

module.exports = DiscoveryController;
