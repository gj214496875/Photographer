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
    city:null,
    category:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      category: options.category
    })
    this.loadFiles()
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
    this.loadFiles()
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
      .skip((this.data.pagenum - 1) * 15) // 跳过结果集中的前 15 条，从第 16 条开始返回
      .limit(15) // 限制返回数量为 15 条
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
    if (this.total <= this.pagenum * 15) {
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

  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  edit: function() {
    wx.navigateTo({
      url: '/pages/upload/upload?category='+this.data.category
    })
  },
  del: function(e) {
    var that = this
    wx.cloud.callFunction({
      name: 'delPics',
      data: {
        urls: e.currentTarget.dataset.urls,
        id: e.currentTarget.dataset.workid,
        co:that.data.category
      },
      success: function(res) {
        that.setData({
          pagenum: 1, //更新当前页数
          b: true,
        })
        that.loadFiles()
        wx.showModal({
          title: '结果',
          content: res.result ? '成功' : '失败',
          showCancel: false,
          confirmText: '关闭',
        })

      }
    })

  }

})