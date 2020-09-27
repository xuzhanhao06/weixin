import { getGoods, synDB } from "../../../utils/SellOutDb.js";
Page({
  data: {
    goods:[],  //已下架商品
    hiddenmodalput: true, //输入框是否隐藏
    _id:""  ,//当前商品的id
    modifyGoods_stock:Number,
    impleNumber:0 //触底次数
  },
  onShow:async function (options) {
  const res= await getGoods(0);
  this.setData({
    goods:res.data
  });
  },

//点击上架按钮
modalinput: function (e) {
    console.log(e);
        this.setData({
         hiddenmodalput: !this.data.hiddenmodalput,
          _id:e.target.dataset._id
        });
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm:async function (e) {
    this.setData({
      hiddenmodalput: true,
    });
    if (this.data.modifyGoods_stock <= 0 || isNaN(this.data.modifyGoods_stock)){
      wx.showToast({
        title: '请输入大于0的数字',
      })
      return;
    }
    else{
      await synDB(this.data.modifyGoods_stock, this.data._id);
      this.onPullDownRefresh();//刷新当前
    }
 
  },
  //输入值
  bindinput(e){
    this.setData({
      modifyGoods_stock: e.detail.value,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
    this.setData({
      impleNumber: 0 
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:async function () {
    wx.showLoading({
      title: '正在加载中',
    })
   const res= await getGoods(this.data.impleNumber + 1);
    this.setData({
      impleNumber: this.data.impleNumber + 1,
      goods: this.data.goods.concat(res.data),
    })
    wx.hideLoading();
    if (!res.data.length){
      wx.showToast({
        title: '已经到底了',
      })
    }
  },

})