const db = wx.cloud.database();
const _ = db.command;

//*查询数据库 当前openid 在数据库中的money*/
export const  getSliderList= (openid) =>{
  return new Promise((resolve, reject) => {
    console.log("openid", openid);
    // 查询当前用户所有的 counters
    db.collection('customer_inf').where({
      _openid: openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: money', res);
         resolve(res);
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

/*更新当前账户的余额 */
export const synDB=(bal,_id)=>{
  return new Promise((resolve, reject) => {
  db.collection('customer_inf').doc(_id).update({
    data: {
      money: _.set(bal)
    },
    success: res => {
      console.log('[数据库] [更新记录]bal 成功：', bal);
      resolve(res);
    },
    fail: err => {
      icon: 'none',
        console.log('[数据库] [更新记录] 失败：', err)
      reject(err);
    }
  })
})
}

/*更新库存 传入单个商品id*/
 export const  synStock = (goodid) =>{
   return new Promise((resolve, reject)=>{
     console.log("synStock ",goodid);
    db.collection('goods').where({
      goods_id: Number(goodid)
      }).get({
        success: res => {
         resolve(res);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err);
          reject(err);
        }
      })
   })
  }

/**更新库存 */
export const updataStock = (temp, goods_number)=>{
  return new Promise((resolve, reject) => {
    const stock = temp.data[0].goods_stock - goods_number;
    const _id = temp.data[0]._id;
    console.log("stock", stock);
    console.log("temp.data[0]._id", temp.data[0]._id);
    db.collection('goods').doc(_id).update({
    data: {
      goods_stock: _.set(stock)
    },
    success: res => {
      console.log('[数据库] [更新记录]成功：goods_stock', res);
      resolve(res);
    },
    fail: err => {
      icon: 'none',
      console.log('[数据库] [更新记录] 失败：', err)
      reject(err);
    }
  })
  })
}