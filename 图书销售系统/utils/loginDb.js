const db = wx.cloud.database();
const _ = db.command;

/**获取openid */
export const onGetOpenid=()=> {
  return new Promise((resolve, reject)=> {
    // 调用云函数  找openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        resolve(res);
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        reject(err);
      }
    })
  })
}

/* 若是用户是新用户 则 自动添加用户，填入信息 */
export const query=(_openid)=>{
  console.log("_openid", _openid);
  return new Promise((resolve, reject) => {
  db.collection('customer_inf').where({
    _openid: _openid
  }).get({
    success: res => {
      console.log('[数据库] [查询记录] 成功: ', res);
      resolve(res);
    },
    fail: err => {
      console.error('[数据库] [查询记录] 失败：', err)
      reject(err);
    }
  })
  })
}/* end*/

export const addInfor = (userInfo) => { 
  return new Promise((resolve, reject) => {
    db.collection("customer_inf").add({
      data: {
        money: 0,
        userInfo:userInfo
      }
    }).then(res => {
      wx.setStorageSync("money", 0);
      resolve(res);
    });
  })
}