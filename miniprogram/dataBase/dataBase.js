const table = "Records";
const db = wx.cloud.database()
var addRecord = function(data)
{
  return new Promise(function(resolve,reject){
    db.collection(table).add({
      data: data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        resolve(res);
      },
      fail: err => {
        reject(res);
      }
    })
  })
}
var queryRecord = function(_openid)
{
  const _ = db.command
  if(_openid==-1)
  {
    return new Promise(function (resolve, reject) {
      db.collection(table).where({
        status: _.gte(0).and(_.lte(4))
      }).get({
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          resolve(res);
        },
        fail: err => {
          reject(res);
        }
      })
    }) }
  else{
    return new Promise(function (resolve, reject) {
      db.collection(table).where({
        _openid: _openid
      }).get({
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          resolve(res);
        },
        fail: err => {
          reject(res);
        }
      })
    })
  }
}
var removeRecord = function(id){
  return new Promise(function(resolve,reject){
    db.collection('Records').doc(id).remove({
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        resolve(res);
      },
      fail: err => {
        reject(res);
      }
    })
  })
}
var changeStatus = function (id,stat) {
  return new Promise(function (resolve, reject) {
    db.collection('Records').doc(id).update({
      data:{
        status:stat,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        resolve(res);
      },
      fail: err => {
        reject(res);
      }
    })
  })
}
var accept = function(data){
  return new Promise(function(resolve,reject){
    wx.cloud.callFunction({
      name: "accept",
      data: data,
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
}
var distribution = function(data){
  return new Promise(function (resolve, reject) {
    wx.cloud.callFunction({
      name: "distribution",
      data: data,
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
}
var finish = function (data) {
  return new Promise(function (resolve, reject) {
    wx.cloud.callFunction({
      name: "finish",
      data: data,
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
}
var assignOrder = function (order) {//下发命令
  var id = "537839185";
  var APIKey = "C4zI7zdsHmRrZy6wXZ=iKfC2mQY=";
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://api.heclouds.com/cmds?device_id=' + id,
      data: order,
      header: {
        //设置参数内容类型为json
        'content-type': 'application/json',
        'api-key': APIKey,
      },
      method: 'POST',
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
}
module.exports = {
  addRecord,
  queryRecord,
  removeRecord,
  changeStatus,
  accept,
  distribution,
  finish,
  assignOrder,
}
