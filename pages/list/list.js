var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

Page({
    data: {
        feed: [],
        feed_length: 0,
        page: 1,
        hasMore: true,
        type: 'recommend'
    },

    onLoad: function (options) {
        this.setData({
            type: options.type || 'recommend'
        });
        if (options.title) {
            wx.setNavigationBarTitle({
                title: options.title
            });
        }
        this.loadData();
    },

    loadData: function () {
        var that = this;
        var apiCall;

        switch (this.data.type) {
            case 'following':
                apiCall = api.userCenter.getMyFollowingQuestions(this.data.page, 10);
                break;
            case 'collections':
                apiCall = api.userCenter.getMyCollections(this.data.page, 10);
                break;
            case 'history':
                apiCall = api.userCenter.getMyHistory(this.data.page, 10);
                break;
            default:
                apiCall = api.discovery.getRecommend(this.data.page, 10);
        }

        apiCall.then(function (data) {
            that.setData({
                feed: that.data.page === 1 ? data.list : that.data.feed.concat(data.list),
                feed_length: that.data.feed.concat(data.list).length,
                hasMore: data.has_more
            });
        }).catch(function (err) {
            console.error('加载数据失败', err);
        });
    },

    lower: function (e) {
        if (!this.data.hasMore) return;
        this.setData({ page: this.data.page + 1 });
        this.loadData();
    },

    bindItemTap: function (e) {
        const answerId = e.currentTarget.dataset.aid;
        if (answerId) {
            wx.navigateTo({
                url: '../answer/answer?id=' + answerId
            })
        }
    },

    bindQueTap: function (e) {
        const questionId = e.currentTarget.dataset.qid;
        wx.navigateTo({
            url: '../question/question?id=' + questionId
        })
    }
})
