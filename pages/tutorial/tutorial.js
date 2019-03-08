// pages/card/card.js
var app = getApp()
Page({
  data: {
    enshrine: '',
    like: '',
    src: '',
    dianzanData: {},
    dianzan: 'hidden',
    shoucangData: {},
    shoucang: 'hidden',
    renqiData: {},
    linkUrl: app.globalData.imgUrl,
    renqi: 'hidden'
  },
  calling: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '淘宝天猫优惠券领取教程',
      path: '/pages/tutorial/tutorial',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500,
      mask: 'true'
    });

    console.log(options);

    var that = this;

    var myOpenId = wx.getStorageSync('myOpenId');
    var openId = options.openId;

    console.log(openId);
    var shareId = options.shareId;


  },

  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})