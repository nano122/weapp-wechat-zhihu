const Response = require('../utils/response');
const { Question, User, Answer, Tag, QuestionFollow, AnswerLike } = require('../models');
const { Op } = require('sequelize');

/**
 * 问题控制器
 */
class QuestionController {
    /**
     * 获取问题列表（首页Feed）
     * GET /api/questions
     */
    static async getQuestions(req, res) {
        try {
            const { page = 1, limit = 10, type = 'recommend' } = req.query;
            const offset = (page - 1) * limit;

            // 可以根据type参数返回不同的排序
            let order = [['created_at', 'DESC']];
            if (type === 'hot') {
                order = [['view_count', 'DESC'], ['answer_count', 'DESC']];
            }

            const { count, rows } = await Question.findAndCountAll({
                limit: parseInt(limit),
                offset,
                order,
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
                    },
                    {
                        model: Tag,
                        as: 'tags',
                        attributes: ['id', 'name'],
                        through: { attributes: [] }
                    }
                ]
            });

            // 转换为前端需要的格式
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
                    comment_num: answer ? answer.comment_count : 0,
                    tags: q.tags.map(t => t.name)
                };
            });

            return Response.successWithPagination(res, list, count, page, limit);
        } catch (error) {
            console.error('获取问题列表失败:', error);
            return Response.error(res, 5000, '获取问题列表失败');
        }
    }

    /**
     * 获取问题详情
     * GET /api/questions/:id
     */
    static async getQuestionById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user ? req.user.id : null;

            const question = await Question.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'avatar_url', 'bio']
                    },
                    {
                        model: Tag,
                        as: 'tags',
                        attributes: ['id', 'name'],
                        through: { attributes: [] }
                    }
                ]
            });

            if (!question) {
                return Response.notFound(res, '问题不存在');
            }

            // 增加浏览数
            await question.increment('view_count');

            // 检查是否已关注
            let is_following = false;
            if (userId) {
                const follow = await QuestionFollow.findOne({
                    where: { user_id: userId, question_id: id }
                });
                is_following = !!follow;
            }

            return Response.success(res, {
                id: question.id,
                title: question.title,
                content: question.content,
                tags: question.tags.map(t => t.name),
                user: {
                    id: question.user.id,
                    nickname: question.user.nickname,
                    avatar_url: question.user.avatar_url,
                    bio: question.user.bio
                },
                view_count: question.view_count,
                answer_count: question.answer_count,
                follow_count: question.follow_count,
                is_following,
                created_at: question.created_at
            });
        } catch (error) {
            console.error('获取问题详情失败:', error);
            return Response.error(res, 5000, '获取问题详情失败');
        }
    }

    /**
     * 创建问题
     * POST /api/questions
     */
    static async createQuestion(req, res) {
        try {
            const { title, content, tags = [] } = req.body;
            const userId = req.user.id;

            if (!title) {
                return Response.badRequest(res, '问题标题不能为空');
            }

            // 创建问题
            const question = await Question.create({
                user_id: userId,
                title,
                content: content || ''
            });

            // 处理标签
            if (tags.length > 0) {
                const tagInstances = await Promise.all(
                    tags.map(async tagName => {
                        const [tag] = await Tag.findOrCreate({
                            where: { name: tagName }
                        });
                        return tag;
                    })
                );
                await question.setTags(tagInstances);
            }

            return Response.success(res, { id: question.id }, '创建问题成功');
        } catch (error) {
            console.error('创建问题失败:', error);
            return Response.error(res, 5000, '创建问题失败');
        }
    }

    /**
     * 关注/取消关注问题
     * POST /api/questions/:id/follow
     * DELETE /api/questions/:id/follow
     */
    static async toggleFollowQuestion(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const isFollow = req.method === 'POST';

            const question = await Question.findByPk(id);
            if (!question) {
                return Response.notFound(res, '问题不存在');
            }

            if (isFollow) {
                // 关注
                const [follow, created] = await QuestionFollow.findOrCreate({
                    where: { user_id: userId, question_id: id }
                });

                if (created) {
                    await question.increment('follow_count');
                    return Response.success(res, null, '关注成功');
                } else {
                    return Response.success(res, null, '已关注');
                }
            } else {
                // 取消关注
                const deleted = await QuestionFollow.destroy({
                    where: { user_id: userId, question_id: id }
                });

                if (deleted) {
                    await question.decrement('follow_count');
                    return Response.success(res, null, '取消关注成功');
                } else {
                    return Response.success(res, null, '未关注');
                }
            }
        } catch (error) {
            console.error('关注问题失败:', error);
            return Response.error(res, 5000, '操作失败');
        }
    }

    /**
     * 搜索问题
     * GET /api/questions/search
     */
    static async searchQuestions(req, res) {
        try {
            const { keyword, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            if (!keyword) {
                return Response.badRequest(res, '搜索关键词不能为空');
            }

            const { count, rows } = await Question.findAndCountAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${keyword}%` } },
                        { content: { [Op.like]: `%${keyword}%` } }
                    ]
                },
                limit: parseInt(limit),
                offset,
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'avatar_url']
                    }
                ]
            });

            return Response.successWithPagination(res, rows, count, page, limit);
        } catch (error) {
            console.error('搜索问题失败:', error);
            return Response.error(res, 5000, '搜索失败');
        }
    }
}

module.exports = QuestionController;
