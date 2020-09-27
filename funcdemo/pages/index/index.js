App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // wx.cloud.callFunction({
    //   name:"login",
    //   success:res=>{
    //     console.log(res);
    //   },
    //   fail:err=>{
    //     console.log(err);
    //   }
    // })
/*    wx.cloud.callFunction({
      name:"add",  相加例子
      data:{
        a:1,
        b:4
      },
      success:res =>{
        console.log(res);
      },
      fail:err =>{
        console.log(err)
      }
    })*/  

    /*如何在云函数数据端操作数据库 调用
  wx.cloud.callFunction({
    name:"article",
    success:res=>{
      console.log(res);
    }
  })*/

  //2 .如何在云函数中发送HTTP请求
  /*  wx.cloud.callFunction({
      name:"joke",
      success:res=>{
        console.log(res);
      }
    })*/

    //3 文字内容安全检测
  wx.cloud.callFunction({
    name:"msgCheck",
    data:{
      content: "特3456书yuuo莞6543李zxcz蒜7782法fgnv级"
    },
    success:res=>{
      console.log(res);
    },
   /* fail:err=>{
      console.error(err);
    }*/
  })


  },

  


  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
