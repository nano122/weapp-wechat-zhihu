const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Answer = sequelize.define('Answer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '所属问题ID'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '回答者ID'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '回答内容'
    },
    like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '点赞数'
    },
    thank_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '感谢数'
    },
    comment_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '评论数'
    },
    collect_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '收藏数'
    },
    is_hot: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '热门权重（0=非热门，数值越大排序越靠前）'
    }
}, {
    tableName: 'answers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['question_id'] },
        { fields: ['user_id'] },
        { fields: ['like_count'] },
        { fields: ['is_hot'] },
        { fields: ['created_at'] }
    ]
});

module.exports = Answer;
