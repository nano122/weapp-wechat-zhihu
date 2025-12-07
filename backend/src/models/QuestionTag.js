const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuestionTag = sequelize.define('QuestionTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '问题ID'
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '标签ID'
    }
}, {
    tableName: 'question_tags',
    timestamps: false,
    indexes: [
        { unique: true, fields: ['question_id', 'tag_id'] },
        { fields: ['tag_id'] }
    ]
});

module.exports = QuestionTag;
