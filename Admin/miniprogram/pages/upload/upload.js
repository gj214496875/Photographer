const app = getApp();
var myDate = new Date();
Page({
  data: {
    index: null,
    category: null,
    loadProgress: 0,
    imgList: [],
    modalName: null,
    date: myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate(),
    region: ['重庆市', '重庆市', '沙坪坝区'],
    pics: {},
    textareaValue: ''
  },
  onLoad: function(options) {
    this.setData({
      region: app.globalData.userInfo.city,
      category: options.category
    })
  },
  DateChange(e) {
    this.setData({
      "date": e.detail.value
    })
  },
  RegionChange: function(e) {
    this.setData({
      "region": e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 50, //默认9
      sizeType: 'original', //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '摄影师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaInput(e) {
    this.setData({
      "textareaValue": e.detail.value
    })
  },
  //上传图片
  submitPic: function() {
    //时间，文章内容，图片
    var that = this;
    var imageFiles = that.data.imgList;
    that.setData({
      loadModal: true
    })
    wx.cloud.init();
    const db = wx.cloud.database(); //初始化数据库
    //for循环进行图片上传
    const p = []
    for (var i = 0; i < imageFiles.length; i++) {
      var imageUrl = imageFiles[i];
      var temp = imageUrl.split("/");
      var name = temp[temp.length - 1]; //得到图片的名称
      var n = wx.cloud.uploadFile({
        cloudPath: that.data.date + "/" + name,
        filePath: imageUrl, // 文件路径
      })
      p.push(n)
    }
    Promise.all(p).then(res => {
      var imagesID = []
      for (var i = 0; i < res.length; i++) {
        imagesID.push(res[i].fileID)
      }
      that.setData({
        "imgList": imagesID
      })
      setTimeout(() => {
        this.setData({
          loadModal: false
        })
      }, 2000)
    });

  },
  //表单提交按钮

  formSubmit: function(e) {
    var that = this;
    that.setData({
      "pics":e.detail.value,
      "pics.picUrls": that.data.imgList,
      "pics.fisstUrl": that.data.imgList[that.data.index],
    })
    wx.cloud.init();
    const db = wx.cloud.database(); //初始化数据库
    db.collection(this.data.category).add({
      data: this.data.pics
    }).then(res => {
      wx.navigateBack()
    })
  },
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
})