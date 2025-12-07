const { sequelize } = require('../config/database');
const User = require('./User');
const Question = require('./Question');
const Answer = require('./Answer');
const Tag = require('./Tag');
const QuestionTag = require('./QuestionTag');
const Comment = require('./Comment');
const Banner = require('./Banner');
const {
    AnswerLike,
    AnswerThank,
    AnswerCollection,
    QuestionFollow,
    BrowseHistory
} = require('./Relations');

// ============================================
// 定义模型关联关系
// ============================================

// User -> Question (一对多)
User.hasMany(Question, { foreignKey: 'user_id', as: 'questions' });
Question.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> Answer (一对多)
User.hasMany(Answer, { foreignKey: 'user_id', as: 'answers' });
Answer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Question -> Answer (一对多)
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// Answer -> Comment (一对多)
Answer.hasMany(Comment, { foreignKey: 'answer_id', as: 'comments' });
Comment.belongsTo(Answer, { foreignKey: 'answer_id', as: 'answer' });

// User -> Comment (一对多)
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Question <-> Tag (多对多)
Question.belongsToMany(Tag, {
    through: QuestionTag,
    foreignKey: 'question_id',
    otherKey: 'tag_id',
    as: 'tags'
});
Tag.belongsToMany(Question, {
    through: QuestionTag,
    foreignKey: 'tag_id',
    otherKey: 'question_id',
    as: 'questions'
});

// User -> AnswerLike
User.hasMany(AnswerLike, { foreignKey: 'user_id', as: 'answer_likes' });
AnswerLike.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Answer -> AnswerLike
Answer.hasMany(AnswerLike, { foreignKey: 'answer_id', as: 'likes' });
AnswerLike.belongsTo(Answer, { foreignKey: 'answer_id', as: 'answer' });

// User -> AnswerThank
User.hasMany(AnswerThank, { foreignKey: 'user_id', as: 'answer_thanks' });
AnswerThank.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Answer -> AnswerThank
Answer.hasMany(AnswerThank, { foreignKey: 'answer_id', as: 'thanks' });
AnswerThank.belongsTo(Answer, { foreignKey: 'answer_id', as: 'answer' });

// User -> AnswerCollection
User.hasMany(AnswerCollection, { foreignKey: 'user_id', as: 'collections' });
AnswerCollection.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Answer -> AnswerCollection
Answer.hasMany(AnswerCollection, { foreignKey: 'answer_id', as: 'collections' });
AnswerCollection.belongsTo(Answer, { foreignKey: 'answer_id', as: 'answer' });

// User -> QuestionFollow
User.hasMany(QuestionFollow, { foreignKey: 'user_id', as: 'question_follows' });
QuestionFollow.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Question -> QuestionFollow
Question.hasMany(QuestionFollow, { foreignKey: 'question_id', as: 'follows' });
QuestionFollow.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// User -> BrowseHistory
User.hasMany(BrowseHistory, { foreignKey: 'user_id', as: 'browse_history' });
BrowseHistory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Question -> BrowseHistory
Question.hasMany(BrowseHistory, { foreignKey: 'question_id', as: 'browse_history' });
BrowseHistory.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// Answer -> BrowseHistory
Answer.hasMany(BrowseHistory, { foreignKey: 'answer_id', as: 'browse_history' });
BrowseHistory.belongsTo(Answer, { foreignKey: 'answer_id', as: 'answer' });

// 导出所有模型
module.exports = {
    sequelize,
    User,
    Question,
    Answer,
    Tag,
    QuestionTag,
    Comment,
    Banner,
    AnswerLike,
    AnswerThank,
    AnswerCollection,
    QuestionFollow,
    BrowseHistory
};
