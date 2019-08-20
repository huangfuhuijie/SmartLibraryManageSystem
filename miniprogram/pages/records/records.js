
//获取应用实例
const app = getApp()
const dataBase = require("../../dataBase/dataBase.js");
Page({
    data: {
        dataArray: [],
        managerMode:0,
    },

    onLoad: function () {
        
    },

    onShow: function(){
       this.setData({
         managerMode:app.globalData.managerMode,
      })
      this.refreshData();
    },

    onPullDownRefresh: function () {
      this.refreshData();
    },

    refreshData: function() {
      var that = this;
      if(this.data.managerMode==1)
      {
        dataBase.queryRecord(-1).then(function (res) {
          console.log(res)
          that.setData({
            dataArray: res.data,
          })
          wx.stopPullDownRefresh()
        })
      }else{
        dataBase.queryRecord(app.globalData.openid).then(function (res) {
          that.setData({
            dataArray: res.data,
          })
          wx.stopPullDownRefresh();
        })
      }
    },

    showInfo: function (e) {
      var det = this.data.dataArray[e.currentTarget.dataset.index];
      wx.navigateTo({ url: "/pages/detail/detail?det="+JSON.stringify(det) });
    },

    edit: function (e) {
      var that = this;
      wx.showModal({
        title: '删除',
        content: '确认删除吗',
        success(res) {
          if (res.confirm) {
            wx.showToast({
              title: '正在发送请求',
              icon: "loading",
            })
            var id = that.data.dataArray[e.currentTarget.dataset.index]._id;
            console.log(id);
            dataBase.removeRecord(id).then(function (res) {
              console.log(res);
              if (res.errMsg.includes("document.remove:ok")) {
                wx.showToast({
                  title: '删除成功',
                  icon: "success",
                  duration: 1000,
                });
              } else {
                wx.showToast({
                  title: '申请失败',
                  icon: "none",
                  duration: 1000,
                });
              }
              that.refreshData();
            });
          } else if (res.cancel) {
          }
        }
      })
    },

    addDevice: function () {
         wx.navigateTo({ url: '/pages/addRecord/addRecord' })
    }
})
