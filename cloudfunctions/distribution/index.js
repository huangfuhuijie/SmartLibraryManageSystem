// 云函数入口文件
const table = "Records";
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var _id = event._id;
  try {
    return await db.collection(table).doc(_id).update({
      data: {
        counter: event.counter,
        status:event.status,
      }
    });
  } catch (e) {
    console.error(e)
  }
}