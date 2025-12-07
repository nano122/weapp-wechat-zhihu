const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// 创建SQLite数据库连接
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || path.join(__dirname, '../../database/zhihu.db'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// 测试数据库连接
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ 数据库连接成功');
    } catch (error) {
        console.error('✗ 数据库连接失败:', error);
    }
};

module.exports = { sequelize, testConnection };
