const { sequelize } = require('../config/database');
const {
    User,
    Question,
    Answer,
    Tag,
    QuestionTag,
    Comment,
    Banner,
    AnswerLike,
    AnswerThank,
    AnswerCollection,
    QuestionFollow,
    BrowseHistory
} = require('../models');
require('dotenv').config();

/**
 * 初始化数据库
 */
const initDatabase = async () => {
    try {
        console.log('开始初始化数据库...');

        // 同步数据库（创建表）
        await sequelize.sync({ force: true }); // force: true 会删除已存在的表
        console.log('✓ 数据库表创建成功');

        // 插入测试用户
        const users = await User.bulkCreate([
            {
                openid: 'test_openid_001',
                nickname: 'Rebecca',
                avatar_url: '../../images/icon1.jpeg',
                bio: 'WEB前端*不靠谱天气预报员*想做代码小仙女'
            },
            {
                openid: 'test_openid_002',
                nickname: 'Alex',
                avatar_url: '../../images/icon8.jpg',
                bio: '音乐爱好者，热爱生活'
            },
            {
                openid: 'test_openid_003',
                nickname: 'George',
                avatar_url: '../../images/icon9.jpeg',
                bio: '气象学专业，科普达人'
            }
        ]);
        console.log('✓ 插入测试用户成功');

        // 插入测试标签
        const tags = await Tag.bulkCreate([
            { name: '阅读' },
            { name: '电子书' },
            { name: 'Kindle' },
            { name: '书籍' },
            { name: '文学' },
            { name: '音乐' },
            { name: '周杰伦' },
            { name: '中文歌' },
            { name: '科学' },
            { name: '气象' }
        ]);
        console.log('✓ 插入测试标签成功');

        // 插入测试问题
        const questions = await Question.bulkCreate([
            {
                user_id: users[0].id,
                title: '选择 Kindle 而不是纸质书的原因是什么？',
                content: '想了解大家选择电子阅读器的理由',
                view_count: 3316,
                answer_count: 1,
                follow_count: 156
            },
            {
                user_id: users[1].id,
                title: '如何评价周杰伦的「中文歌才是最屌的」的言论？',
                content: '周杰伦在节目中说中文歌才是最屌的，大家怎么看？',
                view_count: 5200,
                answer_count: 1,
                follow_count: 234
            },
            {
                user_id: users[2].id,
                title: '气象铁塔的辐射大吗？',
                content: '小区附近有气象铁塔，担心辐射问题',
                view_count: 1200,
                answer_count: 1,
                follow_count: 45
            }
        ]);
        console.log('✓ 插入测试问题成功');

        // 关联问题和标签
        await questions[0].setTags([tags[0], tags[1], tags[2], tags[3], tags[4]]);
        await questions[1].setTags([tags[5], tags[6], tags[7]]);
        await questions[2].setTags([tags[8], tags[9]]);
        console.log('✓ 关联问题和标签成功');

        // 插入测试回答
        const answers = await Answer.bulkCreate([
            {
                question_id: questions[0].id,
                user_id: users[0].id,
                content: '难道不明白纸质书更贵啊！！！ 若觉得kindle更贵，我觉得要么阅读量太少，那确实没有买kindle的必要。要么买的都是盗版的纸质书？我不清楚不加以评论。。。 另外，用kindle看小说的怎么真心不懂了。题主不看小说么？难道题主拿来看教科书还是技术文档？还是题主觉得小说就是小时代内样的？（对小时代没偏见，尊重多样性）而且纸质书搬起来真心困难啊！当初毕业带不回来，忍痛卖了不少好桑心！碎片时间阅读总不能天天背着一本书吧，那么占地方。',
                like_count: 2100,
                comment_count: 302,
                thank_count: 89,
                collect_count: 156
            },
            {
                question_id: questions[1].id,
                user_id: users[1].id,
                content: '不知道题主是否是学音乐的。 音乐有公认的经典，也有明显的流行趋势没有错。但归根结底，音乐是一种艺术，艺术是很主观的东西。跟画作一个道理，毕加索是大家，但很多人看不懂他的话，甚至觉得很难看。但这不影响毕加索是大师。周杰伦的音乐风格独特，融合了多种元素，在华语乐坛确实有很高的地位。',
                like_count: 1560,
                comment_count: 178,
                thank_count: 45,
                collect_count: 89
            },
            {
                question_id: questions[2].id,
                user_id: users[2].id,
                content: '我不知道那个铁塔的情况，不过气象铁塔上会有一些测太阳辐射的设备，如果说辐射的话，太阳辐射那么多，大家赶紧躲进地底下呀~~~~~要不然辐射量这么大，会变异的呀~~~~开个玩笑，其实气象铁塔的辐射非常小，远低于国家标准，不用担心。',
                like_count: 890,
                comment_count: 56,
                thank_count: 23,
                collect_count: 34
            }
        ]);
        console.log('✓ 插入测试回答成功');

        // 插入测试轮播图
        await Banner.bulkCreate([
            {
                image_url: '../../images/24213.jpg',
                link_type: 'question',
                link_id: questions[0].id,
                sort_order: 1,
                is_active: 1
            },
            {
                image_url: '../../images/24280.jpg',
                link_type: 'question',
                link_id: questions[1].id,
                sort_order: 2,
                is_active: 1
            },
            {
                image_url: '../../images/1444983318907-_DSC1826.jpg',
                link_type: 'question',
                link_id: questions[2].id,
                sort_order: 3,
                is_active: 1
            }
        ]);
        console.log('✓ 插入测试轮播图成功');

        console.log('\n===========================================');
        console.log('✅ 数据库初始化完成！');
        console.log('===========================================');
        console.log(`📊 用户: ${users.length} 个`);
        console.log(`🏷️  标签: ${tags.length} 个`);
        console.log(`❓ 问题: ${questions.length} 个`);
        console.log(`💬 回答: ${answers.length} 个`);
        console.log('===========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
        process.exit(1);
    }
};

initDatabase();
