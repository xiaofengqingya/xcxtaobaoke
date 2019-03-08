//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [

    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    linkUrl: app.globalData.imgUrl,
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
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '软件开发-网站建设、微信小程序、微商城、微分销、电商平台、App、网络推广',
      path: '/pages/about/about',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        linkUrl: app.globalData.imgUrl,
      })
    });
    wx.request({
      url: app.globalData.alimamaApi,
      data: {
        opt: 'setNavbar',
        type: 2,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == "1") {
          that.setData({
            navbar: res.data.content,
          })
        }
      }
    });//控制底部导航
  }
})
