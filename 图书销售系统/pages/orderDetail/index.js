
import { getOrdersList, updataReceiving, getCustomerInf} from "../../utils/orderDetailDb.js";
Page({
  data: {
    orders:[],
    isHidden:true,
  },
  onLoad: async function (options) {
    if (options.order_number){
      this.setData({
        order_number: options.order_number
      })
     const res= await getOrdersList(options.order_number);
        this.setData({
        orders: res.data[0],
        })
    }
    if (options.isAdmin){
      this.setData({
        isHidden:false
      })
    }
  },
  /**确认收货 */
 Receiving(e){
   wx.showModal({
     title: '',
     content: '是否确认收货',
     success: res=> {
       if (res.confirm) {
         this.query(); //确定收货操作
         console.log('点击确认回调')
         
       } else {
         console.log('点击取消回调')
       }
     }
   })
  } ,//Receiving,
async query(){
  try {
    wx.showLoading({
      title: '正在确认收货',
      mask: true
    });
    await updataReceiving(this.data.orders._id);
    wx.navigateBack({
      delta: 1,
    })
  } catch (error) {
    wx.showToast({
      title: '收货失败，请稍后在试',
    })
  }
},

  /**管理员 特权 确认退款 */
 async bindRefund(){
   try {
     wx.showLoading({
       title: '正在退款中',
     })
     /**查找用户余额 */
     const res = await getCustomerInf(this.data.orders._openid);
     const money = Number(res.data[0].money) + Number(this.data.orders.totalPrice);
     /**更新余额 */
     wx.cloud.callFunction({
       name: 'MoneyModify',
       data: {
         _id: res.data[0]._id,
         money:parseFloat((money).toFixed(2))
       },
       success: res => {
         this.orderRemove();
       }
     })}catch(error){
       wx.hideLoading();
      wx.showToast({
        title: '退款失败',
      })
   }
    
  },
  /**删除订单 */
  orderRemove() {
    wx.cloud.callFunction({
      name: 'orderDetail-Remove',
      data: {
        _id: this.data.orders._id,
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '退款成功',
        });
        wx.navigateBack({
          delta: 1,
        });
      }
    })
  },
/**用户点击申请退款 */
  applyRefund(){
    wx.showLoading({
      title: '正在申请退款',
      mask:true
    })
    wx.cloud.callFunction({
      name: 'orderDetail-applyRefund',
      data: {
        _id: this.data.orders._id,
      },
      success: res => {
        wx.showToast({
          title: '申请退款成功',
        });
        wx.navigateBack({
          delta: 1,
        });
      }
    })
  }



})