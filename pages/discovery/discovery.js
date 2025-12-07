//discovery.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

Page({
  data: {
    navTab: ["推荐", "热门", "收藏"],
    currentNavtab: "0",
    imgUrls: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    feed: [],
    feed_length: 0,
    page: 1,
    hasMore: true
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    this.loadBanners();
    this.refresh();
  },

  switchTab: function (e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      currentNavtab: idx,
      page: 1,
      feed: []
    });
    this.loadTabData(idx);
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

  // 加载轮播图
  loadBanners: function () {
    var that = this;
    api.discovery.getBanners()
      .then(function (banners) {
        console.log('获取轮播图成功:', banners);
        that.setData({
          imgUrls: banners.map(b => b.image_url)
        });
      })
      .catch(function (err) {
        console.error('获取轮播图失败:', err);
      });
  },

  // 加载Tab数据
  loadTabData: function (tabIdx) {
    var that = this;
    var apiCall;

    if (tabIdx == "0") {
      // 推荐
      apiCall = api.discovery.getRecommend(this.data.page, 10);
    } else if (tabIdx == "1") {
      // 热门
      apiCall = api.discovery.getHot(this.data.page, 10);
    } else {
      // 收藏（需要登录）
      apiCall = api.userCenter.getMyCollections(this.data.page, 10);
    }

    apiCall.then(function (data) {
      console.log('获取Tab数据成功:', data);
      that.setData({
        feed: data.list,
        feed_length: data.list.length,
        hasMore: data.has_more
      });
    })
      .catch(function (err) {
        console.error('获取Tab数据失败:', err);
      });
  },

  // 刷新
  refresh: function () {
    var that = this;
    that.setData({ page: 1 });
    this.loadTabData(this.data.currentNavtab);
  },

  // 加载更多
  nextLoad: function () {
    var that = this;
    var nextPage = that.data.page + 1;
    var apiCall;

    if (this.data.currentNavtab == "0") {
      apiCall = api.discovery.getRecommend(nextPage, 10);
    } else if (this.data.currentNavtab == "1") {
      apiCall = api.discovery.getHot(nextPage, 10);
    } else {
      apiCall = api.userCenter.getMyCollections(nextPage, 10);
    }

    apiCall.then(function (data) {
      console.log('加载更多成功:', data);
      that.setData({
        feed: that.data.feed.concat(data.list),
        feed_length: that.data.feed_length + data.list.length,
        page: nextPage,
        hasMore: data.has_more
      });
    })
      .catch(function (err) {
        console.error('加载更多失败:', err);
      });
  }
});
