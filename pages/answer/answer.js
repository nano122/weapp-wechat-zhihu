//answer.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()

Page({
  data: {
    answerId: null,
    answer: null,
    isLiked: false,
    isThanked: false,
    isCollected: false
  },

  onLoad: function (options) {
    console.log('onLoad', options)
    var that = this

    // 获取回答ID
    if (options.id) {
      that.setData({ answerId: options.id });
      that.loadAnswerDetail(options.id);
    }
  },

  // 加载回答详情
  loadAnswerDetail: function (id) {
    var that = this;
    api.answer.getDetail(id)
      .then(function (data) {
        console.log('回答详情:', data);
        that.setData({
          answer: data,
          isLiked: data.is_liked,
          isThanked: data.is_thanked,
          isCollected: data.is_collected
        });
      })
      .catch(function (err) {
        console.error('获取回答详情失败:', err);
      });
  },

  // 跳转到问题详情
  toQuestion: function () {
    if (this.data.answer && this.data.answer.question) {
      wx.navigateTo({
        url: '../question/question?id=' + this.data.answer.question.id
      })
    }
  },

  // 点赞
  toggleLike: function () {
    var that = this;

    if (!wx.getStorageSync('token')) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    if (this.data.isLiked) {
      // 取消点赞
      api.answer.unliked(this.data.answerId)
        .then(function () {
          that.setData({
            isLiked: false,
            'answer.like_count': that.data.answer.like_count - 1
          });
        })
        .catch(function (err) {
          console.error('取消点赞失败:', err);
        });
    } else {
      // 点赞
      api.answer.like(this.data.answerId)
        .then(function () {
          that.setData({
            isLiked: true,
            'answer.like_count': that.data.answer.like_count + 1
          });
          wx.showToast({ title: '点赞成功', icon: 'success' });
        })
        .catch(function (err) {
          console.error('点赞失败:', err);
        });
    }
  },

  // 感谢
  toggleThank: function () {
    var that = this;

    if (!wx.getStorageSync('token')) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    if (this.data.isThanked) {
      wx.showToast({ title: '已感谢', icon: 'none' });
      return;
    }

    api.answer.thank(this.data.answerId)
      .then(function () {
        that.setData({
          isThanked: true,
          'answer.thank_count': that.data.answer.thank_count + 1
        });
        wx.showToast({ title: '感谢成功', icon: 'success' });
      })
      .catch(function (err) {
        console.error('感谢失败:', err);
      });
  },

  // 收藏
  toggleCollect: function () {
    var that = this;

    if (!wx.getStorageSync('token')) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    if (this.data.isCollected) {
      // 取消收藏
      api.answer.uncollect(this.data.answerId)
        .then(function () {
          that.setData({
            isCollected: false,
            'answer.collect_count': that.data.answer.collect_count - 1
          });
          wx.showToast({ title: '已取消收藏', icon: 'none' });
        })
        .catch(function (err) {
          console.error('取消收藏失败:', err);
        });
    } else {
      // 收藏
      api.answer.collect(this.data.answerId)
        .then(function () {
          that.setData({
            isCollected: true,
            'answer.collect_count': that.data.answer.collect_count + 1
          });
          wx.showToast({ title: '收藏成功', icon: 'success' });
        })
        .catch(function (err) {
          console.error('收藏失败:', err);
        });
    }
  },

  // 查看评论
  viewComments: function () {
    wx.showToast({
      title: '评论功能开发中',
      icon: 'none'
    });
  },

  // 没有帮助
  reportNotHelpful: function () {
    wx.showToast({
      title: '反馈功能开发中',
      icon: 'none'
    });
  }
})
