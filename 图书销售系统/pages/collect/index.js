// pages/collect/index.js
Page({

  data: {
    collect:[],
    track:[],
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "浏览足迹",
        isActive: false
      }
    ]
  },

onLoad(options){
  const collect=wx.getStorageSync("collect")||[];
  const track = wx.getStorageSync("track")||[];
  if(options.type==1){
    let { tabs } = this.data;
    //确定页面显示
    tabs.forEach((v) => v.isActive === false ? v.isActive = true : v.isActive = false);
  this.setData({
    tabs
  })
  }
  this.setData({
    collect,
    track
  });

},

  handletabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组  
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false); //i为当前操作的数组索引
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
})