
const db = wx.cloud.database();
const _ = db.command;
/**查询卡号信息 */
export const getRechargeCard = (card) => {
  return new Promise((resolve, reject) => {
    db.collection('RechargeCard').where({
      _id: card
    }).get({
      success: res => {
        resolve(res); 
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '卡号不存在或输入错误'
        })
        reject(err);
      }
    })
  })
}

/**更新余额 ==充值 */
export const recharge = (money,_id) => {
  return new Promise((resolve, reject) => {
    db.collection('customer_inf').doc(_id).update({
    data: {
      money: money
    },
    success: function (res) {
      
      resolve(res); 
    },
    fail: function (error) {
      reject(error); 
    }
  })
  })
}
