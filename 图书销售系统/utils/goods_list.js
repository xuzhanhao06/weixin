const db = wx.cloud.database();
const _ = db.command;

//查询数据库
export const getSearchList = (search,n)=> {
  return new Promise((resolve, reject) => {
  // console.log("这是查询的e", e);
    db.collection("goods").limit(6).skip(n*6).where({	 	//collectionName 表示欲模糊查询数据所在collection的名
    'goods_title': db.RegExp({
      regexp: search,
      //从搜索栏中获取的value作为规则进行匹配。
      options: 'i',
      //大小写不区分
    }),
    goods_stock: _.gt(0)
  }).get({
    success: res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      db.collection('goods').orderBy('goods_price', 'asc').limit(6).skip(n*6).where({
        goods_stock: _.gt(0),
        goods_title: {								//goods_title表示欲模糊查询数据所在列的名
          $regex: '.*' + search + '.*',		//‘.*’等同于SQL中的‘%’
          $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
        }
      }).get({
        success: res2 => {
          res.goodsPr = res2.data;
          resolve(res);
        } 
      })
      
    },
    })
  })
}

//按分类 查询数据库
export const getSliderList = (goods_classify,n)=> {
  return new Promise((resolve, reject) => {
  // console.log("这是查询的e", e);
  // 查询当前用户所有的 counters
  db.collection('goods').limit(6).skip(n*6).where({
    goods_classify: goods_classify,
    goods_stock: _.gt(0)
  }).get({
    success: res => {
      db.collection('goods').orderBy('goods_price', 'asc').limit(6).skip(n*6).where({
        goods_classify: goods_classify,
        goods_stock: _.gt(0)
      }).get({
        success: res2 => {
          res.goodsPr = res2.data;
          resolve(res);
        }
      }
      )
        .then()
        .catch(console.error)
      console.log('[数据库] [查询记录] 成功: ', res);
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      });
      reject(err);
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
  })
}