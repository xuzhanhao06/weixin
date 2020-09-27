// pages/command/command.js
const db=wx.cloud.database();
const _=db.command;
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
   // this.eqcommand(); //相等
  //this.incommand(); //之间
  //this.andcommand();//与
  //this.orcommand();//或
  //this.setcommand();//可将字段数组变大变小
  //this.removecommand();//删除字段
  //this.inccommand(); //自增
  this.arrycommand();
  },

  
  arrycommand:function(){
    db.collection("article").doc("8d65afde5e4d1a590102a60d55b16073").update({
      data:{
        tags:_.unshift(["sd","ccc"])   //push  pop 
      }
    })
  },



  inccommand:function(){
    db.collection("article").doc("8d65afde5e4d1a590102a60d55b16073").update({
      data:{
        content:_.inc(3)
      }
    }).then(res=>{
      console.log(res);
    })
  },
removecommand:function(){
  db.collection("article").doc("8d65afde5e4d1a590102a60d55b16073").update({
    data:{
      author:_.remove()
    }
  }).then(res=>{
    console.log(res);
  })
},



setcommand:function(){
  db.collection("artcile").doc('8d65afde5e4d1a590102a60d55b16073').update({
    data:{
      author:{
        
      }
    }
  }).then(res=>{
    console.log(res);
  })
},




  orcommand:function(){
    // db.collection("article").where({
    //   pub_date: _.or(_.lt(new Date("2020/2/19 00:00:00" )),_.gt(new Date("2020/2/19 17:00:00")))
    // }).get().then(res=>{
    //   console.log(res);
    // })

    db.collection("article").where(_.or([
     {
       pub_date: _.gt(new Date("2020/2/19 20:00:00"))
     },{
       author:/北京/
     }
    ]) ).get().then(res => {
      console.log(res);
    })

  },



  andcommand:function(){
    // db.collection("article").where({
    //   pub_date: _.and(_.gte(new Date("2020/2/19 00:00:00")), _.lte(new Date("2020/2/19 23:59:59")))
    // }).get().then(res=>{
    //   console.log(res);
    // })

    db.collection("article").where({
      pub_date: _.gte(new Date("2020/2/19 00:00:00")).and(_.lte(new Date("2020/2/19 23:59:59")))//链式
    }).get().then(res => {
      console.log(res);
    })
  },



  incommand:function(){
    // db.collection("article").where({
    //   author:_.in(["北京日报","今日头条"])
    // }).get().then(res=>{
    //   console.log(res);
    // }   
    // )
     db.collection("article").where({
       tags:_.in(["生活"," "])
     }).get().then(res=>{
       console.log(res);
     }   
     )

  },

  eqcommand:function(){
    db.collection("article").where({
      author: _.eq("今日头条")
    }).get().then(res => {
      console.log(res);
    })
  }
  
})