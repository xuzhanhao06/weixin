Page({
  onLoad: function (options) {
    // wx.setNavigationBarTitle({
    //   title: '搜索中心'
    // })
   // this.getGoods();
  },
  //输入框的值改变 就会触发的事件
  handleInpt(e) {
    // console.log(e);
    //1 获取输入框的值
    const { value } = e.detail;
    //2 检测合法性
    if (!value.trim()) {
      //输入后撤销，重新隐藏按钮
      this.setData({
        isFocus: false
      });
      //值不合法
      return;
    }
    //3 准备发送请求接收数据
    //3.1 显示按钮
    this.setData({
      isFocus: true,
      search: value
    })

  },
  //发送请求 获取搜索建议 数据


  //点击 取消 按钮的事件
  handleCancel() {
    this.setData({
      inputValue: "",
      isFocus: false,
    })

  }
})