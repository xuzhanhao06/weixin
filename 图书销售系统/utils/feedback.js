var util = require("util.js"); //时间
var DATE = util.formatDate(new Date());
const db = wx.cloud.database();
const _ = db.command;
/**上传图片 */
export const uploadFile = (filePath) => {
  return new Promise((resolve) => {
    let suffix = /\.\w+$/.exec(filePath)[0];
    // var filePath = res.tempFilePaths[0];
    const uploadTask = wx.cloud.uploadFile({
      cloudPath: "feedback/" + new Date().getTime() + suffix,
      filePath: filePath,
      success: function (res) {
        console.log(res);
        resolve(res);
      }
      
    });
    //  上传的百分比
    // uploadTask.onProgressUpdate(function (callback) {
    //   console.log(callback);
    // })
  })
}

/* 文字和图片的fileID 上传到数据库里*/

export const addFeed = (textVal,file_ID) =>{
  return new Promise((resolve, reject) => {
    db.collection("Feedback").add({
    data: {
      time: DATE,
      textVal: textVal,
      file_ID: file_ID
    }
  }).then(res => {
    resolve(res);
  });

  })
}