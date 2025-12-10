const Response = require('../utils/response');
const { Answer, Question, User, Comment, AnswerLike, AnswerThank, AnswerCollection } = require('../models');

/**
 * 回答控制器
 */
class AnswerController {
    /**
     * 获取问题的回答列表
     * GET /api/questions/:qid/answers
     */
    static async getAnswersByQuestion(req, res) {
        try {
            const { qid } = req.params;
            const { page = 1, limit = 10, sort = 'hot' } = req.query;
            const offset = (page - 1) * limit;
            const userId = req.user ? req.user.id : null;

            // 排序方式
            let order;
            if (sort === 'latest') {
                order = [['created_at', 'DESC']];
            } else {
                // 热门排序：优先按热门权重，再按点赞数
                order = [['is_hot', 'DESC'], ['like_count', 'DESC']];
            }

            const { count, rows } = await Answer.findAndCountAll({
                where: { question_id: qid },
                limit: parseInt(limit),
                offset,
                order,
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'avatar_url', 'bio']
                    }
                ]
            });

            // 如果已登录，检查点赞、感谢、收藏状态
            const list = await Promise.all(rows.map(async answer => {
                let is_liked = false;
                let is_thanked = false;
                let is_collected = false;

                if (userId) {
                    const [like, thank, collection] = await Promise.all([
                        AnswerLike.findOne({ where: { user_id: userId, answer_id: answer.id } }),
                        AnswerThank.findOne({ where: { user_id: userId, answer_id: answer.id } }),
                        AnswerCollection.findOne({ where: { user_id: userId, answer_id: answer.id } })
                    ]);
                    is_liked = !!like;
                    is_thanked = !!thank;
                    is_collected = !!collection;
                }

                return {
                    id: answer.id,
                    user: {
                        id: answer.user.id,
                        nickname: answer.user.nickname,
                        avatar_url: answer.user.avatar_url,
                        bio: answer.user.bio
                    },
                    content: answer.content,
                    like_count: answer.like_count,
                    thank_count: answer.thank_count,
                    comment_count: answer.comment_count,
                    collect_count: answer.collect_count,
                    is_liked,
                    is_thanked,
                    is_collected,
                    created_at: answer.created_at
                };
            }));

            return Response.successWithPagination(res, list, count, page, limit);
        } catch (error) {
            console.error('获取回答列表失败:', error);
            return Response.error(res, 5000, '获取回答列表失败');
        }
    }

    /**
     * 获取回答详情
     * GET /api/answers/:id
     */
    static async getAnswerById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user ? req.user.id : null;

            const answer = await Answer.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'avatar_url', 'bio']
                    },
                    {
                        model: Question,
                        as: 'question',
                        attributes: ['id', 'title']
                    }
                ]
            });

            if (!answer) {
                return Response.notFound(res, '回答不存在');
            }

            // 检查点赞、感谢、收藏状态
            let is_liked = false;
            let is_thanked = false;
            let is_collected = false;

            if (userId) {
                const [like, thank, collection] = await Promise.all([
                    AnswerLike.findOne({ where: { user_id: userId, answer_id: id } }),
                    AnswerThank.findOne({ where: { user_id: userId, answer_id: id } }),
                    AnswerCollection.findOne({ where: { user_id: userId, answer_id: id } })
                ]);
                is_liked = !!like;
                is_thanked = !!thank;
                is_collected = !!collection;
            }

            return Response.success(res, {
                id: answer.id,
                question: {
                    id: answer.question.id,
                    title: answer.question.title
                },
                user: {
                    id: answer.user.id,
                    nickname: answer.user.nickname,
                    avatar_url: answer.user.avatar_url,
                    bio: answer.user.bio
                },
                content: answer.content,
                like_count: answer.like_count,
                thank_count: answer.thank_count,
                comment_count: answer.comment_count,
                collect_count: answer.collect_count,
                is_liked,
                is_thanked,
                is_collected,
                created_at: answer.created_at
            });
        } catch (error) {
            console.error('获取回答详情失败:', error);
            return Response.error(res, 5000, '获取回答详情失败');
        }
    }

    /**
     * 创建回答
     * POST /api/questions/:qid/answers
     */
    static async createAnswer(req, res) {
        try {
            const { qid } = req.params;
            const { content } = req.body;
            const userId = req.user.id;

            if (!content) {
                return Response.badRequest(res, '回答内容不能为空');
            }

            const question = await Question.findByPk(qid);
            if (!question) {
                return Response.notFound(res, '问题不存在');
            }

            const answer = await Answer.create({
                question_id: qid,
                user_id: userId,
                content
            });

            // 增加问题的回答数
            await question.increment('answer_count');

            return Response.success(res, { id: answer.id }, '回答成功');
        } catch (error) {
            console.error('创建回答失败:', error);
            return Response.error(res, 5000, '创建回答失败');
        }
    }

    /**
     * 点赞回答
     * POST /api/answers/:id/like
     * DELETE /api/answers/:id/like
     */
    static async toggleLikeAnswer(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const isLike = req.method === 'POST';

            const answer = await Answer.findByPk(id);
            if (!answer) {
                return Response.notFound(res, '回答不存在');
            }

            if (isLike) {
                const [like, created] = await AnswerLike.findOrCreate({
                    where: { user_id: userId, answer_id: id }
                });

                if (created) {
                    await answer.increment('like_count');
                    return Response.success(res, null, '点赞成功');
                } else {
                    return Response.success(res, null, '已点赞');
                }
            } else {
                const deleted = await AnswerLike.destroy({
                    where: { user_id: userId, answer_id: id }
                });

                if (deleted) {
                    await answer.decrement('like_count');
                    return Response.success(res, null, '取消点赞成功');
                } else {
                    return Response.success(res, null, '未点赞');
                }
            }
        } catch (error) {
            console.error('点赞回答失败:', error);
            return Response.error(res, 5000, '操作失败');
        }
    }

    /**
     * 感谢回答
     * POST /api/answers/:id/thank
     * DELETE /api/answers/:id/thank
     */
    static async toggleThankAnswer(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const isThank = req.method === 'POST';

            const answer = await Answer.findByPk(id);
            if (!answer) {
                return Response.notFound(res, '回答不存在');
            }

            if (isThank) {
                const [thank, created] = await AnswerThank.findOrCreate({
                    where: { user_id: userId, answer_id: id }
                });

                if (created) {
                    await answer.increment('thank_count');
                    return Response.success(res, null, '感谢成功');
                } else {
                    return Response.success(res, null, '已感谢');
                }
            } else {
                const deleted = await AnswerThank.destroy({
                    where: { user_id: userId, answer_id: id }
                });

                if (deleted) {
                    await answer.decrement('thank_count');
                    return Response.success(res, null, '取消感谢成功');
                } else {
                    return Response.success(res, null, '未感谢');
                }
            }
        } catch (error) {
            console.error('感谢回答失败:', error);
            return Response.error(res, 5000, '操作失败');
        }
    }

    /**
     * 收藏回答
     * POST /api/answers/:id/collect
     * DELETE /api/answers/:id/collect
     */
    static async toggleCollectAnswer(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const isCollect = req.method === 'POST';

            const answer = await Answer.findByPk(id);
            if (!answer) {
                return Response.notFound(res, '回答不存在');
            }

            if (isCollect) {
                const [collection, created] = await AnswerCollection.findOrCreate({
                    where: { user_id: userId, answer_id: id }
                });

                if (created) {
                    await answer.increment('collect_count');
                    return Response.success(res, null, '收藏成功');
                } else {
                    return Response.success(res, null, '已收藏');
                }
            } else {
                const deleted = await AnswerCollection.destroy({
                    where: { user_id: userId, answer_id: id }
                });

                if (deleted) {
                    await answer.decrement('collect_count');
                    return Response.success(res, null, '取消收藏成功');
                } else {
                    return Response.success(res, null, '未收藏');
                }
            }
        } catch (error) {
            console.error('收藏回答失败:', error);
            return Response.error(res, 5000, '操作失败');
        }
    }

    /**
     * 获取用户的回答列表
     * GET /api/users/:id/answers
     */
    static async getAnswersByUser(req, res) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await Answer.findAndCountAll({
                where: { user_id: id },
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
                        model: Question,
                        as: 'question',
                        attributes: ['id', 'title']
                    }
                ]
            });

            // 转换为Feed格式
            const list = rows.map(a => {
                return {
                    question_id: a.question.id,
                    answer_id: a.id,
                    feed_source_id: a.user.id,
                    feed_source_name: a.user.nickname,
                    feed_source_txt: '回答了问题',
                    feed_source_img: a.user.avatar_url,
                    question: a.question.title,
                    answer_ctnt: a.content.substring(0, 100) + '...',
                    good_num: a.like_count || 0,
                    comment_num: a.comment_count || 0
                };
            });

            return Response.successWithPagination(res, list, count, page, limit);
        } catch (error) {
            console.error('获取用户回答列表失败:', error);
            return Response.error(res, 5000, '获取用户回答列表失败');
        }
    }
}

module.exports = AnswerController;
