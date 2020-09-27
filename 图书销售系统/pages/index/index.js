import { getswiperdata, getGoods } from "../../utils/indexDb.js";

//获取应用实例
var app = getApp()
Page({
  data: {
    catitems: [
      {
        name:'订单界面',
        image_src:"cloud://stu-z3quc.7374-stu-z3quc-1300980404/小程序素材/全部订单.png",
        url:"/pages/order/index?type=1"
      },
      {
          name: '充值中心',
        image_src: 'cloud://stu-z3quc.7374-stu-z3quc-1300980404/小程序素材/充值中心.png',
          url: "/pages/Recharge/index" 
      },
      {
        name: '超级管理员',
        image_src: 'cloud://stu-z3quc.7374-stu-z3quc-1300980404/小程序素材/超级管理员.png',
        url: "/pages/Admin/index"
      },
      
    ],
    swiperdata: [],   //轮番图
    isRecommend:[],  //放推荐的商品信息
    impleNumber: 0, //触底 执行次数
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    try {
      wx.showLoading({
        title: '正在加载中',
        mask: true
      });
      let { swiperdata } = this.data;
      const sw = await getswiperdata(swiperdata);
      const isR = await getGoods(0);
      this.setData({
        swiperdata: sw.data[0].images || [],
        isRecommend: isR.data
      })
      wx.hideLoading();
    } catch (error){
      wx.hideLoading();
      wx.showToast({
        title: '网络繁忙',
      });
      }
   
  },
  //页面上滑 滚动条触底事件
  async onReachBottom() {
  try{
    wx.showLoading({
      title: '正在加载中',
    })
    const impleNumber = this.data.impleNumber + 1;
    const isR = await getGoods(impleNumber);
    if (isR.data.length) {
      this.setData({
        isRecommend: this.data.isRecommend.concat(isR.data),
        impleNumber: impleNumber
      })
      wx.hideLoading();
    } else {
      wx.showToast({
        title: '已经到世界尽头啦',
      })
    }
  } catch (error){
    wx.hideLoading();
    wx.showToast({
      title: '网络繁忙',
    });
  }
  },
  /*刷新*/
  onReady: function () {
    this.onLoad();
    this.setData({
      impleNumber: 0
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.onReady();
  },
})