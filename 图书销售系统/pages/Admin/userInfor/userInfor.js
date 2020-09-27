import { getuserInfor } from "../../../utils/userInfor.js";
Page({

  data: {
    userInfor:[],
    impleNumber: 0, //触底 执行次数
  },
  onShow:async function (options) {
   const temp= await getuserInfor(0);
    console.log(temp,"temp");
   this.setData({
     userInfor: temp.data
   })
  },
  /**触底 */
  async onReachBottom() {
    wx.showLoading({
      title: '正在加载中',
    })
    const temp = await getuserInfor(this.data.impleNumber+1);
    this.setData({
      impleNumber: this.data.impleNumber + 1,
      userInfor: this.data.userInfor.concat(temp.data) 
    })
    wx.hideLoading();
  },

  onReady: function () {
    this.onShow();
    this.setData({
      impleNumber:0
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.onReady();
  },
})