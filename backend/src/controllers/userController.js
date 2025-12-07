const Response = require('../utils/response');
const { User, Question, Answer, QuestionFollow, AnswerCollection } = require('../models');

/**
 * 用户控制器
 */
class UserController {
    /**
     * 获取用户个人资料
     * GET /api/users/me
     * GET /api/users/:id
     */
    static async getProfile(req, res) {
        try {
            let userId;

            // 判断是获取自己还是他人
            if (req.path.includes('/me') || req.params.id === 'me') {
                userId = req.user.id;
            } else {
                userId = req.params.id;
            }

            if (!userId) {
                return Response.badRequest(res, '用户ID不能为空');
            }

            const user = await User.findByPk(userId, {
                attributes: ['id', 'nickname', 'avatar_url', 'bio', 'created_at']
            });

            if (!user) {
                return Response.notFound(res, '用户不存在');
            }

            // 获取统计数据
            const [
                questionCount,
                answerCount,
                followingQuestionCount,
                collectionCount
            ] = await Promise.all([
                Question.count({ where: { user_id: userId } }),
                Answer.count({ where: { user_id: userId } }),
                QuestionFollow.count({ where: { user_id: userId } }),
                AnswerCollection.count({ where: { user_id: userId } })
            ]);

            return Response.success(res, {
                id: user.id,
                nickname: user.nickname,
                avatar_url: user.avatar_url,
                bio: user.bio,
                created_at: user.created_at,
                stats: {
                    question_count: questionCount,
                    answer_count: answerCount,
                    following_question_count: followingQuestionCount,
                    collection_count: collectionCount
                }
            });
        } catch (error) {
            console.error('获取用户资料失败:', error);
            return Response.error(res, 5000, '获取用户资料失败');
        }
    }
}

module.exports = UserController;
