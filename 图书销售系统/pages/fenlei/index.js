// pages/fenlei/index.js
Page({
  data: {
     // goods:[], 
    fiction: [], //科幻类
    education: [],//教育类
    daily: [], //生活类
    other: [], //其他类
  },
  onLoad:function (options) {
    wx.showLoading({
      title: '正在加载中',
      mask: true
    });
    this.getSliderList("科幻");
    this.getSliderList("教育");
    this.getSliderList("生活");
    this.getSliderList("其他");
  },
  //getSliderList 查询数据库获取数据库的书
  getSliderList: function (e) {
    console.log("这是查询的e",e);
    const db = wx.cloud.database();
    const _ = db.command;
    // 查询当前用户所有的 counters
    db.collection('goods').limit(5).where({
      goods_classify:e,
      goods_stock: _.gt(0)
    }).get({
      success: res => {
        switch(e){
          case "科幻": this.setData({ fiction: res.data});break;
          case "教育": this.setData({ education: res.data }); break;
          case "生活": this.setData({ daily: res.data }); break;
          default: this.setData({ other: res.data }); break;
        }
        console.log('[数据库] [查询记录] 成功: ', res);
        wx.hideLoading();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})