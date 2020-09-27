const app = getApp()
const db = wx.cloud.database();//初始化数据库
Page({
  data: {
    imgbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值
    swiperdata: [],//存放图片数据链接  删除用到
  },
  // 删除照片 &&
  imgDelete: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 选择图片 &&&
  addPic: function (e) {
    var imgbox = this.data.imgbox;
    console.log(imgbox)
    var that = this;
    var n = 5;
    if (5 > imgbox.length > 0) {
      n = 5 - imgbox.length;
    } else if (imgbox.length == 5) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (5 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);//聚合操作符。连接字符串，返回拼接后的字符串。
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },

  //图片
  imgbox: function (e) {
    this.setData({
      imgbox: e.detail.value
    })
  },
  //发布按钮
  fb: function (e) {
    if (!this.data.imgbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      wx.showLoading({
        title: '上传中',
      })
      this.delPic();
      //上传图片到云存储
      let promiseArr = [];
      for (let i = 0; i < this.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.imgbox[i];
          let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
          wx.cloud.uploadFile({
            cloudPath: "swiper/" + new Date().getTime() + suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)//聚合操作符。连接字符串，返回拼接后的字符串。
              });
              console.log(res.fileID)//输出上传后图片的返回地址
              reslove();
              wx.hideLoading();
              wx.showToast({
                title: "上传成功",
              });
              wx.switchTab({
                url: '/pages/index/index',
              });
            },
            fail: res => {
              wx.hideLoading();
              wx.showToast({
                title: "上传失败",
              })
            }
          })
        }));
      }
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({ imgbox: [] });
        const _ = db.command;
        db.collection('swiper').doc("W5f_B69aramcuJ7S").update({
          data: {
            images: _.set(this.data.fileIDs)
          },
          success: res => {
            console.log('[数据库] [更新记录] 成功：', imagedbid);
            wx.showToast({
              title: '[数据库][更新记录] 成功：' + imagedbid,
            });
          },
          fail: err => {
            icon: 'none',
              console.log('[数据库] [更新记录] 失败：', err)
          }
        })
      })

    }
  },
  delPic: async function () {
    await this.getswiperdata();
    console.log("图片", this.data.swiperdata);
    for (var i = 0; i < this.data.swiperdata.length;i++){
      wx.cloud.deleteFile({
        fileList: [this.data.swiperdata[i]],
        success: res => {
          console.log(res.fileList)
        },
        fail: console.error
      })
    }
  },
  getswiperdata: function (e) {
    return new Promise(resolve => {
      const db = wx.cloud.database();
      db.collection('swiper').where({
        mark: "images"
      }).get({
        success: res => {
          this.setData({
            swiperdata: res.data[0].images || [],
            //数据库data1里的id
            // imagedbid: res.data[0]._id
          })
          console.log('[数据库] [查询记录] 成功: ', res);
          resolve();
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err);
          resolve(result);
        }
      })
    });
  },
/****************热门推荐**************************************************** */
  
})