
// import { getSetting, chooseAddress, openSetting} from "../../utils/asyncWx.js";
/*import regeneratorRuntime from '../../lib/runtime/runtime';*/

Page({
  data:{
    address:{},
    gouwuche:[],
    allChecked:false, /*全选框数据  */
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    //获取 缓存中的收货地址
    let address=wx.getStorageSync("address");
    //1获取缓存中的购物车数据
    const gouwuche=wx.getStorageSync("gouwuche")||[];/*若是缓存中有空数组 就让他们定义为数组 */
    this.setData({address});
    this.setCart(gouwuche);
  },
  /***************************************************************************************** */
  //点击 获取收货地址
  handleChooseAddress(){
  //1 获取权限状态 主要发现一些 属性名很怪异的时候 都要使用[]形式来获取属性值
    wx.getSetting({ //获取用户的当前设置
      success: (result) => {
       const scopeAddress=result.authSetting["scope.address"];//授权通信地址
        if (scopeAddress===true||scopeAddress==undefined){
          wx.chooseAddress({
            success: (address)=>{
            //将数据存入缓存
              address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
              wx.setStorageSync("address", address)
            }
          });
        }else{
          //3  用户以前拒绝过授予权限 先诱导用户打开授权页面
          wx.openSetting({
            success: (result2)=> {
              //4 可以调用 收货地址代码
              wx.chooseAddress({
                success: (address) => {
                 // console.log(address);/将数据存入缓存
                  wx.setStorageSync("address", address)
                }
              });
            }
          })
        }
      }
    });
  },
/***************************************************************************************** */
  //商品的选中
  handleItemChange(e){
    //1 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
   //2 获取购物车数组
   let {gouwuche}=this.data;
    //3 找到被修改的商品对象
    let index = gouwuche.findIndex(v=>v.goods_id===goods_id);
    //4 选中状态取反
    gouwuche[index].checked = !gouwuche[index].checked;
    // 5.6把 购物车数据重新设置回data中和缓存中
    this.setCart(gouwuche);
  },
  //设置购物车状态同时 重新计算底部工具栏的数据  全选 总价格 购买的数量 封装
  setCart(gouwuche){
    let allChecked = true;
    //1 总数量 总价格 forEach循环
    let totalPrice = 0;
    let totalNum = 0;
    gouwuche.forEach(v => {
      console.log("v",v);  //v 循环gouwuche数组的对象
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    }),
      //判断数组是否为空
      allChecked = gouwuche.length != 0 ? allChecked : false;
    this.setData({
      gouwuche,
      allChecked,
      totalPrice: parseFloat((totalPrice).toFixed(2)),/**四舍五入保留2位小数点 */
      totalNum
    });
    wx.setStorageSync("gouwuche", gouwuche);
  },
  //商品全选功能
  handleItemAllCheck(){
    // 1 获取data中的数据
    let { gouwuche, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    gouwuche.forEach(v => v.checked = allChecked);
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(gouwuche);
  },
  //商品数量编辑功能
  handleItemNumEdit(e){
    //1 获取传递过来的参数
    const{operation,id}=e.currentTarget.dataset;
 //   console.log(operation,id);
    //2 获取购物车数组
    let {gouwuche}=this.data;
    //3 找到修改的商品的索引
    const index=gouwuche.findIndex(v=>v.goods_id===id);
    //4判断是否要执行删除
    if(gouwuche[index].num===1 && operation===-1){
      //4.1 弹窗提示
      wx.showModal({
        title: '提示',
        content: '您是否要删除？',
        //箭头函数 改变箭头指向
        success:(res)=>{  
          if(res.confirm){
            gouwuche.splice(index,1);
            this.setCart(gouwuche);
          }else if(res.cancel){}
        }
      })
    }else{
      //4 进行修改数量
      gouwuche[index].num += operation
      //5 设置回缓存和data中
      this.setCart(gouwuche);
    }
  },

  //点击结算
  handlePay(){
    //1 判断收货地址
  const {address,totalNum}=this.data;
    if(!address.userName){
      wx.showToast({
        icon:"none",
        title: '您还没有选择收货地址',
      })
      return;
    }
    //2 判断用户有没有选购商品
    if (totalNum===0){
      wx.showToast({
        icon: "none",
        title: '您还没有选购商品',
      })
      return;
    }
    //3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  },
  onPullDownRefresh: function () {
    this.onShow();
  },
})