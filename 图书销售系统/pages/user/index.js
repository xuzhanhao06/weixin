// pages/user/index.js
Page({
  data: {
    userinfo:{},
    //被收藏的商品数量
    collectNums:0,
    trackNums:0,
    money:0,
  },
  /*下拉事件 管理员事件 */
  onPullDownRefresh: function () {
    wx.navigateTo({
      url: '/pages/login/index?type=0',
    });
    this.onShow();
  },

  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    const collect = wx.getStorageSync("collect")||[];
    const track = wx.getStorageSync("track") || [];
    const money = wx.getStorageSync("money") || [];
    this.setData({ 
      userinfo, 
      collectNums:collect.length,
      trackNums:track.length,
      money: money
      });
  },

  popConfirm(){
    wx.showModal({
      title: '关于我们',
      content: '这是一个介绍弹窗',
      showCancel: false,//是否显示取消按钮
      success: function (res) {
        if (res.confirm) {
          console.log('点击确认回调')
        } else {
          console.log('点击取消回调')
        }
      }
    })
  },
  
  /** 管理收货地址*/
  handleChooseAddress() {
    //1 获取权限状态 主要发现一些 属性名很怪异的时候 都要使用[]形式来获取属性值
    wx.getSetting({
      success: (result) => {
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress == undefined) {
          wx.chooseAddress({
            success: (address) => {
              //  console.log(result1);
              //将数据存入缓存
              wx.setStorageSync("address", address)
            }
          });
        } else {
          //3  用户以前拒绝过授予权限 先诱导用户打开授权页面
          wx - wx.openSetting({
            success: (result2) => {
              //4 可以调用 收货地址代码
              wx.chooseAddress({
                success: (address) => {
                  // console.log(address);
                  //将数据存入缓存
                  wx.setStorageSync("address", address)
                }
              });
            }
          })
        }
      }
    });
  },
  
  clearStorage(){
    wx.showLoading({
      title: '正在清除中',
    });
    wx.clearStorage();
    wx.hideLoading();
    wx.showToast({
      title: '清除成功',
    });
    this.onShow();
  }



})