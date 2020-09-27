
var util=require("../../utils/util.js"); //时间
import { getSliderList, synDB, synStock, updataStock} from "../../utils/asyncDb.js"; //将数据库操作导入
Page({
  data: {
    _id:'',  /*数据库的_id*/
    money:Number,
    // goods_Url:[], //放书的封面链接
    address: {},
    gouwuche: [],
 
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //获取 缓存中的收货地址
    const address = wx.getStorageSync("address");
    //1获取缓存中的购物车数据
    let gouwuche = wx.getStorageSync("gouwuche") || [];/*若是缓存中有空数组 就让他们定义为数组 */
    // 选中的购物车数组
     gouwuche=gouwuche.filter(v=>v.checked);
    this.setData({ address });
    let totalPrice = 0;
    let totalNum = 0;
    gouwuche.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } 
    }),
      //判断数组是否为空 
    this.setData({
      gouwuche,
      totalPrice: parseFloat((totalPrice).toFixed(2)),
      totalNum,
      address
    });
  },
  /*点击支付**************************************************************************************** */
 async handleOrderPay(){
   wx.showLoading({
     title: '正在支付中',
     mask: true
   });
   try {    //1 判断缓存中有没有openid
      const openid = wx.getStorageSync("openid");
      //2 判断 没有就跳转授权页面
      if (!openid) {
        wx.navigateTo({
          url: '/pages/login/index',
        });
        return;
      }
      /*获取当前账号余额 判断余额*/
      console.log("总价格：",this.data.totalPrice);
     const res = await getSliderList(openid); //查询customer_inf客户信息里的余额
     this.setData({
       money: res.data[0].money,
       _id: res.data[0]._id
     })
        if (this.data.money < this.data.totalPrice) {
          wx.showToast({
            title: '您的余额不足   ' + "余额为："+this.data.money,
            icon:'none'
          });
          return;
      } 
      /*获取当前账号余额  判断余额  end*/
      /**余额足够 去写入数据库 支付 */ 
    /*支付成功后 写入end */
      //3 创建订单
      const order_price = this.data.totalPrice;
      const gouwuche = this.data.gouwuche;
      let goods = [];
      gouwuche.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_price: v.goods_price,
        goods_number: v.num,
        goods_Url: v.goods_Url  
      }))
      console.log("支付串口的goods", goods);
     const bal = (this.data.money - this.data.totalPrice);
     await synDB(parseFloat((bal).toFixed(2)), this.data._id);/*更新当前账户的余额 */
    for (var i = 0; i < goods.length; i++) {
        var temp = await synStock(goods[i].goods_id); /**查询goods里的商品 找_id */
        await updataStock(temp, goods[i].goods_number);
     }

      this.addOrder(goods);/*新增订单 */
    }catch (error){
      wx.showToast({
        title: '支付失败',
      })
    }
  },
  /***************************************************************************************** */
  
  //*end */

  /*在order数据库新增订单  */
  addOrder:  function (goods){
    const db = wx.cloud.database();
    const _ = db.command;
    var DATE = util.formatDate(new Date());
    /**this.data.money+"" + this.data.totalPrice +""+ this.data.totalNum +""+ new Date().getTime(); */
    var order_number = this.data.totalNum + "" + new Date().getTime();
    var {avatarUrl}=wx.getStorageSync("userinfo")
    db.collection("CustOrder").add({
      data: {
        totalPrice: parseFloat((this.data.totalPrice).toFixed(2)) , //订单总价
        goods_address: this.data.address, //收货地址
         isDeal:false,  //管理员（商家）是否处理 发货
        order_detail: goods, //订单详情
        createTime: DATE,  //创建订单时间
        order_number: order_number,  //订单编号
        userUrl: avatarUrl,   //用户头像
        isReceiving:false ,  //是否收货
        isApplyRefund:false //用户是否点了申请退款
      }
    }).then(res => {
      wx.showToast({
        title: '支付成功',
        icon: 'success',
      });
      // 8 手动删除缓存中 已经支付了的商品
      let newCart=wx.getStorageSync("gouwuche");
          newCart=newCart.filter(v=>!v.checked);
          wx.setStorageSync("gouwuche", newCart);

      //8 支付成功了 跳转到订单页面
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/order/index?type=1',
      });
    });
  },
  /*新增订单end  */


  
})