//index.js
const app = getApp()
import { isAdmin } from "../../utils/AdminDb.js";
Page({
 async onShow(){
    if (!wx.getStorageSync("openid")){
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    else{
      const openid =wx.getStorageSync("openid");
      try {
       const res= await isAdmin(openid);
        console.log("res.data.length", res.data.length);
        if (!res.data.length){
          wx.showModal({
          title: '提示',
          content: '您不是管理员哦~',
          showCancel: false,//是否显示取消按钮
          complete: function (res) { 
            wx.switchTab({
              url: '/pages/index/index',
            });
        },//接口调用结束的回调函数（调用成功、失败都会执行）
        })
        }else{
          wx.showToast({
            title: '欢迎管理员',
          })
        }

      }catch(error){
        wx.showModal({
          title: '提示',
          content: '网络繁忙~',
          showCancel: false,//是否显示取消按钮
          complete: function (res) {
            wx.switchTab({
              url: '/pages/index/index',
            });
          },//接口调用结束的回调函数（调用成功、失败都会执行）
        })

      }
    }
 }

})
