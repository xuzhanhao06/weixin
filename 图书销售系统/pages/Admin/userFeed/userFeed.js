// pages/Admin/userFeed/userFeed.js
Page({
  data: {
    Feedback:[],
    impleNumber: 0, //触底 执行次数
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中',
    })
    this.getFeedback(0);
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    this.setData({
      Feedback: [],
      impleNumber: 0, //触底 执行次数
    })
    this.onLoad();
  },
  async onReachBottom() {
    wx.showLoading({
      title: '正在加载中',
    })
    this.getFeedback(this.data.impleNumber + 1);
    this.setData({
      impleNumber: this.data.impleNumber + 1
    })
  },
 getFeedback(n){
   const db = wx.cloud.database();
   db.collection('Feedback').orderBy('time', 'desc').limit(8).skip(n * 8).where({}).get({
     success: res => {
        this.setData({
          Feedback: this.data.Feedback.concat(res.data) 
        })
       wx.hideLoading();
       if (!res.data.length){
          wx.showToast({
            title: '已经到底啦！',
          })
       }
       console.log("feed",res)
     },
     fail: err => {
       console.error('[数据库] [查询记录] 失败：', err)
     }
   })
 }


})