// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数 管理员修改金额时 用到 以及退款时 用到
exports.main = async (event, context) => {
  try {
    return await db.collection("customer_inf").doc(event._id).update({
      data: {
        money: event.money
      }
    })
  } catch (e) {
    console.error(e)
  }
}