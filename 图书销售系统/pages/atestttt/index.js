// pages/ceshi1/index.js

const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  aInput:"还没有输入",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  aaInput123(e){
   console.log(e);
   const aa= e.detail.value;
  this.setData({
    aInput:aa
  })

  },
 async asdasd(){

   await addInfor();//增加
   await synDB("54bac78c5ec7aa090013d4bb60e300a5");  //更新
  // await remove("463448e05ec774c2000a5cb71e422066");//删除
  //  const aaa= await findFF();
   // console.log(aaa.data[0].age);

  },

})


/**增加 */
export const addInfor = () => {
  return new Promise((resolve, reject) => {
    db.collection("test").add({
      data: {
        name: "aaaaa",
        age:123
      }
    }).then(res => {
      resolve(res);
    });
  })
}

/*更新 */
export const synDB = (_id) => {
  return new Promise((resolve, reject) => {
    db.collection('test').doc(_id).update({
      data: {
        name: _.set("asdasdas")
      },
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

/*删除*/
export const remove = (_id) => {
  return new Promise((resolve, reject) => {
    db.collection('test').doc(_id).remove({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

/* 查找*/
export const findFF = () => {
  return new Promise((resolve, reject) => {
    db.collection('test').where({
        age:123
    }).get({
      success: res => {
        console.log(res);
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}