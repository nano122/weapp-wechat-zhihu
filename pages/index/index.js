//index.js

var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()

Page({
  data: {
    feed: [],
    feed_length: 0,
    page: 1,
    hasMore: true
  },

  //事件处理函数
  bindItemTap: function () {
    wx.navigateTo({
      url: '../answer/answer'
    })
  },

  bindQueTap: function (e) {
    const questionId = e.currentTarget.dataset.qid;
    wx.navigateTo({
      url: '../question/question?id=' + questionId
    })
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    this.loadData();
  },

  upper: function () {
    wx.showNavigationBarLoading()
    this.refresh();
    console.log("upper");
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  },

  lower: function (e) {
    if (!this.data.hasMore) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      });
      return;
    }
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    console.log("lower")
  },

  // 加载数据
  loadData: function () {
    var that = this;
    api.question.getList(this.data.page, 10)
      .then(function (data) {
        console.log('获取问题列表成功:', data);
        that.setData({
          feed: data.list,
          feed_length: data.list.length,
          hasMore: data.has_more
        });
      })
      .catch(function (err) {
        console.error('获取问题列表失败:', err);
      });
  },

  // 刷新
  refresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 3000
    });

    var that = this;
    that.setData({ page: 1 });

    api.question.getList(1, 10)
      .then(function (data) {
        console.log('刷新成功:', data);
        that.setData({
          feed: data.list,
          feed_length: data.list.length,
          hasMore: data.has_more
        });

        setTimeout(function () {
          wx.showToast({
            title: '刷新成功',
            icon: 'success',
            duration: 2000
          })
        }, 1000);
      })
      .catch(function (err) {
        console.error('刷新失败:', err);
        wx.showToast({
          title: '刷新失败',
          icon: 'none'
        });
      });
  },

  // 加载更多
  nextLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    });

    var that = this;
    var nextPage = that.data.page + 1;

    api.question.getList(nextPage, 10)
      .then(function (data) {
        console.log('加载更多成功:', data);
        that.setData({
          feed: that.data.feed.concat(data.list),
          feed_length: that.data.feed_length + data.list.length,
          page: nextPage,
          hasMore: data.has_more
        });

        setTimeout(function () {
          wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 2000
          })
        }, 1000);
      })
      .catch(function (err) {
        console.error('加载更多失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  }
})
