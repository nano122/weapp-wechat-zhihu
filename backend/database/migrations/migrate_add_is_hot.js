/**
 * 数据库迁移脚本：添加 is_hot 字段到 answers 表
 * 执行方式: node backend/database/migrations/migrate_add_is_hot.js
 */

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbPath = process.env.DB_PATH || path.join(__dirname, '../zhihu.db');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: console.log
});

async function migrate() {
    try {
        console.log('🔄 开始迁移: 添加 is_hot 字段到 answers 表...');

        // 检查字段是否已存在
        const [results] = await sequelize.query(`PRAGMA table_info(answers);`);
        const hasIsHot = results.some(col => col.name === 'is_hot');

        if (hasIsHot) {
            console.log('⚠️  字段 is_hot 已存在，跳过迁移');
            return;
        }

        // 添加 is_hot 字段
        await sequelize.query(`
            ALTER TABLE answers 
            ADD COLUMN is_hot INTEGER DEFAULT 0;
        `);

        console.log('✅ 成功添加 is_hot 字段');

        // SQLite 不支持直接创建索引在 ALTER TABLE 中，需要单独创建
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_is_hot ON answers (is_hot);
        `);

        console.log('✅ 成功创建索引 idx_is_hot');
        console.log('🎉 迁移完成！');

    } catch (error) {
        console.error('❌ 迁移失败:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

migrate();
