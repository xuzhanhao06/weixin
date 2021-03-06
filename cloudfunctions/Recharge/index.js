// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("RechargeCard").doc(event._id).remove({
      success: console.log,
      fail: console.error
    })
  } catch (e) {
    console.error(e)
  }
}

// exports.main = async (event, context) => {
//   try {
//     return await db.collection("RechargeCard").add({
//       data:{
//         tt:event._id
//       }
//     })
//   } catch (e) {
//     console.error(e)
//   }
// }