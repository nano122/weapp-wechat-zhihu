const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '所属回答ID'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '评论者ID'
    },
    content: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '评论内容'
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '父评论ID(用于回复)'
    }
}, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['answer_id'] },
        { fields: ['user_id'] },
        { fields: ['parent_id'] }
    ]
});

module.exports = Comment;
