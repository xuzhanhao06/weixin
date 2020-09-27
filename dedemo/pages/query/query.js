// pages/query/query.js
const db = wx.cloud.database();
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
    //   this.orderbydemo(); 按条件排序
    //this.limitdemo();//限制读取条数
   // this.skipdemo();
   //this.fieddemo(); 限制返回值
   this.regexpdemo();
  },
regexpdemo:function(){
  db.collection("article").where({ 
       /*   title:/^aaa/i 找aaa开头  i表不区分大小写 正则表达式 模糊查找 */
    title: db.RegExp({
      regexp:"^aaa",
      options:"is"
    }) 
 
  }).get().then(res=>{
    console.log(res);
  })
},

  fieddemo:function(){
    db.collection("article").field({
      title:true,
      author:true
    }).get().then(res=>{
      console.log(res);
    })
  },



skipdemo:function(){
  //可以做翻页
db.collection("article").skip(2).limit(2).get().then(res=>{
  console.log(res);
})
},


limitdemo:function(){
db.collection("article").limit(2).get().then(res=>{
  console.log(res);
})
},


orderbydemo:function(){
db.collection("article").orderBy("pub_date","desc").get().then(res=>{
  console.log(res);  //没有日期 样式的 就会的当作最小的 
})
}




})