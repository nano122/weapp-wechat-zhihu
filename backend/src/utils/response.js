/**
 * 统一API响应格式
 */
class Response {
    /**
     * 成功响应
     */
    static success(res, data = null, message = 'success') {
        return res.json({
            code: 0,
            message,
            data
        });
    }

    /**
     * 分页成功响应
     */
    static successWithPagination(res, list, total, page, limit) {
        return res.json({
            code: 0,
            message: 'success',
            data: {
                list,
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                has_more: page * limit < total
            }
        });
    }

    /**
     * 错误响应
     */
    static error(res, code = 5000, message = 'Server error') {
        return res.status(code >= 5000 ? 500 : 400).json({
            code,
            message,
            data: null
        });
    }

    /**
     * 参数错误
     */
    static badRequest(res, message = '参数错误') {
        return this.error(res, 1001, message);
    }

    /**
     * 资源不存在
     */
    static notFound(res, message = '资源不存在') {
        return this.error(res, 1002, message);
    }

    /**
     * 未登录
     */
    static unauthorized(res, message = '未登录') {
        return res.status(401).json({
            code: 2001,
            message,
            data: null
        });
    }

    /**
     * 登录过期
     */
    static tokenExpired(res, message = '登录已过期') {
        return res.status(401).json({
            code: 2002,
            message,
            data: null
        });
    }

    /**
     * 无权限
     */
    static forbidden(res, message = '无权限访问') {
        return res.status(403).json({
            code: 2003,
            message,
            data: null
        });
    }
}

module.exports = Response;
