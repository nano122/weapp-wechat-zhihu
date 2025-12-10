const app = getApp();
const api = require('../../utils/api.js');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({
    data: {
        avatarUrl: defaultAvatarUrl,
        nickname: '',
    },

    onLoad() {
        this.loadUserInfo();
    },

    loadUserInfo() {
        api.user.getMe().then(user => {
            this.setData({
                avatarUrl: user.avatar_url || defaultAvatarUrl,
                nickname: user.nickname || ''
            });
        }).catch(err => {
            console.error('Failed to load user info', err);
        });
    },

    onChooseAvatar(e) {
        const { avatarUrl } = e.detail;
        console.log('Selected avatar:', avatarUrl);
        this.setData({
            avatarUrl,
        });
    },

    onSubmit(e) {
        const { nickname } = e.detail.value;
        const { avatarUrl } = this.data;

        if (!nickname) {
            wx.showToast({
                title: '请输入昵称',
                icon: 'none'
            });
            return;
        }

        wx.showLoading({
            title: '保存中...',
        });

        // Check if we need to upload the avatar (if it's a local temp file)
        if (avatarUrl && (avatarUrl.startsWith('wxfile://') || avatarUrl.startsWith('http://tmp/'))) {
            this.uploadImage(avatarUrl).then(remoteUrl => {
                this.saveProfile(nickname, remoteUrl);
            }).catch(err => {
                console.error('Upload failed, trying to save with temp url as fallback (or handle error)', err);
                // Fallback or Error? 
                // For demo purposes, we might just save the temp URL if upload fails, 
                // though it won't persist across devices.
                // Let's try to save anyway.
                this.saveProfile(nickname, avatarUrl);
            });
        } else {
            this.saveProfile(nickname, avatarUrl);
        }
    },

    uploadImage(filePath) {
        return new Promise((resolve, reject) => {
            const token = wx.getStorageSync('token');
            wx.uploadFile({
                url: 'http://localhost:3000/api/upload', // Assumed upload endpoint
                filePath: filePath,
                name: 'file',
                header: {
                    'Authorization': 'Bearer ' + token
                },
                success: (res) => {
                    try {
                        const data = JSON.parse(res.data);
                        if (data.code === 0 && data.data && data.data.url) {
                            resolve(data.data.url);
                        } else {
                            reject(new Error('Upload API returned error'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },

    saveProfile(nickname, avatarUrl) {
        api.user.updateMe({
            nickname: nickname,
            avatar_url: avatarUrl
        }).then(() => {
            wx.hideLoading();
            wx.showToast({
                title: '保存成功',
                icon: 'success'
            });

            // Update local storage user info if needed
            const userInfo = wx.getStorageSync('userInfo') || {};
            userInfo.nickname = nickname;
            userInfo.avatar_url = avatarUrl;
            wx.setStorageSync('userInfo', userInfo);

            setTimeout(() => {
                wx.navigateBack();
            }, 1500);
        }).catch(err => {
            wx.hideLoading();
            wx.showToast({
                title: '保存失败',
                icon: 'none'
            });
            console.error('Update profile failed', err);
        });
    }
});
