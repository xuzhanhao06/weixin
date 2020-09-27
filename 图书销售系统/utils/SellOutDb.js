const db = wx.cloud.database();
const _ = db.command;

export const getGoods = (n) => {
  return new Promise((resolve, reject) => {
    db.collection('goods').limit(4).skip(n * 4).where({
      goods_stock: _.lte(0)
    }).get({
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
/*更新当前商品的库存 */
export const synDB = (number,_id) => {
  return new Promise((resolve, reject) => {
    db.collection('goods').doc(_id).update({
      data: {
        goods_stock: _.set(Number(number))
      },
      success: res => {
        wx.showToast({
          title: '更新库存成功',
        })
        resolve(res);
      },
      fail: err => {
        icon: 'none',
        reject(err);
      }
    })
  })
}