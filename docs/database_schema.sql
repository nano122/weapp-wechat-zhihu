-- ============================================
-- 知乎微信小程序数据库建表脚本
-- 数据库: MySQL 8.0+
-- 字符集: utf8mb4
-- ============================================
-- 创建数据库
CREATE DATABASE IF NOT EXISTS zhihu_weapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zhihu_weapp;
-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    openid VARCHAR(64) NOT NULL UNIQUE COMMENT '微信OpenID',
    nickname VARCHAR(50) NOT NULL COMMENT '昵称',
    avatar_url VARCHAR(255) DEFAULT '' COMMENT '头像URL',
    bio VARCHAR(200) DEFAULT '' COMMENT '个人简介',
    gender TINYINT DEFAULT 0 COMMENT '性别: 0未知 1男 2女',
    follower_count INT DEFAULT 0 COMMENT '粉丝数',
    following_count INT DEFAULT 0 COMMENT '关注数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_openid (openid)
) ENGINE = InnoDB COMMENT = '用户表';
-- ============================================
-- 2. 标签表
-- ============================================
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
    name VARCHAR(30) NOT NULL UNIQUE COMMENT '标签名称',
    question_count INT DEFAULT 0 COMMENT '问题数量',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_name (name)
) ENGINE = InnoDB COMMENT = '标签表';
-- ============================================
-- 3. 问题表
-- ============================================
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '问题ID',
    user_id INT NOT NULL COMMENT '提问者ID',
    title VARCHAR(200) NOT NULL COMMENT '问题标题',
    content TEXT COMMENT '问题描述',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    answer_count INT DEFAULT 0 COMMENT '回答数',
    follow_count INT DEFAULT 0 COMMENT '关注数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX ft_title_content (title, content)
) ENGINE = InnoDB COMMENT = '问题表';
-- ============================================
-- 4. 问题-标签关联表
-- ============================================
CREATE TABLE question_tags (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    question_id INT NOT NULL COMMENT '问题ID',
    tag_id INT NOT NULL COMMENT '标签ID',
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY uk_question_tag (question_id, tag_id),
    INDEX idx_tag_id (tag_id)
) ENGINE = InnoDB COMMENT = '问题-标签关联表';
-- ============================================
-- 5. 回答表
-- ============================================
CREATE TABLE answers (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '回答ID',
    question_id INT NOT NULL COMMENT '所属问题ID',
    user_id INT NOT NULL COMMENT '回答者ID',
    content TEXT NOT NULL COMMENT '回答内容',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    thank_count INT DEFAULT 0 COMMENT '感谢数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    collect_count INT DEFAULT 0 COMMENT '收藏数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_question_id (question_id),
    INDEX idx_user_id (user_id),
    INDEX idx_like_count (like_count),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB COMMENT = '回答表';
-- ============================================
-- 6. 评论表
-- ============================================
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
    answer_id INT NOT NULL COMMENT '所属回答ID',
    user_id INT NOT NULL COMMENT '评论者ID',
    content VARCHAR(500) NOT NULL COMMENT '评论内容',
    parent_id INT DEFAULT NULL COMMENT '父评论ID(用于回复)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE
    SET NULL,
        INDEX idx_answer_id (answer_id),
        INDEX idx_user_id (user_id),
        INDEX idx_parent_id (parent_id)
) ENGINE = InnoDB COMMENT = '评论表';
-- ============================================
-- 7. 用户关注用户表
-- ============================================
CREATE TABLE user_follows (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    follower_id INT NOT NULL COMMENT '关注者ID',
    following_id INT NOT NULL COMMENT '被关注者ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_follower_following (follower_id, following_id),
    INDEX idx_following_id (following_id)
) ENGINE = InnoDB COMMENT = '用户关注用户表';
-- ============================================
-- 8. 用户关注问题表
-- ============================================
CREATE TABLE question_follows (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    user_id INT NOT NULL COMMENT '用户ID',
    question_id INT NOT NULL COMMENT '问题ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_question (user_id, question_id),
    INDEX idx_question_id (question_id)
) ENGINE = InnoDB COMMENT = '用户关注问题表';
-- ============================================
-- 9. 点赞回答表
-- ============================================
CREATE TABLE answer_likes (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    user_id INT NOT NULL COMMENT '用户ID',
    answer_id INT NOT NULL COMMENT '回答ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_answer (user_id, answer_id),
    INDEX idx_answer_id (answer_id)
) ENGINE = InnoDB COMMENT = '点赞回答表';
-- ============================================
-- 10. 感谢回答表
-- ============================================
CREATE TABLE answer_thanks (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    user_id INT NOT NULL COMMENT '用户ID',
    answer_id INT NOT NULL COMMENT '回答ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '感谢时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_answer (user_id, answer_id),
    INDEX idx_answer_id (answer_id)
) ENGINE = InnoDB COMMENT = '感谢回答表';
-- ============================================
-- 11. 收藏回答表
-- ============================================
CREATE TABLE answer_collections (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    user_id INT NOT NULL COMMENT '用户ID',
    answer_id INT NOT NULL COMMENT '回答ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_answer (user_id, answer_id),
    INDEX idx_answer_id (answer_id),
    INDEX idx_user_id (user_id)
) ENGINE = InnoDB COMMENT = '收藏回答表';
-- ============================================
-- 12. 浏览历史表
-- ============================================
CREATE TABLE browse_history (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    user_id INT NOT NULL COMMENT '用户ID',
    question_id INT NOT NULL COMMENT '问题ID',
    answer_id INT DEFAULT NULL COMMENT '回答ID(可空)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '浏览时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE
    SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
) ENGINE = InnoDB COMMENT = '浏览历史表';
-- ============================================
-- 13. 轮播图表
-- ============================================
CREATE TABLE banners (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
    link_type VARCHAR(20) DEFAULT 'url' COMMENT '链接类型: question/answer/url',
    link_id INT DEFAULT NULL COMMENT '链接目标ID(问题/回答)',
    link_url VARCHAR(255) DEFAULT '' COMMENT '外部链接URL',
    sort_order INT DEFAULT 0 COMMENT '排序(数字越小越靠前)',
    is_active TINYINT DEFAULT 1 COMMENT '是否启用: 0否 1是',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE = InnoDB COMMENT = '轮播图表';
-- ============================================
-- 14. Feed动态表 (用于首页信息流)
-- ============================================
CREATE TABLE feeds (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    user_id INT NOT NULL COMMENT '产生动态的用户ID',
    action_type VARCHAR(20) NOT NULL COMMENT '动作类型: answer/like/follow',
    question_id INT NOT NULL COMMENT '相关问题ID',
    answer_id INT DEFAULT NULL COMMENT '相关回答ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE
    SET NULL,
        INDEX idx_created_at (created_at),
        INDEX idx_user_id (user_id)
) ENGINE = InnoDB COMMENT = 'Feed动态表';
-- ============================================
-- 插入测试数据
-- ============================================
-- 插入测试用户
INSERT INTO users (openid, nickname, avatar_url, bio)
VALUES (
        'test_openid_001',
        'Rebecca',
        '/images/icon1.jpeg',
        'WEB前端*不靠谱天气预报员*想做代码小仙女'
    ),
    (
        'test_openid_002',
        'Alex',
        '/images/icon8.jpg',
        '音乐爱好者，热爱生活'
    ),
    (
        'test_openid_003',
        'George',
        '/images/icon9.jpeg',
        '气象学专业，科普达人'
    );
-- 插入测试标签
INSERT INTO tags (name)
VALUES ('阅读'),
    ('电子书'),
    ('Kindle'),
    ('书籍'),
    ('文学'),
    ('音乐'),
    ('周杰伦'),
    ('中文歌'),
    ('科学'),
    ('气象');
-- 插入测试问题
INSERT INTO questions (
        user_id,
        title,
        content,
        view_count,
        answer_count,
        follow_count
    )
VALUES (
        1,
        '选择 Kindle 而不是纸质书的原因是什么？',
        '想了解大家选择电子阅读器的理由',
        3316,
        27,
        156
    ),
    (
        2,
        '如何评价周杰伦的「中文歌才是最屌的」的言论？',
        '周杰伦在节目中说中文歌才是最屌的，大家怎么看？',
        5200,
        89,
        234
    ),
    (
        3,
        '气象铁塔的辐射大吗？',
        '小区附近有气象铁塔，担心辐射问题',
        1200,
        15,
        45
    );
-- 插入问题标签关联
INSERT INTO question_tags (question_id, tag_id)
VALUES (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (2, 6),
    (2, 7),
    (2, 8),
    (3, 9),
    (3, 10);
-- 插入测试回答
INSERT INTO answers (
        question_id,
        user_id,
        content,
        like_count,
        comment_count
    )
VALUES (
        1,
        1,
        '难道不明白纸质书更贵啊！！！ 若觉得kindle更贵，我觉得要么阅读量太少，那确实没有买kindle的必要。要么买的都是盗版的纸质书？我不清楚不加以评论。。。 另外，用kindle看小说的怎么真心不懂了...',
        2100,
        302
    ),
    (
        2,
        2,
        '不知道题主是否是学音乐的。 音乐有公认的经典，也有明显的流行趋势没有错。但归根结底，音乐是一种艺术，艺术是很主观的东西。跟画作一个道理，毕加索是大家，但很多人看不懂他的话，甚至觉得很难看...',
        1560,
        178
    ),
    (
        3,
        3,
        '我不知道那个铁塔的情况，不过气象铁塔上会有一些测太阳辐射的设备，如果说辐射的话，太阳辐射那么多，大家赶紧躲进地底下呀~~~~~要不然辐射量这么大，会变异的呀~~~~',
        890,
        56
    );
-- 插入测试轮播图
INSERT INTO banners (
        image_url,
        link_type,
        link_id,
        sort_order,
        is_active
    )
VALUES ('/images/24213.jpg', 'question', 1, 1, 1),
    ('/images/24280.jpg', 'question', 2, 2, 1),
    (
        '/images/1444983318907-_DSC1826.jpg',
        'question',
        3,
        3,
        1
    );
-- 插入测试Feed
INSERT INTO feeds (user_id, action_type, question_id, answer_id)
VALUES (1, 'like', 1, 1),
    (2, 'answer', 2, 2),
    (3, 'like', 3, 3);