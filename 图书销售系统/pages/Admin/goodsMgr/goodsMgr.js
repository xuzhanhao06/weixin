import { getGoods, uploadFile, deleteFile} from "../../../utils/goodsMgrDb.js";
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    maxid: 0,
    goods:[],//存放商品信息
    coverBox:[],//封面
    contentBox:[],//图文详情
    swiperBox:[],//实拍
    isRecommend:"",//是否被推荐到首页
    impleNumber:0,//下拉执行次数
    itemList: ['科幻', '生活', "教育", '其他'],//分类
  },
  onShow: async function () {
    const res = await getGoods(0);
    this.setData({
      goods: res.data
    })
    this.getMaxid();
  },
  /**  Goods 找最大id */
  getMaxid: function () {
    let goods = this.data.goods,
      maxid = 0;
      //找最大ID
    for (let i = 0; i < goods.length; i++) {
      if (goods[i].goods_id > maxid) {
        maxid = goods[i].goods_id;
      }
    }
    this.setData({
      maxid: maxid
    })
  },
  //-----------------add-----------------------------------
  getValue: function (e) {
    wx.showLoading({
      title: '正在添加中',
      mask: true
    });
    this.setData({
      goods_id: this.data.maxid - 1 + 2,
      // goods_classify: e.detail.value.goods_classify,
      goods_title: e.detail.value.goods_title,
     // goods_Url: e.detail.value.goods_Url,
      goods_price: e.detail.value.goods_price,
    //  goods_swiper: e.detail.value.goods_swiper,
   //   goods_info_content: e.detail.value.goods_info_content,
      goods_stock: e.detail.value.goods_stock
    })
    this.addGood();
  },
  async addGood(){
    let goods = this.data.goods;
    let goods_id = this.data.goods_id;
    let  goods_classify = this.data.goods_classify;
    let  goods_title = this.data.goods_title;
  //  let  goods_Url = this.data.goods_Url;
    let  goods_price = this.data.goods_price;
  //  let goods_swiper = this.data.goods_swiper;
  //  let goods_info_content = this.data.goods_info_content;
    let goods_stock=this.data.goods_stock;
    if (!goods_id || !goods_classify || !goods_title || !goods_price || !goods_stock) {
      wx.showToast({
        icon: 'none',
        title: '请输入值, 必填值不能为空'
      });
      return
    }
    /* NaN: Not a Number判断价格单位*/
    if (isNaN(goods_price) || isNaN(goods_stock)) {
      wx.showToast({
        icon: 'none',
        title: goods_price + goods_stock+'价格或库存不是数字'
      });
      return
    }
    /* NaN: Not a Number判断价格单位end*/
    if (goods_stock < 0){
      wx.showToast({
        icon: 'none',
        title: goods_stock + '库存值不能为负数'
      });
      return
    }
    /*在goods数据库添加数据*/
    if (this.data.coverBox.length==0){
      wx.showToast({
        title: '封面图还没选择',
      }); return;
    }
   // console.log("cover:",cover);
    if (this.data.contentBox.length==0){
      wx.showToast({
        title: '图文详情还没选择',
      }); return;
    }
    if (this.data.swiperBox.length==0) {
      wx.showToast({
        title: '实拍图还没选择',
      }); return;
    }
    const goods_Url = await uploadFile(this.data.coverBox[0]);
    const goods_info_content = await uploadFile(this.data.contentBox[0]);
    const  goods_swiper=[];
    for (var i = 0; i < this.data.swiperBox.length; i++) {
      const swiperBox = await uploadFile(this.data.swiperBox[i]);
      goods_swiper.push(swiperBox.fileID);
      console.log("goods_swiper", goods_swiper);
    }
    
   //////////////////////////////////////
    db.collection("goods").add({
      data:{
        goods_Url: goods_Url.fileID,
        goods_classify: goods_classify,
        goods_id:goods_id,
        goods_price: goods_price,
        goods_title: goods_title,
        goods_swiper: goods_swiper,
        goods_info_content: goods_info_content.fileID,
        goods_stock: Number(goods_stock),
        isRecommend:this.data.isRecommend
      }
    }).then(res=>{
        console.log(res);
        this.getMaxid();
      wx.hideLoading();
        wx.showToast({
          title: '添加成功',
        });
        this.onShow();
      this.setData({ impleNumber: 0 })
       }); 
 /*再数据库添加end */
  },
  //---------------delete------------------------------
  deleteGoods:async function (e) {
    wx.showLoading({
      title: '正在消灭中',
      mask: true
    });
    console.log("点击删除按钮", e);
    let goods = this.data.goods;
    var index = e.currentTarget.dataset.index;
    var _id=e.currentTarget.dataset._id;
    var temp=e.currentTarget.dataset.item;
    var { goods_Url, goods_info_content, goods_swiper} = temp;
    for (var i = 0; i < goods_swiper.length;i++){
      await deleteFile(goods_swiper[i]);
    }
    await deleteFile(goods_Url); //删除数据库封面
    await deleteFile(goods_info_content);//删除数据库图文详情
    goods.splice(index, 1);
    this.setData({
      goods: goods,
    })
    console.log("删除后的goods数组",this.data.goods);
      this.getMaxid();
     this.removeGoodDB(_id);
  },

  //--------------syngoodDB------------------------
  removeGoodDB: function (_id) {
    db.collection('goods').doc(_id).remove({
      success: res => {
        console.log('[数据库] [更新记录] 成功：' );
        wx.hideLoading();
        wx.showToast({
          title: '消灭成功：' ,
        })
      },
      fail: err => {
          console.log('[数据库] [更新记录] 失败：', err);
      }
    })
  },
  //上传封面
  onCover(){
    var that = this;
    let coverBox = that.data.coverBox;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (coverBox.length>0){
          wx.showToast({
            title: '您已经选则了图片，请不要重复选则！',
          });return;
        }
        if (res.tempFilePaths.length>1){
          wx.showToast({title: '只能选择一张图片作为封面哦！',});return;
        }
        that.setData({
          coverBox: tempFilePaths
        });
      }
    })    
  },
  //上传图文详情
  onContent() {
    var that = this;
    let contentBox = that.data.contentBox;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (contentBox.length > 0) {
          wx.showToast({
            title: '您已选择图片！',
          });return;
        }
        if (res.tempFilePaths.length > 1) {
          wx.showToast({
            title: '只能选择一张图片哦！',
          });return;
        }
        that.setData({
          contentBox: tempFilePaths
        });
      }
    })
  },

//上传实拍
  onSwiper(){
    var swiperBox = this.data.swiperBox;
    console.log(swiperBox)
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
       // swiperBox = swiperBox.concat(tempFilePaths);//聚合操作符。连接字符串，返回拼接后的字符串。
        that.setData({
          swiperBox: tempFilePaths
        });
      }
    })
  },

/**是否推荐  */
  checkboxChange: function (e){
  console.log("e.detail.value",e.detail.value[0]);
  this.setData({
    isRecommend: e.detail.value[0]
  })
},
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.onShow();
  },

  /*触底事件*/
  //页面上滑 滚动条触底事件
  async onReachBottom() {
    wx.showLoading({
      title: '正在加载中',
    });
    const res = await getGoods(this.data.impleNumber + 1);
    this.setData({
      goods: this.data.goods.concat(res.data),
      impleNumber: this.data.impleNumber + 1
    })
    this.getMaxid();
    wx.hideLoading();
    if (!res.data.length){
    wx.showToast({
      title: '到尽头啦！',
    })
    }
  },
/**分类选择 */
  actioncnt: function () {
    wx.showActionSheet({
      itemList: this.data.itemList,
      success:res=> {
        this.setData({
          goods_classify:this.data.itemList[res.tapIndex]
        })
        wx.showToast({
          title: '添加成功',
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})