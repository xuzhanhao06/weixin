const db = wx.cloud.database();
const _ = db.command;

export const isAdmin = (_openid) => {
  // console.log("_openid", _openid);
  return new Promise((resolve, reject) => {
    db.collection('Admin').where({
      _openid:_openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res);
        resolve(res);
      },
      fail: error => {
        console.error('[数据库] [查询记录] 失败：', error)
        reject(error);
      }
    })
  })
}