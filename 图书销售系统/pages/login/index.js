const app = getApp();
import { onGetOpenid, query, addInfor } from "../../utils/loginDb.js"; //将数据库操作导入
Page({
  /**获取openid end */
  async handleGetUserInfo(e) {
    try{
      wx.showLoading({
        title: '正在登陆中',
        mask: true
      })
 /**获取openid */
    // 调用云函数 获取openid
    const { userInfo } = e.detail;
    const op=await onGetOpenid();
      app.globalData.openid = op.result.openid
      wx.setStorageSync("openid", op.result.openid);
      wx.setStorageSync("userinfo", userInfo);
      const res = await query(op.result.openid);   console.log("res", res);
      if (!res.data.length) {
        await addInfor(userInfo);
      }else{
        wx.setStorageSync("money", res.data[0].money);
      } 
        wx.hideLoading();
        wx.navigateBack({ //返回上个页面
          delta: 1
        });
    }catch(error){
      wx.hideLoading();
      wx.showToast({
        title: '登陆失败',
      })
    }
  },
  async onLoad(options){
    if (options.type){  //如果已经有opneid则更新 ，说明是个人中心里的下拉刷新
    const openid = wx.getStorageSync("openid");
    const res = await query(openid);
    wx.setStorageSync("money", res.data[0].money);
    wx.navigateBack({
      delta: 1,
    })
  }
}

})