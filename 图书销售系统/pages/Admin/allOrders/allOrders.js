import { getOrdersList } from "../../../utils/Admin-allOrders.js";
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    isdeal: false,
    impleNumber: 0, //触底 执行次数
    orders_deal: [],//已处理订单列表
    orders_nodeal: []//未处理订单列表
  },
  onShow:async function () {
    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      impleNumber: 0, //触底 执行次数
      orders_deal: [],//已处理订单列表
      orders_nodeal: []//未处理订单列表
    })
    this.isDealOrders(await getOrdersList(0));
  },
  //页面上滑 触底事件
  async onReachBottom() {
    wx.showLoading({
      title: '正在加载中',
    })
  const res= await getOrdersList(this.data.impleNumber+1);
    this.isDealOrders(res);
    this.setData({
      impleNumber: this.data.impleNumber + 1
    })
    },
    /**下拉刷新 */
  onPullDownRefresh: function () {
    this.onShow();
  },
/**更新数据库 */
  DBmarkDeal: function (dbid) {
    console.log("dbid", dbid);
    if (!dbid) {return}
    db.collection('CustOrder').doc(dbid).update({
      data: {
        isDeal: true
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功：', dbid)
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  }, 

/**点击处理的按钮 */
  markDeal:function(e){
    console.log("点击处理的按钮传过来的值",e);
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '确定标记为已处理？',
      success:function(res){
        if(res.confirm){
          /**用户点击了确认按钮 */
        var item=e.currentTarget.dataset.obj;
        var index=e.currentTarget.dataset.index;
        let dbid=e.currentTarget.dataset.dbid;
        let orders_deal = _this.data.orders_deal;
        let orders_nodeal = _this.data.orders_nodeal;        
        orders_deal.push(item);
        orders_nodeal.splice(index,1);
        _this.setData({
          orders_deal:orders_deal,
          orders_nodeal:orders_nodeal
        });
          _this.DBmarkDeal(dbid);
        }else if(res.cancel){
          console.log("用户点击取消");
        }
      }
    })
  },
/**点击已处理的按钮 end*/

  /*改变isdeal */
  changeDeal:function(e){
    this.setData({
      isdeal:!this.data.isdeal
    })
  },

/**处理数据库查找出来的订单进行分类 */
isDealOrders(res){
    this.setData({
      orders: res.data,
    })
    var orders = this.data.orders;
    var orders_deal = [];
    var orders_nodeal = [];
    for(let i = 0; i<orders.length; i++) {
    if (orders[i].isDeal) {
      orders_deal.push(orders[i]);
    } else {
      orders_nodeal.push(orders[i]);
    }
  }
  this.setData({
    orders_deal: this.data.orders_deal.concat(orders_deal),
    orders_nodeal: this.data.orders_nodeal.concat(orders_nodeal),
  })
  wx.hideLoading();
  if (!res.data.length) {
    wx.showToast({
      title: '已经到底啦',
    })
  }
}

})