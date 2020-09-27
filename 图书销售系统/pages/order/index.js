
import { getCustOrder, getDealOrder, getReceiOrder } from "../../utils/orderDb.js";
Page({
  data: {
    orders:[],
    LoadNumber:0, //加载次数
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待发货",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "已收货",
        isActive: false
      }      
    ]
  },

 async onShow(options){
   //判断是否授权了授权
   const openid=wx.getStorageSync("openid");
   if (!openid){
      wx.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }
   // 1 获取当前的小程序的页面栈-数组 长度最大是10页面 
   let pages = getCurrentPages();
   // 2 数组中 索引最大的页面就是当前页面
   let currentPage = pages[pages.length - 1];
   // 3 获取url上的type参数
   const { type } = currentPage.options;
   // 4 激活选中页面标题 当 type=1 index=0 
   this.changeTitleByIndex(type - 1);
  //  this.getCustOrder(openid);
  try{
    const allorder = await getCustOrder(openid, 0); //获取所有订单
    const DealOrder = await getDealOrder(openid, true); //获取已处理订单 也就是待收货订单
    const NoDealOrder = await getDealOrder(openid, false); //获取未处理订单 也就是待发货订单
    const ReceiOrder = await getReceiOrder(openid);  //获取确认收货订单
    console.log("NoDealOrder", NoDealOrder.data);
    this.setData({
      allorder: allorder.data,
      ordersDeal: DealOrder.data,
      NoDealOrder: NoDealOrder.data,
      ReceiOrder: ReceiOrder.data,
    })
  } catch (error){
    wx.showToast({
      title: '网络繁忙，请稍后重试',
    })
  }
   
 },
//根据标题索引来激活选中标题数组
  changeTitleByIndex(index){
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  handletabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    //2 重新发送请求 type=1 index=0
  },

  /**触底事件 */
  async onReachBottom() {
    try{
      wx.showLoading({
        title: '正在加载中',
        mask: true
      });
      if (this.data.tabs[0].isActive) {
        const LoadNumber = this.data.LoadNumber + 1;
        const allorder = await getCustOrder(this.data.openid, LoadNumber); //获取所有订单
        wx.hideLoading();
        if (allorder.data.length == 0) {
          wx.showToast({
            title: '已经到低啦！',
          })
        }
        this.setData({
          allorder: this.data.allorder.concat(allorder.data),
          LoadNumber: LoadNumber
        })
      }
      else{
        wx.hideLoading();
      }
    }catch{
      wx.showToast({
        title: '网络繁忙，请稍后重试',
      })
    }


  },


})