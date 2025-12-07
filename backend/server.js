const app = require('./src/app');
const { sequelize, testConnection } = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

/**
 * 启动服务器
 */
const startServer = async () => {
    try {
        // 测试数据库连接
        await testConnection();

        // 启动HTTP服务器
        app.listen(PORT, () => {
            console.log('===========================================');
            console.log('  知乎微信小程序后端API');
            console.log('===========================================');
            console.log(`🚀 服务器运行在: http://localhost:${PORT}`);
            console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 数据库: SQLite (${process.env.DB_PATH})`);
            console.log('===========================================');
        });
    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
};

startServer();
