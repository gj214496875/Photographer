// miniprogram/pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName: null,
    admin: false,
    user: null
  },
 
  formSubmit: function (e) {
    var md5 = require('../../utils/md5.js')
    if (this.data.user.password == md5.hexMD5(e.detail.value.password)) {
      this.setData({
        "admin": true
      })
    }

  },
  hideModal(e) {
    this.setData({
      admin: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection('customer').where({
      _id: '34ab1ee6-d428-45db-a0dc-6454d58040e4'
    }).get().then(res => {
      that.setData({
        user: res.data[0]
      })
      getApp().globalData.userInfo = res.data[0]
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})