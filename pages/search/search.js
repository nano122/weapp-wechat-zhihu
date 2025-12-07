var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

Page({
    data: {
        keyword: '',
        feed: [],
        page: 1,
        hasMore: true,
        hasSearched: false
    },

    handleInput: function (e) {
        this.setData({
            keyword: e.detail.value
        });
    },

    handleSearch: function () {
        if (!this.data.keyword) return;
        this.setData({
            page: 1,
            feed: [],
            hasMore: true,
            hasSearched: true
        });
        this.doSearch();
    },

    doSearch: function () {
        var that = this;
        wx.showLoading({ title: '搜索中...' });

        api.question.search(this.data.keyword, this.data.page, 10)
            .then(function (data) {
                wx.hideLoading();
                that.setData({
                    feed: that.data.page === 1 ? data.list : that.data.feed.concat(data.list),
                    hasMore: data.has_more
                });
            })
            .catch(function (err) {
                wx.hideLoading();
                console.error('Search failed', err);
            });
    },

    lower: function () {
        if (!this.data.hasMore) return;
        this.setData({ page: this.data.page + 1 });
        this.doSearch();
    },

    back: function () {
        wx.navigateBack();
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
