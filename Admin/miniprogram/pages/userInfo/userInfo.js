const app = getApp();
Page({
  data: {
    img: [],
    userInfo: null,
  },
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    delete this.data.userInfo._id
  },
  RegionChange: function(e) {
    this.setData({
      "userInfo.city": e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: 'original', //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          'img': res.tempFilePaths
        })
      }
    })
  },

  DelImg(e) {
    wx.showModal({
      title: '摄影师',
      content: '确定要删除这个头像吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.setData({
            img: []
          })
        }
      }
    })
  },
  //表单提交按钮

  formSubmit: function(e) {
    //时间，文章内容，图片
    var that = this;

    that.setData({
      loadModal: true
    })
    if (that.data.img.length > 0) {
      var image = that.data.img[0];
      wx.cloud.init();
      var temp = image.split("/");
      var name = temp[temp.length - 1]; //得到图片的名称
      wx.cloud.uploadFile({
        cloudPath: "images/" + name,
        filePath: image, // 文件路径
      }).then(res => {
        that.setData({
          "userInfo.signature": e.detail.value.signature,
          "userInfo.url": res.fileID
        })
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 2000)
      })
    }else{
      console.log(e.detail.value.signature)
      that.setData({
        "userInfo.signature": e.detail.value.signature,
      })
      setTimeout(() => {
        this.setData({
          loadModal: false
        })
      }, 2000)
    }
  },

  submit: function(e) {
    var that = this
    wx.cloud.callFunction({
      name: 'editUserInfo',
      data: {
        userInfo: that.data.userInfo,
      },
      success: function(res) {

        wx.showModal({
          title: '结果',
          content: res.result ? '成功' : '失败',
          showCancel: false,
          confirmText: '关闭',
        })
        if (res.result) {
          wx.navigateBack()
        }

      }
    })
  }
})