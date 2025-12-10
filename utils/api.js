/**
 * API 配置和封装
 */

// API基础地址
const BASE_URL = 'http://localhost:3000/api';

/**
 * 统一请求封装
 */
function request(url, options = {}) {
    const {
        method = 'GET',
        data = {},
        needAuth = false
    } = options;

    return new Promise((resolve, reject) => {
        // 获取token
        const token = wx.getStorageSync('token');

        // 构建header
        const header = {
            'Content-Type': 'application/json'
        };

        // 如果需要认证，添加token
        if (needAuth && token) {
            header['Authorization'] = 'Bearer ' + token;
        }

        wx.request({
            url: BASE_URL + url,
            method: method,
            data: data,
            header: header,
            success: (res) => {
                console.log('API响应:', url, res.data);

                if (res.data.code === 0) {
                    resolve(res.data.data);
                } else {
                    // 如果是未登录或token过期，清除token
                    if (res.data.code === 2001 || res.data.code === 2002) {
                        wx.removeStorageSync('token');
                    }
                    wx.showToast({
                        title: res.data.message || '请求失败',
                        icon: 'none'
                    });
                    reject(res.data);
                }
            },
            fail: (err) => {
                console.error('API请求失败:', url, err);
                wx.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                });
                reject(err);
            }
        });
    });
}

/**
 * 认证API
 */
const auth = {
    // 登录
    login(code) {
        return request('/auth/login', {
            method: 'POST',
            data: { code }
        });
    }
};

/**
 * 问题API
 */
const question = {
    // 获取问题列表（首页Feed）
    getList(page = 1, limit = 10, type = 'recommend') {
        return request(`/questions?page=${page}&limit=${limit}&type=${type}`);
    },

    // 获取问题详情
    getDetail(id) {
        return request(`/questions/${id}`);
    },

    // 搜索问题
    search(keyword, page = 1, limit = 10) {
        return request(`/questions/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    },

    // 创建问题
    create(title, content, tags) {
        return request('/questions', {
            method: 'POST',
            data: { title, content, tags },
            needAuth: true
        });
    },

    // 关注问题
    follow(id) {
        return request(`/questions/${id}/follow`, {
            method: 'POST',
            needAuth: true
        });
    },

    // 取消关注问题
    unfollow(id) {
        return request(`/questions/${id}/follow`, {
            method: 'DELETE',
            needAuth: true
        });
    }
};

/**
 * 回答API
 */
const answer = {
    // 获取问题的回答列表
    getListByQuestion(questionId, page = 1, limit = 10, sort = 'hot') {
        return request(`/questions/${questionId}/answers?page=${page}&limit=${limit}&sort=${sort}`);
    },

    // 获取回答详情
    getDetail(id) {
        return request(`/answers/${id}`);
    },

    // 创建回答
    create(questionId, content) {
        return request(`/questions/${questionId}/answers`, {
            method: 'POST',
            data: { content },
            needAuth: true
        });
    },

    // 点赞回答
    like(id) {
        return request(`/answers/${id}/like`, {
            method: 'POST',
            needAuth: true
        });
    },

    // 取消点赞
    unliked(id) {
        return request(`/answers/${id}/like`, {
            method: 'DELETE',
            needAuth: true
        });
    },

    // 感谢回答
    thank(id) {
        return request(`/answers/${id}/thank`, {
            method: 'POST',
            needAuth: true
        });
    },

    // 收藏回答
    collect(id) {
        return request(`/answers/${id}/collect`, {
            method: 'POST',
            needAuth: true
        });
    },

    // 取消收藏
    uncollect(id) {
        return request(`/answers/${id}/collect`, {
            method: 'DELETE',
            needAuth: true
        });
    }
};

/**
 * 发现API
 */
const discovery = {
    // 获取轮播图
    getBanners() {
        return request('/discovery/banners');
    },

    // 获取推荐内容
    getRecommend(page = 1, limit = 10) {
        return request(`/discovery/recommend?page=${page}&limit=${limit}`);
    },

    // 获取热门内容
    getHot(page = 1, limit = 10) {
        return request(`/discovery/hot?page=${page}&limit=${limit}`);
    }
};

/**
 * 用户中心API
 */
const userCenter = {
    // 我关注的问题
    getMyFollowingQuestions(page = 1, limit = 10) {
        return request(`/discovery/me/following/questions?page=${page}&limit=${limit}`, {
            needAuth: true
        });
    },

    // 我的收藏
    getMyCollections(page = 1, limit = 10) {
        return request(`/discovery/me/collections?page=${page}&limit=${limit}`, {
            needAuth: true
        });
    },

    // 浏览历史
    getMyHistory(page = 1, limit = 10) {
        return request(`/discovery/me/history?page=${page}&limit=${limit}`, {
            needAuth: true
        });
    },

    // 添加浏览记录
    addBrowseHistory(questionId, answerId) {
        return request('/discovery/me/history', {
            method: 'POST',
            data: { question_id: questionId, answer_id: answerId },
            needAuth: true
        });
    }
};

/**
 * 用户API
 */
const user = {
    // 获取指定用户资料
    getProfile(id) {
        return request(`/users/${id}`);
    },

    // 获取我的资料
    getMe() {
        return request('/users/me', {
            needAuth: true
        });
    },

    // 更新我的资料
    updateMe(data) {
        return request('/users/me', {
            method: 'PUT',
            data: data,
            needAuth: true
        });
    },

    // 获取用户提问
    getQuestions(id, page = 1, limit = 10) {
        return request(`/users/${id}/questions?page=${page}&limit=${limit}`);
    },

    // 获取用户回答
    getAnswers(id, page = 1, limit = 10) {
        return request(`/users/${id}/answers?page=${page}&limit=${limit}`);
    }
};

module.exports = {
    request,
    auth,
    question,
    answer,
    discovery,
    userCenter,
    user
};
