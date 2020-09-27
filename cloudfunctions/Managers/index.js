// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("Admin").add({
      data: {
        name: event.name,
        _openid: event.openid
      }
    })
  } catch (e) {
    console.error(e)
  }
}

// exports.main = async (event, context) => {
//   try {
//     return await db.collection("Admin").doc("6af880a55ec340d30107c68d74462ec2").update({
//       data: {
//         name: event.name,
//         _openid: event.openid,
//       }
//     })
//   }catch(e) {
//     console.error(e)
//   }
// }
