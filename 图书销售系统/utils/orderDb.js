const db = wx.cloud.database();

/** 全部订单 获取当前用户CustOrder数据库订单*/
export const getCustOrder = (_openid,n)=> {
  return new Promise((resolve, reject) => {
  // 查询当前用户所有的 counters
  db.collection('CustOrder').orderBy('createTime', 'desc').skip(n*6).limit(6).where({
    _openid: _openid
  }).get({
    success: res => {
      resolve(res);
      console.log('[数据库] [查询记录] 成功:', res);
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      });
      console.error('[数据库] [查询记录] 失败：', err);
      reject(err);
    }
  })
  })
}

//已处理订单 也就是待收货
export const getDealOrder = (_openid, isDeal) => {
  return new Promise((resolve, reject) => {
    db.collection('CustOrder').orderBy('createTime', 'desc').where({
      _openid: _openid,
      isDeal: isDeal,
      isReceiving: false
    }).get({
      success: res => {   
        resolve(res);
      },
      fail:err =>{
        reject(err);
      }
    })
  })
  }

//获取已收货的订单
export const getReceiOrder = (_openid) => {
  return new Promise((resolve, reject) => {
    db.collection('CustOrder').orderBy('createTime', 'desc').where({
      _openid: _openid,
      isReceiving: true
    }).get({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
    // .then()
    // .catch(console.error)
  })
}