
import { synStock } from "../../utils/asyncDb.js";
Page({
  data: {
    // 商品是否被收藏过 70
  isCollect:false,
  goods:{},
     goodid:Number,
  //  goodsPicsInfo:[],
  },
  // 商品对象
  GoodsInfo: {},
/***************************************************** */
  onShow: async function () {
   // console.log("onShow");  
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
      const {goods_id}=options;
      var that=this;
      console.log("goods_id:",goods_id);
    const res= await synStock(goods_id);
    console.log("res",res);
    this.setData({
      goodid: goods_id,
      goods:res.data[0]
    })
      that.GoodsInfo = this.data.goods;  //将data中的数据给GoodsInfo  
      console.log("这是that.GoodsInfo", that.GoodsInfo);
//足迹缓存
       let track = wx.getStorageSync("track")||[];
      // console.log("track[0]",track[0]);
      // console.log("track.length)",track.length); 
      for (var i = 0; i < track.length; i++) {
        if (track[i].goods_id == that.GoodsInfo.goods_id){
          track.splice(i, 1);break;
        }
      }
      track.push(that.GoodsInfo);
      wx.setStorageSync("track", track);
      // console.log(track);
      //1 获取缓存中的商品收藏的数组  能记住最后有没有保存 下次读取
      let collect = wx.getStorageSync("collect")||[];
      //2 判断当前商品是否被收藏
      let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
      this.setData({
        isCollect
      })
    },
//点击加入购物车
  handleCartAdd(){
    /*console.log("购物车");*/
    /*1 获取缓存中的购物车 数组 ，，||[] 意思为转化成数组 格式*/
    let gouwuche=wx.getStorageSync("gouwuche")||[];
   /* 2 判断 商品对象是否存在购物车数组中*/
    let index = gouwuche.findIndex(v => v.goods_id === this.GoodsInfo.goods_id); 
    /*获取当前的索引 ，若不存在为负一*/
    if(index===-1){
      /*3不存在 第一次添加 checked选中状态购物车用到 */
      this.GoodsInfo.num=1;
       this.GoodsInfo.checked=true;
      gouwuche.push(this.GoodsInfo);
    }else{
      /*4已经存在购物车数据 执行 num++*/
      gouwuche[index].num++;
    }
    /*5 把购物车重新添加回 缓存 中*/
    wx.setStorageSync("gouwuche",gouwuche);
    /*6 弹出 提示*/
    wx.showToast({
      title: '加入成功',
      icon:'success',
      /*mask:true 防止用户手抖，一值点击按钮 ，会1.5秒后才能继续点*/
      mask:true
    });
  },

//点击 商品收藏
  handleCollect(){
    let isCollect=false;
    //获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //2 判断改商品是否被收藏过
    let index =collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //3 当index！=-1 表示已经收藏过
    if(index!=-1){
      //能找到 已经收藏过le  在数组中删除商品
      collect.splice(index,1); //删一个
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:'true'
      });
    }else{
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: 'true'
      });
    }
    //4 把数组存入缓存中
    wx.setStorageSync("collect", collect);
    //5 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
}
})