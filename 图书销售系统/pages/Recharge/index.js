import { getRechargeCard, recharge, removeCard} from "../../utils/RechargeDb.js";
import { getSliderList } from "../../utils/asyncDb.js";//获取余额
Page({
  data: {
    openid:"",
    money:0,
    isHidden:true,
    _id:"",  //充值卡的id
  },
  onShow: function (options) {
    const openid=wx.getStorageSync("openid");
    if (openid){
      this.setData({
        openid: openid
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
  },

  async formSubmit(e){
    try{
      wx.showLoading({
        title: '正在查询中',
        mask: true
      });
      const card = e.detail.value.input;
      const temp = await getRechargeCard(card);
      this.setData({
        money: temp.data[0].money,
        _id: card,
        isHidden: false
      })
    wx.hideLoading();
    }catch(error){
    wx.showToast({
      title: '查询失败',
    })
    }
  },
  textPaste() {
    wx.showToast({
      title: '复制成功',
    });
    wx.setClipboardData({
      data: this.data.openid,
    })
  },

  /**下拉刷新 */
  onPullDownRefresh: function () {
    this.onShow();
  },
  /**充值此账号 */
 async charge(){
   try{
     wx.showLoading({
       title: '正在充值中',
       mask: true
     });
     /**1查询账号余额 */
     const res = await getSliderList(this.data.openid);
     console.log(res);
     var money = Number(this.data.money)+Number(res.data[0].money);
     console.log(money)
     // 更新账号余额
     await recharge(money, res.data[0]._id)
     //删除充值卡
     wx.cloud.callFunction({
       name: 'Recharge',
       data: {
         _id: this.data._id,
       },
       success: res => {
         wx.hideLoading();
           wx.showToast({
             title: '充值成功',
           });
           this.setData({
             isHidden:true
           })
       }
     })

   }catch(error){
     wx.hideLoading();
     wx.showToast({
       title: '充值失败，请稍后再试',
     })
   }
  }
})