
import { uploadFile, addFeed} from "../../utils/feedback.js";
Page({
  data: {
  //被选中的图片路径 数 组
    chooseImgs:[],
    //文本域的内容
    textVal:"",
    //图片在存储中的 file ID
    file_ID:[]
  },
  //外网的图片路径数组
  UpLoadImgs:[],

  //点击+ 选中图片事件
  handleChooseImg(e){
    //调用小程序内置选择图片API
    wx.chooseImage({
      //同时选中的图片数量
      count:9,
      //图片的格式 原图 压缩
      sizeType:['original','compressed'],
      //图片的来源 相册 照相机
      sourceType:['album','camera'],

      success: (res)=>{
         // console.log(res);
         this.setData({
           //图片数组 进行拼接
           chooseImgs: [...this.data.chooseImgs,...res.tempFilePaths] //...展开运算符
         })
      },
    })
  },
  // 点击 自定义删除图片组件
  handleRemoveImg(e){
    //2 获取被点击的组件的索引
    const { index } =e.currentTarget.dataset;
   // console.log(index);
   //3 获取data中的图片数组
   let{chooseImgs}=this.data;
   //4 删除元素
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  //文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //提交按钮点击事件
 async handleFormSubmit(e){
    //获取文本域的内容 图片数组
    const{textVal,chooseImgs}=this.data;
    //2 合法性的验证 (是否为空)
    if(!textVal.trim()){
      //不合法
      wx.showToast({
        title: '输入不合法',
        mask:true
      });
      return;
    }
    //3 准备上传图片 到专门的图片服务器
    //上传文件的api不支持多个文件同时上传 遍历数组 挨个上次
    //显示正在等等的图片
    wx.showLoading({
      title: '正在加载中',
      mask:true
    });
    //判断有没有需要上传的图片数组
    if (chooseImgs.length!=0){
      var file_ID = [];
      //console.log("chooseImgs", chooseImgs);
      for (var i = 0; i < chooseImgs.length;i++){
        var temp = await uploadFile(chooseImgs[i])
        file_ID.push(temp.fileID);
       // console.log("uu", uu);
      } 
      await addFeed(textVal,file_ID);
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
          }
    else{
      var file_ID = "";
      await addFeed(textVal, file_ID);
      wx.hideLoading();
    //  console.log("只是提交了文本");
      wx.navigateBack({
        delta:1
      });
    }
  }
 
})