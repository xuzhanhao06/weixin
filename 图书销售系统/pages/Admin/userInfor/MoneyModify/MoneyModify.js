// pages/Admin/userInfor/MoneyModify/MoneyModify.js
Page({
  data: {
    userInfo:[],
    money:"",
  },
  onLoad: function (options) {
    console.log("options", options);
    this.setData({
      userInfo: options
    })
  },
  handleTextInput(e){
    console.log(e.detail.value);
    this.setData({
      money: e.detail.value
    })
  },
  bindMoney(){
        // const db = wx.cloud.database();
        // const _ = db.command;
    wx.showLoading({
      title: '正在修改中~~~',
      mask: true
    });
    wx.cloud.callFunction({
      name: 'MoneyModify',
      data: {
        _id:this.data.userInfo._id,
        money: this.data.money
      },
      success: res => {
        wx.hideLoading();
      wx.showToast({
        title: '余额更新成功',
      });
      wx.navigateBack({
        delta: 1,
      });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})