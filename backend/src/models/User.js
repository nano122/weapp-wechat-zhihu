const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    openid: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        comment: '微信OpenID'
    },
    nickname: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '昵称'
    },
    avatar_url: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '头像URL'
    },
    bio: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '个人简介'
    },
    gender: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        comment: '性别: 0未知 1男 2女'
    },
    follower_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '粉丝数'
    },
    following_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '关注数'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['openid'] }
    ]
});

module.exports = User;
