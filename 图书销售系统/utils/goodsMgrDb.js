const db = wx.cloud.database();
const _ = db.command;
/**查询商品 */
export const getGoods= (n)=> {
  return new Promise((resolve, reject) => {
    db.collection('goods').orderBy('goods_id', 'desc').limit(5).skip(n * 5).where({
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

/**上传图片 */
export const uploadFile = (filePath)=>{
  return new Promise((resolve) => {
  let suffix = /\.\w+$/.exec(filePath)[0];
    // var filePath = res.tempFilePaths[0];
    const uploadTask = wx.cloud.uploadFile({
      cloudPath: "goods/" + new Date().getTime() + suffix,
      filePath: filePath,
      success: function (res) {
        console.log(res);
        resolve(res);
      }
    });
    //  上传的百分比
    // uploadTask.onProgressUpdate(function (callback) {
    //   console.log(callback);
    // })
    
  })
}


//删除图片
export const deleteFile = (fileID) => {
  return new Promise((resolve) => {
wx.cloud.deleteFile({
  fileList: [fileID],
  success: res => {
  //  console.log(res.fileList)
    resolve();
  },
  fail: console.error
})
  })
}