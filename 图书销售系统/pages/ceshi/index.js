// pages/ceshi/index.js

const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
input:"暂无数据",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // const aa= await getCe();
    // console.log(aa);
    //  const bbb= await getAs(aa.data[0]._id);
  //const aa=await removeIn();
    // this.clO();
  },

  //删除充值卡
  clO(){
    wx.cloud.callFunction({
      name: 'Managers',
      data: {
        name: "g改gg",
        openid: [ "更随便了","sss"]
      },
      success: res => {

      }
    })
  },
  
  iInput(e){
// console.log(e);
    const input=e.detail.value;
    this.setData({
      input: input
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

export const getCe = () => {
  return new Promise((resolve, reject) => {
    db.collection('RechargeCard').where({
      _id: "5e847ab25ec2024d012b22324b97c09b"
    }).get({
      success: res => {
        resolve(res);
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '卡号不存在或输入错误'
        })
        reject(err);
      }
    })
  })
}

export const getAs = (id) => {
  return new Promise((resolve, reject) => {
    console.log(id);
    db.collection('RechargeCard').doc(id).update({
      data:{
        money:"1999"
      }
    })
      success: res => {
        resolve(res);
        console.log('[数据库] [查询记录] 成功: ', res)
      }
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '卡号不存在或输入错误'
        })
        reject(err);
      }
    })
}

export const removeIn = () => {
  return new Promise((resolve, reject) => {
    db.collection('Feedback').doc("d7e7dede5e75f3600013840e56aa1a6a").remove({
      success: res => {
        resolve(res);
      },
    fail: err => {
        reject(err);
      }
    })
  })
}

