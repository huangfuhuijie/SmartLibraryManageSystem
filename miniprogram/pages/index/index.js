//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  managerMode:function(){
    wx.showToast({
      title: '管理员模式',
      icon: "success",
      duration: 1000,
    });
    app.globalData.managerMode = !app.globalData.managerMode;
  },

  onGetOpenid: function () {
    wx.showToast({
      title: '正在发送请求',
      icon: "loading",
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.showToast({
          title: '登陆成功',
          icon: "success",
          duration: 1000,
        });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '登陆失败',
          icon: "none",
          duration: 1000,
        });
      }
    })
  },
  records:function(){
    if(app.globalData.openid==undefined||app.globalData.openid=='')
    {
      wx.showToast({
        title: '请先登陆',
        icon: "none",
        duration: 1000,
      });
    }else{
      wx.navigateTo({
        url: '../records/records',
      })
    }
  }

})
