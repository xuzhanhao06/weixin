const db = wx.cloud.database();
const _ = db.command;

//getOrdersList 获取全部订单 在进行判断是否处理过
export const  getOrdersList=(n)=> {
  return new Promise((resolve, reject) => {
  db.collection('CustOrder').limit(5).skip(n * 5).where({
  }).get({
    success: res => {
      resolve(res); 
      console.log('[数据库] [查询记录] 成功: ', res);
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      reject(err); 
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
  })
}