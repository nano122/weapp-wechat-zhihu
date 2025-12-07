const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// 点赞回答表
const AnswerLike = sequelize.define('AnswerLike', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'answer_likes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { unique: true, fields: ['user_id', 'answer_id'] },
        { fields: ['answer_id'] }
    ]
});

// 感谢回答表
const AnswerThank = sequelize.define('AnswerThank', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'answer_thanks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { unique: true, fields: ['user_id', 'answer_id'] },
        { fields: ['answer_id'] }
    ]
});

// 收藏回答表
const AnswerCollection = sequelize.define('AnswerCollection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'answer_collections',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { unique: true, fields: ['user_id', 'answer_id'] },
        { fields: ['answer_id'] },
        { fields: ['user_id'] }
    ]
});

// 关注问题表
const QuestionFollow = sequelize.define('QuestionFollow', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'question_follows',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { unique: true, fields: ['user_id', 'question_id'] },
        { fields: ['question_id'] }
    ]
});

// 浏览历史表
const BrowseHistory = sequelize.define('BrowseHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'browse_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['created_at'] }
    ]
});

module.exports = {
    AnswerLike,
    AnswerThank,
    AnswerCollection,
    QuestionFollow,
    BrowseHistory
};
