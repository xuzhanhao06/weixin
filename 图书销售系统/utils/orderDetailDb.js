const db = wx.cloud.database();
const _ = db.command;

/**promise 形式 getOrdersList  orderDetail 订单详情*/
export const getOrdersList = (id) => {
  return new Promise((resolve, reject) => {
    // console.log(id);
    const order_number = id;
    db.collection('CustOrder').where({
      order_number: order_number
    }).get({
      success: res => {
        resolve(res); console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        reject(err); console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  })
}


/**确认收货 */
export const updataReceiving = (_id) => {
  return new Promise((resolve, reject) => {
    db.collection('CustOrder').doc(_id).update({
      data: {
        isReceiving: true
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '收货成功',
        })
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

/**获取用户余额 退款时用 */
export const getCustomerInf = (_openid) => {
  return new Promise((resolve, reject) => {
    db.collection('customer_inf').where({
      _openid: _openid
    }).get({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}