//more.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()

Page({
  data: {
    isLoggedIn: false,
    userInfo: null
  },

  onLoad: function () {
    console.log('onLoad')
    this.checkLoginStatus();
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    var token = wx.getStorageSync('token');
    var userInfo = wx.getStorageSync('userInfo');

    if (token && userInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo: userInfo
      });
    } else {
      this.setData({
        isLoggedIn: false,
        userInfo: null
      });
    }
  },

  // 登录
  handleLogin: function () {
    var that = this;

    // 模拟微信登录
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('微信登录成功，code:', res.code);

          // 调用后端登录API
          api.auth.login(res.code)
            .then(function (data) {
              console.log('后端登录成功:', data);

              // 保存token和用户信息
              wx.setStorageSync('token', data.token);
              wx.setStorageSync('userInfo', data.user);

              that.setData({
                isLoggedIn: true,
                userInfo: data.user
              });

              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });
            })
            .catch(function (err) {
              console.error('后端登录失败:', err);
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              });
            });
        } else {
          console.error('微信登录失败:', res.errMsg);
        }
      },
      fail: function (err) {
        console.error('wx.login失败:', err);
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 退出登录
  handleLogout: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');

          that.setData({
            isLoggedIn: false,
            userInfo: null
          });

          wx.showToast({
            title: '已退出登录',
            icon: 'none'
          });
        }
      }
    });
  },

  // 查看个人主页
  viewProfile: function () {
    if (!this.data.isLoggedIn) {
      this.handleLogin();
      return;
    }
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  // 我的关注
  goToFollowing: function () {
    if (!this.data.isLoggedIn) {
      this.handleLogin();
      return;
    }
    wx.navigateTo({
      url: '../list/list?type=following&title=我的关注'
    });
  },

  // 我的收藏
  goToCollections: function () {
    if (!this.data.isLoggedIn) {
      this.handleLogin();
      return;
    }
    wx.navigateTo({
      url: '../list/list?type=collections&title=我的收藏'
    });
  },

  // 最近浏览
  goToHistory: function () {
    if (!this.data.isLoggedIn) {
      this.handleLogin();
      return;
    }
    wx.navigateTo({
      url: '../list/list?type=history&title=最近浏览'
    });
  }
})