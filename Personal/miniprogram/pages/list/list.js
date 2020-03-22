// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    works: [],
    pagenum: 1, //初始页默认值为1
    total: 0,
    b: true,
    searchData: "*",
    category:null
  },

  showPic: function(e) {
    var model = JSON.stringify(e.currentTarget.dataset.model)
    wx.navigateTo({
      url: '/pages/info/info?model=' + model
    })
    // wx.previewImage({
    //   urls: e.currentTarget.dataset.urls,
    //   current: e.currentTarget.dataset.urls[0] // 当前显示图片的http链接      
    // })

  },
  showProfile: function(e) {
    wx.showModal({
      title: '作品简介',
      content: e.currentTarget.dataset.profile,
      showCancel: false,
      confirmText: '关闭',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      category: options.category, //更新当前页数
    })
    wx.setNavigationBarTitle({
      title: that.data.category//页面标题为路由参数
    })
    
    that.loadFiles()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pagenum: 1, //更新当前页数
      b: true,
    })
    this.loadFiles()
    setTimeout(function() {　　　　　　　　
      wx.hideNavigationBarLoading()　　　　
      wx.stopPullDownRefresh()　　　　
    })
  },

  loadFiles: function() {
    wx.cloud.init()
    const db = wx.cloud.database()
    const co = this.data.category
    db.collection(co).count().then(res => {
      this.setData({
        total: res.total
      })
    })

    db.collection(co)
      .orderBy('creatDate', 'desc')
      .skip((this.data.pagenum - 1) * 3) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(3) // 限制返回数量为 10 条
      .get().then(res => {
        if (this.data.b) {
          this.setData({
            works: res.data,
          })
        } else {
          var arr1 = this.data.works; //从data获取当前datalist数组
          var arr2 = res.data; //从此次请求返回的数据中获取新数组
          arr1 = arr1.concat(arr2); //合并数组
          this.setData({
            works: arr1,
          })
        }
      })

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.pagenum * 3) {
      var that = this;
      var pagenum = that.data.pagenum + 1; //获取当前页数并+1
      that.setData({
        pagenum: pagenum, //更新当前页数
      })
      this.setData({
        b: false,
      })
      this.loadFiles()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})