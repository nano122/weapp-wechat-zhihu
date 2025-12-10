-- 添加热门权重字段到 answers 表
-- 执行时间: 2025-12-10
-- 添加 is_hot 字段
ALTER TABLE `answers`
ADD COLUMN `is_hot` INT DEFAULT 0 COMMENT '热门权重（0=非热门，数值越大排序越靠前）';
-- 添加索引以优化查询性能
CREATE INDEX `idx_is_hot` ON `answers` (`is_hot`);
-- 说明：
-- is_hot = 0: 非热门回答
-- is_hot > 0: 热门回答，数值越大排序优先级越高
-- 示例: is_hot = 100（一般热门）, is_hot = 500（高热度）, is_hot = 999（置顶）