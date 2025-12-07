/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
    console.error('错误:', err);

    // Sequelize验证错误
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            code: 1001,
            message: '数据验证失败: ' + err.errors.map(e => e.message).join(', '),
            data: null
        });
    }

    // Sequelize唯一约束错误
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            code: 1001,
            message: '数据已存在',
            data: null
        });
    }

    // 默认服务器错误
    res.status(500).json({
        code: 5000,
        message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误',
        data: null
    });
};

module.exports = errorHandler;
