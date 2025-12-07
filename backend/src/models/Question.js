const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '提问者ID'
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '问题标题'
    },
    content: {
        type: DataTypes.TEXT,
        defaultValue: '',
        comment: '问题描述'
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '浏览数'
    },
    answer_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '回答数'
    },
    follow_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '关注数'
    },
    comment_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '评论数'
    }
}, {
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['created_at'] }
    ]
});

module.exports = Question;
