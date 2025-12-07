//question.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()

Page({
  data: {
    questionId: null,
    question: null,
    answers: [],
    page: 1,
    hasMore: true,
    isFollowing: false
  },

  onLoad: function (options) {
    console.log('onLoad', options)
    var that = this

    // 获取问题ID
    if (options.id) {
      that.setData({ questionId: options.id });
      that.loadQuestionDetail(options.id);
      that.loadAnswers(options.id);
    }
  },

  // 加载问题详情
  loadQuestionDetail: function (id) {
    var that = this;
    api.question.getDetail(id)
      .then(function (data) {
        console.log('问题详情:', data);
        that.setData({
          question: data,
          isFollowing: data.is_following
        });
      })
      .catch(function (err) {
        console.error('获取问题详情失败:', err);
      });
  },

  // 加载回答列表
  loadAnswers: function (questionId) {
    var that = this;
    api.answer.getListByQuestion(questionId, this.data.page, 10)
      .then(function (data) {
        console.log('回答列表:', data);
        that.setData({
          answers: data.list,
          hasMore: data.has_more
        });
      })
      .catch(function (err) {
        console.error('获取回答列表失败:', err);
      });
  },

  // 点击回答，跳转到回答详情
  bindItemTap: function (e) {
    const answerId = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '../answer/answer?id=' + answerId
    })
  },

  // 关注问题
  toggleFollow: function () {
    var that = this;
    var questionId = this.data.questionId;

    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    if (this.data.isFollowing) {
      // 取消关注
      api.question.unfollow(questionId)
        .then(function () {
          that.setData({ isFollowing: false });
          that.setData({
            'question.follow_count': that.data.question.follow_count - 1
          });
          wx.showToast({ title: '已取消关注', icon: 'none' });
        })
        .catch(function (err) {
          console.error('取消关注失败:', err);
        });
    } else {
      // 关注
      api.question.follow(questionId)
        .then(function () {
          that.setData({ isFollowing: true });
          that.setData({
            'question.follow_count': that.data.question.follow_count + 1
          });
          wx.showToast({ title: '关注成功', icon: 'success' });
        })
        .catch(function (err) {
          console.error('关注失败:', err);
        });
    }
  },

  // 写回答
  writeAnswer: function () {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    // TODO: 跳转到写回答页面
    wx.showToast({
      title: '写回答功能开发中',
      icon: 'none'
    });
  },

  // 邀请回答
  inviteAnswer: function () {
    wx.showToast({
      title: '邀请功能开发中',
      icon: 'none'
    });
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({ page: 1, answers: [] });
    that.loadQuestionDetail(that.data.questionId);
    that.loadAnswers(that.data.questionId);
    wx.stopPullDownRefresh();
  },

  // 加载更多
  onReachBottom: function () {
    if (!this.data.hasMore) {
      return;
    }
    var that = this;
    var nextPage = that.data.page + 1;

    api.answer.getListByQuestion(that.data.questionId, nextPage, 10)
      .then(function (data) {
        that.setData({
          answers: that.data.answers.concat(data.list),
          page: nextPage,
          hasMore: data.has_more
        });
      })
      .catch(function (err) {
        console.error('加载更多回答失败:', err);
      });
  }
})
