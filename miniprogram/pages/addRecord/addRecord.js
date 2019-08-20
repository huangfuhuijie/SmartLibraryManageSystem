// pages/add/add.js
const dataBase = require("../../dataBase/dataBase.js");
Page({
  data: {
    bookName: '',
    disabled: true
  },

  onLoad: function (options) {

  },

  add: function () {
    
    wx.showToast({
      title: '正在发送请求',
      icon: "loading",
    })
    var today = new Date();
    var date = "" + today.getFullYear() + (today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + (today.getDate() < 10 ? ("0" + today.getDate()) : today.getDate());
    console.log(date);
    var record = {
      bookName:this.data.bookName,
      status:0,
      counter:-1,
      date:date,
    }
    dataBase.addRecord(record).then(function(res){
      console.log(res);
      if (res.errMsg.includes("collection.add:ok"))
      {
        wx.showToast({
          title: '申请成功',
          icon: "success",
          duration: 1000,
        });
        wx.navigateBack();
      }
      else{
        wx.showToast({
          title: '申请失败',
          icon: "none",
          duration: 1000,
        });
      }
    })
  },

  editName: function (e) {
    this.data.bookName = e.detail.value
    this.setData({ disabled: this.isFinish() })
  },

  isFinish: function () {
    return !(this.data.bookName.length > 0)
  }
})