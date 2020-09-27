// dedemo/pages/index/index.js 全局变量
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载 stu - z3quc
   */
  onLoad: function (options) {
    // db.collection('article').get().then(res=>{
    //   console.log(res);
    // })

    this.adddemo();

 // this.getdemo();
  //this.removedemo();  //删除
 // this.updatedemo();

  },
  updatedemo:function(){
 /*   db.collection("article").doc("8d65afde5e4d1a590102a60d55b16073").update({
     data:{
       author: "知了知了"
     } 
    }).then(res=>{
      console.log(res);
    })*/
    db.collection("article").doc("8d65afde5e4d1a590102a60d55b16073").set({
      data:{
        title:"大更新",
        author:"zzzzzz",
        content:"2333333"
      }
    }).then(res=>{
      console.log(res);
    });




  },



  removedemo:function(){
    db.collection("article").doc("e30d61715e4d0bbf00fa0c2b5608bfaa"
).remove().then(
  res=>{
    console.log(res);
  }
);
  },


  getdemo:function(){
//     db.collection("article").doc("eb989008-ee40-4c90-8d58-fe01ab1198a6"
// ).get().then(res=>{
//   console.log(res);
// })  获取指定数据

  const _=db.command;//查询数据
  db.collection("article").where({
    pub_date: _.gte(new Date("2020/2/19 17:40:00"))
  }).get().then(res=>{
    console.log(res);
  })
  },

  adddemo:function(){
    db.collection("article").add({
      data:{
        title:"修改标题",
        author:["人名","数字"],
        pub_date:new Date(),
        content:"修改的内容",
        tags:['1','sdf2']
      }
    }).then(res=>{
        console.log(res);
      });
  }



})