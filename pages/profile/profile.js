var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

Page({
    data: {
        userInfo: null,
        loading: true
    },

    onLoad: function (options) {
        if (options.id) {
            this.loadProfile(options.id);
        } else {
            this.loadMyProfile();
        }
    },

    loadProfile: function (id) {
        var that = this;
        api.user.getProfile(id).then(function (data) {
            that.setData({
                userInfo: data,
                loading: false
            });
            wx.setNavigationBarTitle({
                title: data.nickname + '的主页'
            });
        }).catch(function (err) {
            console.error('Failed to load profile', err);
            wx.showToast({ title: '加载失败', icon: 'none' });
        });
    },

    loadMyProfile: function () {
        var that = this;
        api.user.getMe().then(function (data) {
            that.setData({
                userInfo: data,
                loading: false
            });
            wx.setNavigationBarTitle({
                title: '我的主页'
            });
        }).catch(function (err) {
            console.error('Failed to load my profile', err);
            wx.showToast({ title: '加载失败', icon: 'none' });
        });
    }
})
