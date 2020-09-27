// filedemo/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onFileSelectEvent:function(event){
   // console.log(event);
   wx.chooseImage({
     success: function(res) {
       //console.log(res);  上传文件
       var filePath=res.tempFilePaths[0];
      const uploadTask= wx.cloud.uploadFile({
         cloudPath:"abc.png",
         filePath:filePath,
         success:function(res){
           console.log(res);
         }
       });
      //  上传的百分比
       uploadTask.onProgressUpdate(function(callback){
         console.log(callback);
       })
     },
   })

  }
  
})