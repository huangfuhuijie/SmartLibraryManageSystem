const app = getApp();
const dataBase = require("../../dataBase/dataBase.js");
Page({
  data: {
    dataArray: [
      {
        title: '书名',      //第一组是名称，方便显示
        content: '名称'
      },
      {
        title: '状态',
        content: "",
      },
      {
        title: '申请日期',
        content: ''
      },
      {
        title: '柜号',
        content: ''
      }
    ],
    data:Object,
    mode:0,
    array:[1,2,3,4,5,6,7,8,9,10,11,12],
  },

  onLoad: function (options) {
    console.log(options.det);
    var det = JSON.parse(options.det);
    var data = this.data.dataArray;
    data[0].content = det.bookName;
    if(det.status==0) {
      data[1].content = "未受理";
    }
    if (det.status == 1) {
      data[1].content = "处理中";
    }
    if (det.status == 2) {
      data[1].content = "已入柜";
    }
    if (det.status == 3) {
      data[1].content = "已结束";
    }
    data[2].content = det.date;
    if (det.counter != -1) {
      data[3].content = det.counter;
    } else {
      data[3].content ="未分配柜号";
    }
    this.setData({
      dataArray: data,
      mode: app.globalData.managerMode,
      data:det,
    })
  },
  onShow: function () {
  },
  accept:function(){
    wx.showToast({
      title: '正在发送请求',
      icon: "loading",
    })
    var data = this.data.data;
    data.status = 1;
    //console.log(data);
    dataBase.accept(data).then(function(res){
      console.log(res);
      wx.showToast({
        title: '受理成功',
        icon: "success",
        duration: 1000,
      });
      wx.navigateBack();
    })
  },
  bindPickerChange:function(e){
    wx.showToast({
      title: '正在发送请求',
      icon: "loading",
    })
    console.log(e);
    
    var that = this;
    var data = this.data.data;
    data.counter = Number(e.detail.value)+1;
    console.log(data.counter);
    data.status = 2;
    dataBase.distribution(data).then(function(res){
      wx.showToast({
        title: '受理成功',
        icon: "success",
        duration: 1000,
      });
      var dat = that.data.dataArray;
      dat[3].content = data.counter;
      dat[1].content = "已入柜",
      that.setData({
        dataArray:dat,
      })
    })
  },
  open:function(){
    var counter_num = Number(this.data.data.counter);
    if(counter_num==-1)
    {
      wx.showToast({
        title: '错误，没有柜号',
        icon: "none",
      })
      return;
    }
    var order = {
      source: "WeChat",
      index: counter_num,
    }
    order = JSON.stringify(order);
    if(this.data.mode==0)//用户模式
    {
      var that = this;
      wx.showModal({
        title: '开柜',
        content: '开柜机会只有一次，请确认',
        success(res) {
          if (res.confirm) {
            wx.showToast({
              title: '正在发送请求',
              icon: "loading",
            })
            dataBase.assignOrder(order).then(function(res){
              console.log(res);
            })
            dataBase.finish(that.data.data).then(function (res) {
              wx.showToast({
                title: '受理成功',
                icon: "success",
                duration: 1000,
              });
              wx.navigateBack();
            })
            console.log(counter_num);
            //开柜函数调用
          } else if (res.cancel) {
          }
        }
      })
    }else{
      var that = this;
      wx.showModal({
        title: '开柜',
        content: '确认开柜吗',
        success(res) {
          if (res.confirm) {
            wx.showToast({
              title: '正在发送请求',
              icon: "loading",
            })
            dataBase.assignOrder(order).then(function (res) {
              console.log(res);
              wx.showToast({
                title: '受理成功',
                icon: "success",
                duration: 1000,
              });
            })
            //开柜函数调用
          } else if (res.cancel) {
          }
        }
      })
    }
  }
})