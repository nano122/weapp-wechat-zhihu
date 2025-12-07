const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        comment: '标签名称'
    },
    question_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '问题数量'
    }
}, {
    tableName: 'tags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['name'] }
    ]
});

module.exports = Tag;
