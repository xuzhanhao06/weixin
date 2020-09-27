const db = wx.cloud.database();
const _ = db.command;

export const getswiperdata = (swiperdata)=> {
  return new Promise((resolve, reject) => {
     db.collection('swiper').where({
      mark: "images"
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        resolve(res);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        });
        reject(err);
      }
    })
   })
  }
/**查询热门推荐的商品 */
export const getGoods = (n) => {
  return new Promise((resolve, reject) => {
    db.collection('goods').limit(4).skip(n*4).where({
      isRecommend:"true",
      goods_stock: _.gt(0)
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