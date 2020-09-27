const db = wx.cloud.database();
const _ = db.command;
/**查询用户信息 */
export const getuserInfor = (n) => {
  return new Promise((resolve, reject) => {
    db.collection('customer_inf').limit(6).skip(n*6).get({
      success: res => {
        resolve(res);
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
        reject(err);
      }
    })
  })
}