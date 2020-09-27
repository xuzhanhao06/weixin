
import { getSearchList ,getSliderList} from "../../utils/goods_list.js";
Page({
  data: {
      tabs:[
        {
          id:0,
          value:"综合",
          isActive:true
        }, 
        // {
        //   id: 1,
        //   value: "销量",
        //   isActive: false
        // },
        {
          id: 2,
          value: "价格",
          isActive: false
        },
        {
          id: 3,
          value: "测试",
          isActive: false
        }
      ],
    goods:[],
    goodsPr:[],
     options:[], //页面触底判断用
    impleNumber:0, //触底 执行次数
  },

  /************************** */
  onLoad:async function (options) {
    //console.log(options.id)
    if (options.id){ //按类查找
      const search = await getSliderList(options.id,0);
      this.setData({
        goods: search.data,
        goodsPr: search.goodsPr,
        options: options
      })
    }
     if (options.search){ //如果传过来的是关键字
    const search= await getSearchList(options.search,0);
      this.setData({
        goods: search.data,
        goodsPr: search.goodsPr,
        options: options
      })
    }
  },
  // 标题点击事件 从子组件传递过来
  handletabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  //页面上滑 滚动条触底事件
 async onReachBottom(){
    wx.showLoading({
      title: '正在加载中',
    })
  const impleNumber=this.data.impleNumber+1;//触底次数+1

    if (this.data.options.id) { //按类查找
      const search = await getSliderList(this.data.options.id, impleNumber);
      this.setDatas(search,impleNumber);
    }
     if (this.data.options.search) { //如果传过来的是关键字
       const search = await getSearchList(this.data.options.search, impleNumber);
       this.setDatas(search, impleNumber);
    }
  },
  /**保存上拉触底数据 */
  setDatas(search, impleNumber){
    wx.hideLoading();
    if (!search.data.length) {
      console.log("search", search);
      wx.showToast({
        title: '已经到世界尽头啦！',
      })
    }
    this.setData({
      goods: this.data.goods.concat(search.data),
      goodsPr: this.data.goodsPr.concat(search.goodsPr),
      impleNumber: impleNumber
    })
  },
  
  /** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
    this.setData({
      impleNumber: 0, //触底 执行次数
    })
    this.onLoad(this.data.options);
  },


})