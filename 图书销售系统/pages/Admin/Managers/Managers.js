
const db = wx.cloud.database();
const _ = db.command;
import { isAdmin } from "../../../utils/AdminDb.js";
Page({
  data: {
      //  name:"",
      //  openid:"",
      Managers:[],//管理人员列表
    isHidden: false ,//删除按钮
  },
  onShow:async function () {
    try {

      const res = await isAdmin();
      if (res.data.length == 1) {
        this.setData({
          Managers: res.data,
          isHidden: true
        })
      } else {
        this.setData({
          Managers: res.data
        })
      }

    } catch (error) {
      wx.showToast({
        title: '网络繁忙',
      })
    }
   
  },
  /**添加管理员 */
  getValue(e){
    if (!e.detail.value.name && !e.detail.value.openid){
      console.log("数据不能为空");
    }else{
      wx.cloud.callFunction({
        name: 'Managers',
        data: {
          name: e.detail.value.name,
          openid: e.detail.value.openid
        },
        success: res => {
          wx.showToast({
            title: '成功添加管理员',
          });
          this.setData({
            isHidden: false
          })
          this.onShow();
        }
      })
    }//else
  },

/**删除 管理员*/
  deleteManagers(e){
    wx.cloud.callFunction({
      name: 'Managers2',
      data: {
        _id:e.currentTarget.dataset._id
        },
          success: res => {
            wx.showToast({
              title: '删除成功',
            });
            this.onShow();
          }
  })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onShow();
  },

})