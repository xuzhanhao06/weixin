var util = require("../../../utils/util.js"); //时间
var DATE = util.formatDate(new Date());
Page({
  data: {
    _id:"",
    isHidden:true
  },
  onLoad: function (options) {

  },
  /**输入的文本 */
  formSubmit(e){
 //   console.log(e);
  const money=e.detail.value.input;
    if (isNaN(money) || !money ) {
      wx.showToast({
        title: '请输入数字',
      })
    }
    else{
      this.getcard(money);
    }
  }, 

  textPaste(){
    wx.showToast({
      title: '复制成功',
    });
    wx.setClipboardData({
      data: this.data._id,
    })
  },

/**添加卡号 */
  getcard(money){
    const db = wx.cloud.database();
    const _ = db.command;
     db.collection("RechargeCard").add({
        data: {
          time: DATE,
          money: money 
        }
      }).then(res => {
        console.log(res);
        this.setData({
          _id:res._id,
          isHidden:false
        })
        wx.showToast({
          title: '提取成功',
        })

      });
  }
})